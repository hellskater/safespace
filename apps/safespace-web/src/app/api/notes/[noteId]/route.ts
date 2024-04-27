import {
  deleteNoteInDb,
  getNoteById,
  updateNoteInDb,
} from "@/db/queries/notes";
import { getUserProfileFromDb } from "@/db/queries/users";
import { getUserProfileFromToken } from "@/lib/api/auth-helpers";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { NextResponse } from "next/server";
import { z } from "zod";

const UpdateNotePayloadSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
});

// PATCH /api/notes – update a note
export const PATCH = async (
  req: Request,
  {
    params: { noteId },
  }: {
    params: {
      noteId: string;
    };
  },
) => {
  try {
    const resp = await getUserProfileFromToken();

    if (!("id" in resp)) {
      return resp;
    }
    const body = await req.json();

    const payload = UpdateNotePayloadSchema.safeParse(body);

    if (!payload.success) {
      return new Response(
        JSON.stringify({ error: ReasonPhrases.BAD_REQUEST }),
        {
          status: StatusCodes.BAD_REQUEST,
        },
      );
    }

    const updateData = payload.data;

    const user = await getUserProfileFromDb(resp.identity);

    if (!user) {
      return new Response(JSON.stringify({ error: ReasonPhrases.NOT_FOUND }), {
        status: StatusCodes.NOT_FOUND,
      });
    }

    const existingNote = await getNoteById(Number(noteId));

    if (!existingNote) {
      return new Response(JSON.stringify({ error: ReasonPhrases.NOT_FOUND }), {
        status: StatusCodes.NOT_FOUND,
      });
    }

    if (existingNote.ownerId !== user.id) {
      return new Response(JSON.stringify({ error: ReasonPhrases.FORBIDDEN }), {
        status: StatusCodes.FORBIDDEN,
      });
    }

    const updatedData = await updateNoteInDb(Number(noteId), updateData);

    return NextResponse.json(updatedData);
  } catch (error) {
    console.error("PATCH /api/notes error: ", error);
    return new Response(
      JSON.stringify({ error: ReasonPhrases.INTERNAL_SERVER_ERROR }),
      {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      },
    );
  }
};

// DELETE /api/notes – delete a note
export const DELETE = async (
  req: Request,
  {
    params: { noteId },
  }: {
    params: {
      noteId: string;
    };
  },
) => {
  try {
    const resp = await getUserProfileFromToken();
    if (!("id" in resp)) {
      return resp;
    }

    const user = await getUserProfileFromDb(resp.identity);

    if (!user) {
      return new Response(JSON.stringify({ error: ReasonPhrases.NOT_FOUND }), {
        status: StatusCodes.NOT_FOUND,
      });
    }

    const existingNote = await getNoteById(Number(noteId));

    if (!existingNote) {
      return new Response(JSON.stringify({ error: ReasonPhrases.NOT_FOUND }), {
        status: StatusCodes.NOT_FOUND,
      });
    }

    if (existingNote.ownerId !== user.id) {
      return new Response(JSON.stringify({ error: ReasonPhrases.FORBIDDEN }), {
        status: StatusCodes.FORBIDDEN,
      });
    }

    const deletedNote = await deleteNoteInDb(Number(noteId));

    return NextResponse.json(deletedNote);
  } catch (error) {
    console.error("DELETE /api/notes error: ", error);
    return new Response(
      JSON.stringify({ error: ReasonPhrases.INTERNAL_SERVER_ERROR }),
      {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      },
    );
  }
};
