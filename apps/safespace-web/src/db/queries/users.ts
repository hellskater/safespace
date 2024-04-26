import { AuthN } from "pangea-node-sdk";
import db from "..";
import { users } from "../schema";
import { eq } from "drizzle-orm";

export const checkIfUserExistsInDb = async (pangeaId: string) => {
  try {
    const data = await db
      .select({
        id: users.id,
        isEncryptionTokenGenerated: users.isEncryptionTokenGenerated,
      })
      .from(users)
      .where(eq(users.pangeaId, pangeaId));

    if (data.length > 0) {
      return {
        userAlreadyExists: true,
        isEncryptionTokenGenerated: data[0]?.isEncryptionTokenGenerated,
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
    const { email, id, profile } = data;

    const resp = await db
      .insert(users)
      .values({
        email,
        imageUrl: profile?.image_url,
        firstName: profile?.first_name,
        lastName: profile?.last_name,
        pangeaId: id,
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
    const data = await db
      .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        imageUrl: users.imageUrl,
        isEncryptionTokenGenerated: users.isEncryptionTokenGenerated,
        encrytionKeyId: users.encryptionKeyId,
        pangeaId: users.pangeaId,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.pangeaId, pangeaId));

    console.log({ data, pangeaId, db });

    if (data.length > 0) {
      return data[0];
    }

    return null;
  } catch (error) {
    console.error("getUserProfileFromDb error: ", error);
  }
};
