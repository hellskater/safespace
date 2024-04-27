import { createNoteInDb, getAllNotesForUser } from "@/db/queries/notes";
import { getUserProfileFromDb } from "@/db/queries/users";
import { getUserProfileFromToken } from "@/lib/api/auth-helpers";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { NextResponse } from "next/server";
import { z } from "zod";

// GET /api/notes – get the user's notes
export const GET = async ({}: Request) => {
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

    const notes = await getAllNotesForUser(user.id);
    return NextResponse.json(notes);
  } catch (error) {
    console.error("GET /api/notes error: ", error);
    return new Response(
      JSON.stringify({ error: ReasonPhrases.INTERNAL_SERVER_ERROR }),
      {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      },
    );
  }
};

const CreateNotePayloadSchema = z.object({
  title: z.string().min(1),
  content: z.string(),
});

// POST /api/notes – create a new note
export const POST = async (req: Request) => {
  try {
    const resp = await getUserProfileFromToken();
    if (!("id" in resp)) {
      return resp;
    }
    const body = await req.json();

    const payload = CreateNotePayloadSchema.safeParse(body);

    if (!payload.success) {
      return new Response(
        JSON.stringify({ error: ReasonPhrases.BAD_REQUEST }),
        {
          status: StatusCodes.BAD_REQUEST,
        },
      );
    }

    const noteData = payload.data;

    const user = await getUserProfileFromDb(resp.identity);

    if (!user) {
      return new Response(JSON.stringify({ error: ReasonPhrases.NOT_FOUND }), {
        status: StatusCodes.NOT_FOUND,
      });
    }

    const newNote = await createNoteInDb({
      ...noteData,
      ownerId: user.id,
    });
    return NextResponse.json(newNote);
  } catch (error) {
    console.error("POST /api/notes error: ", error);
    return new Response(
      JSON.stringify({ error: ReasonPhrases.INTERNAL_SERVER_ERROR }),
      {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      },
    );
  }
};
