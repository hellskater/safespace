import db from "@/db";
import { getUserProfileFromDb } from "@/db/queries/users";
import { users } from "@/db/schema";
import { getUserProfileFromToken } from "@/lib/api/auth-helpers";
import { getVaultService } from "@/lib/pangea";
import { eq } from "drizzle-orm";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "edge";

// GET /api/me –get the user's profile
export const GET = async ({}: Request) => {
  try {
    const resp = await getUserProfileFromToken();
    if ("id" in resp) {
      const user = await getUserProfileFromDb(resp.id);
      return NextResponse.json(user);
    }
    return resp;
  } catch (error) {
    console.error("GET /api/me error: ", error);
    return new Response(
      JSON.stringify({ error: ReasonPhrases.INTERNAL_SERVER_ERROR }),
      {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      },
    );
  }
};

// PATCH /api/me – update the user's profile

const UserProfileUpdatePayloadSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  imageUrl: z.string().optional(),
  encryptionKey: z.string().optional(),
});

export const PATCH = async (req: Request) => {
  try {
    // logged in user check
    const resp = await getUserProfileFromToken();
    if (!("id" in resp)) {
      // error, not logged in
      return NextResponse.json(resp);
    }

    // safespace db user
    const userProf = await getUserProfileFromDb(resp.id);

    if (!userProf) {
      return new Response(JSON.stringify({ error: ReasonPhrases.NOT_FOUND }), {
        status: StatusCodes.NOT_FOUND,
      });
    }

    const body = await req.json();

    const payload = UserProfileUpdatePayloadSchema.safeParse(body);

    if (!payload.success) {
      return new Response(
        JSON.stringify({ error: ReasonPhrases.BAD_REQUEST }),
        {
          status: StatusCodes.BAD_REQUEST,
        },
      );
    }

    const userData = payload.data;

    if (userData.encryptionKey) {
      if (!userProf.encrytionKeyId) {
        return new Response(
          JSON.stringify({ error: ReasonPhrases.BAD_REQUEST }),
          {
            status: StatusCodes.BAD_REQUEST,
          },
        );
      }

      const rotateResp = await rotateEncryptionSecret({
        id: userProf.encrytionKeyId,
        newKey: userData.encryptionKey,
      });

      if (!rotateResp?.id) {
        return new Response(
          JSON.stringify({ error: ReasonPhrases.INTERNAL_SERVER_ERROR }),
          {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
          },
        );
      }

      // at this point we don't need to update db, since the id is the same, return userProf
      return NextResponse.json(userProf);
    }

    delete userData.encryptionKey;

    const updateResp = await db
      .update(users)
      .set(userData)
      .where(eq(users.pangeaId, resp.id));

    return NextResponse.json(updateResp);
  } catch (error) {
    console.error("PATCH /api/me error: ", error);
    return new Response(
      JSON.stringify({ error: ReasonPhrases.INTERNAL_SERVER_ERROR }),
      {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      },
    );
  }
};

const rotateEncryptionSecret = async ({
  id,
  newKey,
}: {
  id: string;
  newKey: string;
}) => {
  try {
    const vaultService = getVaultService();
    const secretGenResp = await vaultService.secretRotate(id, newKey);

    return secretGenResp.result;
  } catch (error) {
    console.error("generateEncryptionToken error: ", error);
  }
};
