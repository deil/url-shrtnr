import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./db/schema";
import { eq } from "drizzle-orm";

const client = createClient({ url: process.env.DB_FILE_NAME! });
const db = drizzle(client, { schema });

const app = new Hono();

app.use(logger());

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/:link", async (c) => {
  const link = c.req.param("link");
  const linkData = await db.query.links.findFirst({
    where: eq(schema.links.link, link),
  });

  if (!linkData || new Date(linkData.expiresAt) < new Date()) {
    return c.text("Link not found", 404);
  }

  return c.redirect(linkData.url);
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
