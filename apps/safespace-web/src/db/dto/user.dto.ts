import { z } from "zod";

export const UserDtoSchema = z.object({
  id: z.number(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  imageUrl: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type UserDto = z.infer<typeof UserDtoSchema>;
