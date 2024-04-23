import { getDomainIntelService, getUrlIntelService } from "@/lib/pangea";
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
  const urlServiceResponse = await urlIntelService.reputationBulk([urlVal], {
    provider: "crowdstrike",
  });

  const domain = new URL(urlVal).hostname;

  const domainIntelService = getDomainIntelService();
  const domainServiceResponse = await domainIntelService.reputationBulk(
    [domain],
    {
      provider: "crowdstrike",
    },
  );

  const urlResponse = urlServiceResponse.result.data[urlVal];

  const urlVerdict = urlResponse?.verdict;

  if (urlVerdict !== "unknown") {
    const data = {
      score: urlResponse?.score,
      summary: urlVerdict,
    };
    return NextResponse.json(data);
  }

  const domainResponse = domainServiceResponse.result.data[domain];

  const domainVerdict = domainResponse?.verdict;

  const data = {
    score: domainResponse?.score,
    summary: domainVerdict,
  };
  return NextResponse.json(data);
};
