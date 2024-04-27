import axiosClient from "@/lib/axiosInstance";
import { QUERY_KEYS, URLS } from "./query-utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuthCookie } from "@/utils/cookies";
import { toast } from "sonner";
import type { NoteType } from "@/db/dto/note.dto";
import { z } from "zod";
import type { MyKeyType } from "@/types/key";
import type { Dispatch, SetStateAction } from "react";

// ------------------------------ GET all notes of user ------------------------------

export const getAllNotesOfUser = async () => {
  try {
    const resp: {
      data: NoteType[];
    } = await axiosClient.get(URLS.getAllNotes);

    return resp.data;
  } catch (error) {
    console.error("getAllNotesOfUser error: ", error);
  }
};

export const useGetAllNotesOfUserQuery = () => {
  const token = getAuthCookie();
  const queryClient = useQueryClient();
  const keyDetails = queryClient.getQueryData<MyKeyType>([
    QUERY_KEYS.PROFILE.GET_MY_KEY,
  ]);

  return useQuery({
    queryKey: [QUERY_KEYS.NOTES.GET_ALL_NOTES],
    queryFn: getAllNotesOfUser,
    enabled: !!token && !!keyDetails?.value,
  });
};

// ------------------------------ POST Create Note ------------------------------

export const CreateNotePayloadSchema = z.object({
  title: z.string().min(1),
  content: z.string(),
});

export type CreateNotePayloadType = z.infer<typeof CreateNotePayloadSchema>;

export const createNote = async (payload: CreateNotePayloadType) => {
  const resp: {
    data: NoteType[];
  } = await axiosClient.post(URLS.createNote, payload);

  return resp.data;
};

export const useCreateNewNoteMutation = ({
  setSelectedNote,
}: {
  setSelectedNote: Dispatch<SetStateAction<number | null>>;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createNote,
    onMutate: async (payload) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.NOTES.GET_ALL_NOTES],
      });

      const previousNotesData = queryClient.getQueryData<NoteType[]>([
        QUERY_KEYS.NOTES.GET_ALL_NOTES,
      ]);

      if (!previousNotesData) {
        return;
      }

      const newAllNotesData = [
        {
          ...payload,
          id: previousNotesData.length + 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        ...previousNotesData,
      ];

      queryClient.setQueryData(
        [QUERY_KEYS.NOTES.GET_ALL_NOTES],
        newAllNotesData,
      );

      return { previousNotesData };
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.NOTES.GET_ALL_NOTES],
      });
    },
    onError: (error, _, context) => {
      if (context?.previousNotesData) {
        queryClient.setQueryData(
          [QUERY_KEYS.NOTES.GET_ALL_NOTES],
          context?.previousNotesData,
        );
      }

      console.error("useCreateNewNoteMutation error: ", error);

      toast.error("Failed to save note");
    },
    onSuccess: (data) => {
      setSelectedNote(data[0]?.id ?? null);
    },
  });
};

// ------------------------------ PATCH update note ------------------------------

export const UpdateNotePayloadSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
});

export type UpdateNotePayloadType = z.infer<typeof UpdateNotePayloadSchema>;

export const updateNote = async (
  noteId: number,
  data: UpdateNotePayloadType,
) => {
  const resp: {
    data: NoteType;
  } = await axiosClient.patch(URLS.updateNote(noteId), data);

  return resp.data;
};

export const useUpdateNoteMutation = (noteId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateNotePayloadType) => updateNote(noteId, payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.NOTES.GET_ALL_NOTES],
      });

      const previousNotesData = queryClient.getQueryData<NoteType[]>([
        QUERY_KEYS.NOTES.GET_ALL_NOTES,
      ]);

      if (!previousNotesData) {
        return;
      }

      const updatedNotesData = previousNotesData.map((note) =>
        note.id === noteId ? { ...note, ...payload } : note,
      );

      queryClient.setQueryData(
        [QUERY_KEYS.NOTES.GET_ALL_NOTES],
        updatedNotesData,
      );

      return { previousNotesData };
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.NOTES.GET_ALL_NOTES],
      });
    },
    onError: (error) => {
      console.error("useUpdateNoteMutation error: ", error);

      toast.error("Failed to update note");
    },
    // onSuccess: () => {
    //   toast.success("Note updated successfully!");
    // },
  });
};

// ------------------------------ DELETE note ------------------------------

export const deleteNote = async (noteId: number) => {
  const resp = await axiosClient.delete(URLS.deleteNote(noteId));

  return resp.data;
};

export const useDeleteNoteMutation = (noteId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteNote(noteId),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.NOTES.GET_ALL_NOTES],
      });

      const previousNotesData = queryClient.getQueryData<NoteType[]>([
        QUERY_KEYS.NOTES.GET_ALL_NOTES,
      ]);

      if (!previousNotesData) {
        return;
      }

      const updatedNotesData = previousNotesData.filter(
        (note) => note.id !== noteId,
      );

      queryClient.setQueryData(
        [QUERY_KEYS.NOTES.GET_ALL_NOTES],
        updatedNotesData,
      );

      return { previousNotesData };
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.NOTES.GET_ALL_NOTES],
      });
    },
    onError: (error, _, context) => {
      if (context?.previousNotesData) {
        queryClient.setQueryData(
          [QUERY_KEYS.NOTES.GET_ALL_NOTES],
          context?.previousNotesData,
        );
      }

      console.error("useDeleteNoteMutation error: ", error);

      toast.error("Failed to delete note");
    },
    onSuccess: () => {
      toast.success("Note deleted successfully!");
    },
  });
};
