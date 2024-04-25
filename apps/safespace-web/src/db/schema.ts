import {
  pgTable,
  serial,
  timestamp,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  imageUrl: varchar("image_url"),
  isEncryptionTokenGenerated: boolean("is_encryption_token_generated").default(
    false,
  ),
  encryptionKeyId: varchar("encryption_key_id"),
  pangeaId: varchar("pangea_id").unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
