import type { NoteType } from "@/db/dto/note.dto";
import { cn } from "@ui/lib/utils";
import React from "react";
import dayjs from "dayjs";
import relative from "dayjs/plugin/relativeTime";
dayjs.extend(relative);

const NoteCard = ({
  data,
  isActive,
}: {
  data: NoteType;
  isActive: boolean;
}) => {
  return (
    <div
      className={cn(
        "p-3 px-4 rounded-md cursor-pointer hover:bg-yellow-100/30 transition-colors duration-200 ease-in-out",
        isActive && "bg-yellow-100 hover:bg-yellow-100",
      )}
    >
      <h2 className="truncate">{data.title}</h2>
      <p className="text-sm mt-2 text-gray-400">
        Created {dayjs(data.createdAt).fromNow()} on{" "}
        {dayjs(data.createdAt).format("MMM DD, YYYY")}
      </p>
    </div>
  );
};

export default NoteCard;
