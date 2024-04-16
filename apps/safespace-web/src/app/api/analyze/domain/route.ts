import { getDomainIntelService } from "@/lib/pangea";
import { NextResponse } from "next/server";

// GET /api/analze/domain –get information about a domain
export const GET = async ({ url }: Request) => {
  const { searchParams } = new URL(url);
  const domain = searchParams.get("q");
  if (!domain) {
    return new Response(JSON.stringify({ error: "Missing domain parameter" }), {
      status: 400,
    });
  }
  const domainIntelService = getDomainIntelService();
  const response = await domainIntelService.reputationBulk([domain]);

  const domainResponse = response.result.data[domain];

  const data = {
    score: domainResponse?.score,
    summary: domainResponse?.verdict,
  };
  return NextResponse.json(data);
};
