import {
  pgTable,
  serial,
  timestamp,
  varchar,
  boolean,
  integer,
  index,
  text,
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

export const notes = pgTable(
  "notes",
  {
    id: serial("id").primaryKey(),
    title: varchar("title"),
    content: text("content"),
    ownerId: integer("owner_id")
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => {
    return {
      ownerIdIdx: index("owner_id_idx").on(table.ownerId),
    };
  },
);
