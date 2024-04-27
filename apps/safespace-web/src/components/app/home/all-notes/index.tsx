import React from "react";
import NoteCard from "./note-card";
import type { NoteType } from "@/db/dto/note.dto";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import dayjs from "dayjs";
import relative from "dayjs/plugin/relativeTime";
import calendar from "dayjs/plugin/calendar";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import { useGetAllNotesOfUserQuery } from "@/lib/hooks/api/useNotesQuery";
dayjs.extend(relative);
dayjs.extend(calendar);
dayjs.extend(isToday);
dayjs.extend(isYesterday);

import { match } from "ts-pattern";
import { Skeleton } from "@ui/components/ui/skeleton";
import { HeartCrack } from "lucide-react";
import { Button } from "@ui/components/ui/button";
import { useIsMounted } from "usehooks-ts";
import { decryptString } from "@/utils/encryption";
import { useGetUserKeyDetails } from "@/lib/hooks/api/useProfileQueries";

type AllNotesProps = {
  handleCreateNewNote: () => void;
  handleNoteSelect: (noteId: number) => void;
  selectedNote: number | null;
  isLocked: boolean;
};

const AllNotes = ({
  handleCreateNewNote,
  isLocked,
  selectedNote,
  handleNoteSelect,
}: AllNotesProps) => {
  const isMounted = useIsMounted();

  const { data: keyDetails, isLoading: isFetchingKey } = useGetUserKeyDetails();

  const userKey = keyDetails?.value || "";

  const { data: allNotesFromApi, isLoading: isNotesLoading } =
    useGetAllNotesOfUserQuery();
  // const allNotesFromApi = [];
  // const isNotesLoading = false;

  const formatData = () => {
    if (!allNotesFromApi) {
      return [];
    }

    // group the data by fromNow
    const groupedData = allNotesFromApi.reduce(
      (acc, curr) => {
        let fromNow;
        const createdAt = dayjs(curr.createdAt);

        if (createdAt.isToday()) {
          fromNow = "Today";
        } else if (createdAt.isYesterday()) {
          fromNow = "Yesterday";
        } else if (createdAt.isBefore(dayjs().subtract(6, "day"))) {
          fromNow = createdAt.format("D MMMM, YYYY"); // e.g., "24th March, 2024"
        } else {
          fromNow = createdAt.format("dddd"); // e.g., "Thursday"
        }

        if (!acc[fromNow]) {
          acc[fromNow] = [];
        }
        acc[fromNow]?.push(curr);
        return acc;
      },
      {} as Record<string, NoteType[]>,
    );

    // convert the object to array
    const formattedData = Object.entries(groupedData).map(([key, value]) => ({
      fromNow: key,
      data: value.map((note) => ({
        ...note,
        ...(isLocked
          ? { title: note.title }
          : { title: decryptString(note.title, userKey) }),
      })),
    }));

    return formattedData;
  };

  const finalData = formatData();

  return (
    <div className="space-y-3">
      {isMounted() &&
        match({ finalData, isNotesLoading, isFetchingKey })
          .with({ isNotesLoading: true }, { isFetchingKey: true }, () => {
            return Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-16" />
            ));
          })
          .with({ finalData: [], isNotesLoading: false }, () => (
            <div className="flex flex-col items-center justify-center">
              <div>
                <HeartCrack className="w-16 h-16 text-yellow-100" />
              </div>
              <p className="mt-2 text-yellow-500 text-sm">
                We did not find any notes for you.
              </p>
              <p className="mt-5 text-yellow-600 font-semibold">
                Create your first note now!
              </p>

              <Button
                onClick={handleCreateNewNote}
                className="mt-5 bg-yellow-600 hover:bg-yellow-500 transition-colors duration-200 text-white"
              >
                Create Note
              </Button>
            </div>
          ))
          .otherwise(({ finalData }) =>
            finalData.map((item) => (
              <div key={item.fromNow}>
                <h2 className="text-lg text-gray-400 font-semibold">
                  {item.fromNow}
                </h2>

                <NoteGroup
                  data={item.data}
                  selectedNote={selectedNote}
                  handleNoteSelect={handleNoteSelect}
                />
              </div>
            )),
          )}
    </div>
  );
};

export default AllNotes;

const NoteGroup = ({
  data,
  selectedNote,
  handleNoteSelect,
}: {
  data: NoteType[];
  selectedNote: number | null;
  handleNoteSelect: (noteId: number) => void;
}) => {
  const [animateRef] = useAutoAnimate();

  return (
    <div ref={animateRef} className="space-y-2 mt-3">
      {data.map((note) => (
        <div onClick={() => handleNoteSelect(note.id)} key={note.title}>
          <NoteCard
            key={note.id}
            data={note}
            isActive={selectedNote === note.id}
          />
        </div>
      ))}
    </div>
  );
};
