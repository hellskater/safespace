import { getUrlIntelService } from "@/lib/pangea";
import { NextResponse } from "next/server";

// GET /api/analze/domain –get information about a domain
export const GET = async ({ url }: Request) => {
  const { searchParams } = new URL(url);
  const urlVal = searchParams.get("q");
  if (!urlVal) {
    return new Response(JSON.stringify({ error: "Missing url parameter" }), {
      status: 400,
    });
  }
  const urlIntelService = getUrlIntelService();
  const response = await urlIntelService.reputationBulk([urlVal]);

  const urlResponse = response.result.data[urlVal];

  const data = {
    score: urlResponse?.score,
    summary: urlResponse?.verdict,
  };
  return NextResponse.json(data);
};
