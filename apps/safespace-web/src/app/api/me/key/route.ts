import { getUserProfileFromDb } from "@/db/queries/users";
import { getUserProfileFromToken } from "@/lib/api/auth-helpers";
import { getVaultService } from "@/lib/pangea";
import { type MyKeyType } from "@/types/key";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { NextResponse } from "next/server";

// GET /api/me/key – get the user's key
export const GET = async ({}: Request) => {
  try {
    // return NextResponse.json({
    //   currentVersion: 1,
    //   value: "5001c7a80c2f1438d0174479616b07543f77e5845985f9fa1e6efa6c6116f8e4",
    //   id: "pvi_5u7zwbmgcr7pjgfh7vfcdeoant3wzlo2",
    //   lastRotatedAt: null,
    // });
    const resp = await getUserProfileFromToken();
    if ("id" in resp) {
      const user = await getUserProfileFromDb(resp.identity);
      const vaultService = getVaultService();

      if (!user?.encryptionKeyId) {
        return NextResponse.json(null);
      }

      const vaultResponse = await vaultService.getItem(user.encryptionKeyId);

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
        id: user.encryptionKeyId,
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
