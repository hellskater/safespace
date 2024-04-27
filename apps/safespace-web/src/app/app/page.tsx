"use client";

import AllNotes from "@/components/app/home/all-notes";
import NovelEditor from "@/components/editor";
import {
  useCreateNewNoteMutation,
  useDeleteNoteMutation,
  useGetAllNotesOfUserQuery,
  useUpdateNoteMutation,
} from "@/lib/hooks/api/useNotesQuery";
import { useGetUserKeyDetails } from "@/lib/hooks/api/useProfileQueries";
import {
  decryptJson,
  decryptString,
  encryptJson,
  encryptString,
} from "@/utils/encryption";

import { cn } from "@ui/lib/utils";
import { CustomAlert } from "@ui/components/custom/custom-alert";
import { NotebookPen, Trash2 } from "lucide-react";
import type { EditorInstance, JSONContent } from "novel";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { HiOutlineLockOpen, HiOutlineLockClosed } from "react-icons/hi";

const App = () => {
  // Local states
  const [isLocked, setIsLocked] = useState(false);
  const [selectedNote, setSelectedNote] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<{
    isEditing: boolean;
    value: string;
  }>({ isEditing: false, value: "" });

  // API calls mutations
  const { mutate: updateNote, isPending: isNoteUpdating } =
    useUpdateNoteMutation(selectedNote as number);
  const { mutate: createNote, isPending: isCreatingNote } =
    useCreateNewNoteMutation({
      setSelectedNote,
    });
  const { mutate: deleteNote, isPending: isDeletingNote } =
    useDeleteNoteMutation(selectedNote as number);

  // API calls queries
  const { data: keyDetails } = useGetUserKeyDetails();
  const { data: allNotesFromApi } = useGetAllNotesOfUserQuery();

  // effects
  useEffect(() => {
    if (allNotesFromApi?.length && !selectedNote) {
      setSelectedNote(allNotesFromApi[0]?.id ?? null);
    }
  }, [allNotesFromApi]);

  const userKey = keyDetails?.value || "";

  const targetNote = (() => {
    if (!selectedNote) {
      return null;
    }
    const note = allNotesFromApi?.find((note) => note.id === selectedNote);
    if (!note) {
      return null;
    }

    if (isLocked) {
      return note;
    }

    const decyptedNote = {
      ...note,
      title: decryptString(note.title, userKey),
      content: decryptJson(note.content, userKey) as JSONContent,
    };

    return decyptedNote;
  })();

  // for calling update api for updating the content
  const debouncedContentUpdates = useDebouncedCallback(
    async (editor: EditorInstance) => {
      if (!selectedNote) {
        return;
      }

      const json = editor.getJSON();

      const encryptedContent = encryptJson(json, userKey);

      updateNote({
        content: encryptedContent,
      });
    },
    1000,
  );

  // for calling update api for updating the title
  const debouncedTitleUpdates = useDebouncedCallback(async (title: string) => {
    if (!selectedNote) {
      return;
    }

    const encryptedTitle = encryptString(title, userKey);

    updateNote({
      title: encryptedTitle,
    });
  }, 1000);

  const handleNoteSelect = (noteId: number) => {
    setIsLocked(false);
    setSelectedNote(noteId);
  };

  const handleCreateNewNote = () => {
    const encryptedTitle = encryptString("Untitled", userKey);
    const encryptedContent = encryptJson(
      {
        type: "doc",
        content: [
          {
            type: "paragraph",
          },
        ],
      },
      userKey,
    );

    createNote({
      title: encryptedTitle,
      content: encryptedContent,
    });
    setSelectedNote(null);
  };

  const handleDelete = async () => {
    setIsDeleteModalOpen(false);
    deleteNote();
    setSelectedNote(null);
  };

  const isSaving = isNoteUpdating || isCreatingNote;

  return (
    <section className="safe-paddings flex justify-between">
      <section className="w-[35%] border-r h-screen overflow-y-auto stylized-scroll">
        <div className="w-full border-b px-5 py-3 flex items-center justify-between">
          {isLocked ? (
            <HiOutlineLockClosed
              onClick={() => setIsLocked(!isLocked)}
              className="w-5 h-5 text-red-500 p-1 box-content rounded-md bg-red-100 cursor-pointer"
            />
          ) : (
            <HiOutlineLockOpen
              onClick={() => {
                setSelectedNote(null);
                setTimeout(() => {
                  setIsLocked(!isLocked);
                }, 100);
              }}
              className="w-5 h-5 text-green-500 p-1 box-content rounded-md bg-green-100 cursor-pointer"
            />
          )}
          <Trash2
            className={cn(
              "w-5 h-5 ml-auto text-gray-500",
              selectedNote && "text-red-500 cursor-pointer",
              !selectedNote && "cursor-not-allowed",
            )}
            onClick={() => {
              if (selectedNote) {
                setIsDeleteModalOpen(true);
              }
            }}
          />
          {isDeleteModalOpen && (
            <CustomAlert
              open={isDeleteModalOpen}
              setIsOpen={setIsDeleteModalOpen}
              title={`Are you sure you want to delete note "${targetNote?.title}"?`}
              description="This action cannot be undone, this will permanently remove the note."
              handleSubmit={handleDelete}
              isSubmitting={isDeletingNote}
            />
          )}
        </div>
        <section className="py-5 px-3">
          <AllNotes
            handleNoteSelect={handleNoteSelect}
            selectedNote={selectedNote}
            isLocked={isLocked}
            handleCreateNewNote={handleCreateNewNote}
          />
        </section>
      </section>
      <section className="w-full">
        <div className="w-full border-b px-5 py-[0.75rem] flex items-center justify-between">
          <div className="flex items-center gap-5 w-full" title="New Note">
            <div onClick={handleCreateNewNote}>
              <NotebookPen className="w-5 h-5 ml-auto text-yellow-500 cursor-pointer" />
            </div>

            <input
              type="text"
              onFocus={() =>
                setEditingNote({
                  isEditing: true,
                  value: targetNote?.title || "",
                })
              }
              onBlur={() => {
                setEditingNote({
                  isEditing: false,
                  value: "",
                });
              }}
              value={
                editingNote.isEditing ? editingNote.value : targetNote?.title
              }
              disabled={!selectedNote}
              onChange={(e) => {
                setEditingNote({
                  isEditing: true,
                  value: e.target.value,
                });
                debouncedTitleUpdates(e.target.value);
              }}
              placeholder="Untitled"
              className="w-1/2 border-none outline-none ring-0 disabled:bg-background"
            />
          </div>

          {isSaving ? (
            <p className="text-orange-500 bg-orange-100 p-1 px-2 text-sm rounded-md">
              Saving...
            </p>
          ) : (
            <p className="text-green-500 bg-green-100 p-1 px-2 rounded-md text-sm">
              Saved
            </p>
          )}
        </div>
        <section className="p-5">
          <NovelEditor
            initialContent={(targetNote?.content as JSONContent) ?? null}
            debouncedContentUpdates={debouncedContentUpdates}
          />
        </section>
      </section>
    </section>
  );
};

export default App;
