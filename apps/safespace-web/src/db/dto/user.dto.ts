import { z } from "zod";

export const UserDtoSchema = z.object({
  id: z.number(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  imageUrl: z.string(),
  isEncryptionTokenGenerated: z.boolean(),
  encryptionKeyId: z.string(),
  pangeaId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type UserType = z.infer<typeof UserDtoSchema>;
