import { headers } from "next/headers";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { getAuthNService } from "../pangea";

export const getTokenFromRequestHeader = () => {
  const headersList = headers();
  const token = headersList.get("x-auth-token");

  const formattedToken = token?.split(" ")[1]; // Remove "Bearer" from token

  return formattedToken;
};

export const getUserProfileFromToken = async () => {
  try {
    const token = getTokenFromRequestHeader();

    if (!token) {
      return new Response(JSON.stringify({ error: ReasonPhrases.FORBIDDEN }), {
        status: StatusCodes.FORBIDDEN,
      });
    }

    const authnService = getAuthNService();

    const tokenCheckResponse =
      await authnService.client.clientToken.check(token);

    const isFailed =
      tokenCheckResponse.status !== "Success" || !tokenCheckResponse.result;

    if (isFailed) {
      return new Response(
        JSON.stringify({ error: ReasonPhrases.UNAUTHORIZED }),
        {
          status: StatusCodes.UNAUTHORIZED,
        },
      );
    }

    return tokenCheckResponse.result;
  } catch (error) {
    return new Response(JSON.stringify({ error: ReasonPhrases.UNAUTHORIZED }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }
};
