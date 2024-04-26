import * as dotenv from "dotenv";
import type { Config } from "drizzle-kit";
dotenv.config({ path: [".env.local", ".env"] });

export default {
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.NEON_DATABASE_URL!,
  },
  verbose: true,
  strict: true,
} satisfies Config;
