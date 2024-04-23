import { getUserIntelService } from "@/lib/pangea";
import { NextResponse } from "next/server";
import { Intel } from "pangea-node-sdk";

// GET /api/analze/domain –get information about a domain
export const GET = async ({ url }: Request) => {
  const { searchParams } = new URL(url);
  const password = searchParams.get("q");
  if (!password) {
    return new Response(
      JSON.stringify({ error: "Missing password parameter" }),
      {
        status: 400,
      },
    );
  }
  const userIntelService = getUserIntelService();

  // conver password to sha256 hash and take out the first 5 characters
  const passHash = password
    ? await crypto.subtle
        .digest("SHA-256", new TextEncoder().encode(password))
        .then((hash) => {
          const hashArray = Array.from(new Uint8Array(hash));
          const hashHex = hashArray
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
          return hashHex.slice(0, 5);
        })
    : null;

  if (!passHash) {
    return new Response(JSON.stringify({ error: "Error hashing password" }), {
      status: 400,
    });
  }

  const response = await userIntelService.passwordBreachedBulk(
    Intel.HashType.SHA256,
    [passHash],
    {},
  );

  const passwordResponse = response.result.data[passHash];

  const data = {
    isBreached: passwordResponse?.found_in_breach ?? false,
    breachCount: passwordResponse?.breach_count ?? 0,
  };
  return NextResponse.json(data);
};
