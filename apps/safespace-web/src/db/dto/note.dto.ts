import { z } from "zod";

export const NoteDtoSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  ownerId: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type NoteType = z.infer<typeof NoteDtoSchema>;
