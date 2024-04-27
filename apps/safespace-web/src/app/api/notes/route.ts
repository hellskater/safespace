import { createNoteInDb, getAllNotesForUser } from "@/db/queries/notes";
import { getUserProfileFromDb } from "@/db/queries/users";
import { getUserProfileFromToken } from "@/lib/api/auth-helpers";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { NextResponse } from "next/server";
import { z } from "zod";

// GET /api/notes – get the user's notes
export const GET = async ({}: Request) => {
  try {
    // return NextResponse.json([
    //   {
    //     id: 22,
    //     title: "U2FsdGVkX187vrxwXcBjykVShXjCpHcdErVUtUDqf2g=",
    //     content:
    //       "U2FsdGVkX1/QRmm5p6VK1Pu+MRxA8FfrNTyYpaeeHdC5mEASGbjwZ2tLD2YnSq0Qady2f1lfSTm5OC8zMgz6mg==",
    //     ownerId: 5,
    //     createdAt: "2024-04-27T11:42:52.915Z",
    //     updatedAt: "2024-04-27T11:42:52.915Z",
    //   },
    //   {
    //     id: 17,
    //     title: "U2FsdGVkX1+nYg5DRZHgQ8nFbWj9G2pAhmRi0sjCGJ4=",
    //     content:
    //       "U2FsdGVkX1/NNRj4j+jMClqgp2V4ysucdjR1bIxPuh/0IZOc1xwd5JoRTOaPEm5VQMKtjpvM5KtpaiEkeCBfX+e7wKZY/2hL+NcLz/ussr8QsOmLnKnQFxJYkZwdaDW6QgxD+ORiSFidtwLqqJOzyp5BrYS8L4QPxxRy41Ht05sVLX03PFFM/sknSS+rLosgNU5hWk68k3jE/0d9X5FM9bNRoQ6SuIjFQJU0OrEdxsUzJ58z/c+9mmzUNgc6uABJwQUCuBBIqjnxab60Iieq9KztDxQZ3zRCfzMBg5whvG/8DS4pdN5wTuDeXBtiPjgFXN0GR/ASQD2ABWOYyn0PMhCwJou3hv4+bh+hTYgAV/BAEB0djVGtw+ttd63F9YTSPUqCO3Xu2ljhXddvEnoWQz0oNW9wXuFWtzNHRt10WTRkXOmBUnAw1xlvspe7Q7K7BAnGl53qnDF/t6x5YjSW0gN/otxCQKfZz6i1ZDhiJlAChHsrsHehr788EeQKru9iLIf17JrYYY3IojU3CQjqFVYEj92QJT6Tagf4/cCd1+iYf4ztKmfPq8PytehofNo3eJnZ5SF3DpKslK9PfVlnZZvrV4Y5Yaewr4QQpo042wIe0E+JwQalJUiCL4vXYXHz0PvzvS21ipobceYDpW185DHI8Phq0qvv5JmC870QEs8rY9LSC5EAofVQTHv94GoF7WPpWEKdxCc+FjhWygwXWxajo/icsou42n28UyqPz7Sz1QZVxQv4V2XvTxXoEFLS",
    //     ownerId: 5,
    //     createdAt: "2024-04-27T09:44:43.591Z",
    //     updatedAt: "2024-04-27T09:44:43.591Z",
    //   },
    // ]);
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
