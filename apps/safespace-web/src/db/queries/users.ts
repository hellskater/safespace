import { AuthN } from "pangea-node-sdk";
import db from "..";
import { users } from "../schema";
import { eq } from "drizzle-orm";

export const checkIfUserExistsInDb = async (pangeaId: string) => {
  try {
    const data = await db.query.users.findFirst({
      columns: {
        id: true,
        isEncryptionTokenGenerated: true,
      },
      where: eq(users.pangeaId, pangeaId),
    });

    if (data && Object.keys(data).length > 0) {
      return {
        userAlreadyExists: true,
        isEncryptionTokenGenerated: data.isEncryptionTokenGenerated,
      };
    }

    return {
      userAlreadyExists: false,
    };
  } catch (error) {
    console.error("checkIfUserExistsInDb error: ", error);
  }
};

export const createUserInDb = async (data: AuthN.Client.Token.CheckResult) => {
  try {
    const { email, profile, identity } = data;

    const resp = await db
      .insert(users)
      .values({
        email,
        imageUrl: profile?.image_url,
        firstName: profile?.first_name,
        lastName: profile?.last_name,
        pangeaId: identity,
        isEncryptionTokenGenerated: false,
      })
      .returning();

    return resp;
  } catch (error) {
    console.error("createUserInDb error: ", error);
  }
};

export const getUserProfileFromDb = async (pangeaId: string) => {
  try {
    const data = await db.query.users.findFirst({
      where: eq(users.pangeaId, pangeaId),
    });

    if (data && Object.keys(data).length > 0) {
      return data;
    }

    return null;
  } catch (error) {
    console.error("getUserProfileFromDb error: ", error);
  }
};
