import { sql } from "drizzle-orm";
import { int, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const links = sqliteTable(
  "links",
  {
    id: int("id").primaryKey({ autoIncrement: true }),
    link: text("link").notNull(),
    url: text("url").notNull(),
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    expiresAt: text("expires_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [uniqueIndex("link_uq").on(table.link)]
);

export type Link = typeof links.$inferSelect;
export type InsertLink = typeof links.$inferInsert;
