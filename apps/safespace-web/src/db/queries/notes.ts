import db from "..";
import { notes } from "../schema";
import { desc, eq } from "drizzle-orm";

export const createNoteInDb = async (data: {
  title: string;
  content: string;
  ownerId: number;
}) => {
  try {
    const resp = await db.insert(notes).values(data).returning();

    return resp;
  } catch (error) {
    console.error("createNoteInDb error: ", error);
  }
};

export const getAllNotesForUser = async (userId: number) => {
  try {
    const data = await db.query.notes.findMany({
      where: eq(notes.ownerId, userId),
      orderBy: desc(notes.updatedAt),
    });

    return data;
  } catch (error) {
    console.error("getAllNotesForUser error: ", error);
  }
};

export const getNoteById = async (noteId: number) => {
  try {
    const data = await db.query.notes.findFirst({
      where: eq(notes.id, noteId),
    });

    if (data && Object.keys(data).length > 0) {
      return data;
    }

    return null;
  } catch (error) {
    console.error("getNoteById error: ", error);
  }
};

export const updateNoteInDb = async (
  noteId: number,
  data: {
    title?: string;
    content?: string;
  },
) => {
  try {
    const resp = await db
      .update(notes)
      .set(data)
      .where(eq(notes.id, noteId))
      .returning();

    return resp;
  } catch (error) {
    console.error("updateNoteInDb error: ", error);
  }
};

export const deleteNoteInDb = async (noteId: number) => {
  try {
    const resp = await db.delete(notes).where(eq(notes.id, noteId)).returning();

    return resp;
  } catch (error) {
    console.error("deleteNoteInDb error: ", error);
  }
};
