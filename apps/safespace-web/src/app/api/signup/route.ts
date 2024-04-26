import db from "@/db";
import { checkIfUserExistsInDb, createUserInDb } from "@/db/queries/users";
import { users } from "@/db/schema";
import { getUserProfileFromToken } from "@/lib/api/auth-helpers";
import { getVaultService } from "@/lib/pangea";
import { eq } from "drizzle-orm";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { NextResponse } from "next/server";

// POST /api/signup – create a new user
export const POST = async (req: Request) => {
  try {
    const body = await req.json();

    // logged in user check
    const resp = await getUserProfileFromToken();
    if (!("id" in resp)) {
      // error, not logged in
      return NextResponse.json(resp);
    }

    const { encryptionKey } = body;

    // validation
    if (!encryptionKey) {
      return NextResponse.json(
        {
          error: "encryptionKey is required",
        },
        {
          status: StatusCodes.BAD_REQUEST,
        },
      );
    }

    // safespace db user check
    const dbResp = await checkIfUserExistsInDb(resp.identity);

    if (dbResp?.userAlreadyExists) {
      // if the encryption token is not generated, then generate it here too

      if (!dbResp.isEncryptionTokenGenerated) {
        const storeResponse = await storeEncryptionSecret({
          name: resp.identity,
          key: encryptionKey,
        });

        if (storeResponse?.id) {
          // update the user in the db
          await db
            .update(users)
            .set({
              isEncryptionTokenGenerated: true,
              encryptionKeyId: storeResponse.id,
            })
            .where(eq(users.pangeaId, resp.identity));
        }
      }

      return NextResponse.json(
        {
          error: "User already exists",
        },
        {
          status: StatusCodes.CONFLICT,
        },
      );
    }

    // create a new user in the db
    await createUserInDb(resp);

    // store the encryption key in the vault
    const storeResponse = await storeEncryptionSecret({
      name: resp.identity,
      key: encryptionKey,
    });

    if (storeResponse?.id) {
      // update the user in the db
      const newUser = await db
        .update(users)
        .set({
          isEncryptionTokenGenerated: true,
          encryptionKeyId: storeResponse.id,
        })
        .where(eq(users.pangeaId, resp.identity))
        .returning();

      return NextResponse.json(newUser);
    }

    return NextResponse.json(
      {
        error: "Error storing encryption key",
      },
      {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      },
    );
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

const storeEncryptionSecret = async ({
  name,
  key,
}: {
  name: string;
  key: string;
}) => {
  try {
    const vaultService = getVaultService();
    const secretGenResp = await vaultService.secretStore(key, name);

    return secretGenResp.result;
  } catch (error) {
    console.error("generateEncryptionToken error: ", error);
  }
};
