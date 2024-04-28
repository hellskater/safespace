import db from "@/db";
import { checkIfUserExistsInDb } from "@/db/queries/users";
import { notes as notesSchema } from "@/db/schema";
import { getUserProfileFromToken } from "@/lib/api/auth-helpers";
import { getVaultService } from "@/lib/pangea";
import { SQL, inArray, sql } from "drizzle-orm";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { NextResponse } from "next/server";
import { z } from "zod";

const RotateKeyPayloadSchema = z.object({
  newKey: z.string().min(1),
  oldKeyId: z.string().min(1),
  notesData: z
    .array(z.object({ id: z.number(), title: z.string(), content: z.string() }))
    .optional(),
});

// POST /me/key/rotate – rotate the user's key
export const POST = async (req: Request) => {
  try {
    // logged in user check
    const resp = await getUserProfileFromToken();
    if (!("id" in resp)) {
      // error, not logged in
      return NextResponse.json(resp);
    }

    // safespace db user check
    const dbResp = await checkIfUserExistsInDb(resp.identity);

    if (!dbResp?.userAlreadyExists) {
      return new Response(JSON.stringify({ error: ReasonPhrases.NOT_FOUND }), {
        status: StatusCodes.NOT_FOUND,
      });
    }

    const body = await req.json();

    const payload = RotateKeyPayloadSchema.safeParse(body);

    if (!payload.success) {
      return new Response(
        JSON.stringify({ error: ReasonPhrases.BAD_REQUEST }),
        {
          status: StatusCodes.BAD_REQUEST,
        },
      );
    }

    const { newKey, oldKeyId, notesData } = payload.data;

    try {
      const isSuccess = await rotateEncryptionSecret({
        id: oldKeyId,
        key: newKey,
      });

      if (isSuccess && notesData) {
        await updateMultipleNotes(notesData);
      }

      return new Response(JSON.stringify({ message: "Success" }));
    } catch (error) {
      console.error("rotateEncryptionSecret error: ", error);
      return new Response(
        JSON.stringify({ error: ReasonPhrases.INTERNAL_SERVER_ERROR }),
        {
          status: StatusCodes.INTERNAL_SERVER_ERROR,
        },
      );
    }
  } catch (error) {
    console.error("POST /api/signup error: ", error);
    return new Response(
      JSON.stringify({ error: ReasonPhrases.INTERNAL_SERVER_ERROR }),
      {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      },
    );
  }
};

const updateMultipleNotes = async (
  notes: {
    id: number;
    title: string;
    content: string;
  }[],
) => {
  const titleSqlChunks: SQL[] = [sql`(case`];
  const contentSqlChunks: SQL[] = [sql`(case`];
  const ids: number[] = [];

  for (const note of notes) {
    titleSqlChunks.push(sql`when id = ${note.id} then ${note.title}`);
    contentSqlChunks.push(sql`when id = ${note.id} then ${note.content}`);
    ids.push(note.id);
  }
  titleSqlChunks.push(sql`end)`);
  contentSqlChunks.push(sql`end)`);

  const finaltitleSql: SQL = sql.join(titleSqlChunks, sql.raw(" "));
  const finalContentSql: SQL = sql.join(contentSqlChunks, sql.raw(" "));

  await db
    .update(notesSchema)
    .set({
      title: finaltitleSql,
      content: finalContentSql,
    })
    .where(inArray(notesSchema.id, ids));
};

const rotateEncryptionSecret = async ({
  id,
  key,
}: {
  id: string;
  key: string;
}) => {
  try {
    const vaultService = getVaultService();
    const secretRotateResp = await vaultService.secretRotate(id, key);

    return secretRotateResp.success;
  } catch (error) {
    console.error("rotateEncryptionSecret error: ", error);
  }
};
