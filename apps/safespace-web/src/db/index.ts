import { env } from "@/utils/env";
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

const pool = new Pool({ connectionString: env.NEON_DATABASE_URL! });

const db = drizzle(pool);

export default db;
