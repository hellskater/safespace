import { getUserProfileFromDb } from "@/db/queries/users";
import { getUserProfileFromToken } from "@/lib/api/auth-helpers";
import { getVaultService } from "@/lib/pangea";
import { MyKeyType } from "@/types/key";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { NextResponse } from "next/server";

// GET /api/me/key – get the user's key
export const GET = async ({}: Request) => {
  try {
    const resp = await getUserProfileFromToken();
    if ("id" in resp) {
      const user = await getUserProfileFromDb(resp.id);
      const vaultService = getVaultService();

      if (!user?.encrytionKeyId) {
        return NextResponse.json(null);
      }

      const vaultResponse = await vaultService.getItem(user.encrytionKeyId);

      if (!vaultResponse?.result?.current_version?.secret) {
        return new Response(
          JSON.stringify({ error: ReasonPhrases.INTERNAL_SERVER_ERROR }),
          {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
          },
        );
      }

      const keyResp: MyKeyType = {
        currentVersion: vaultResponse?.result.current_version.version,
        value: vaultResponse?.result.current_version.secret,
        id: user.encrytionKeyId,
        lastRotatedAt: vaultResponse?.result.last_rotated ?? null,
      };

      return NextResponse.json(keyResp);
    }
    return resp;
  } catch (error) {
    console.error("GET /api/me/key error: ", error);
    return new Response(
      JSON.stringify({ error: ReasonPhrases.INTERNAL_SERVER_ERROR }),
      {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      },
    );
  }
};
