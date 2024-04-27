/* eslint-disable no-console */
import { z } from "zod";

/**
 * Specify server-side environment variables schema here.
 */
const server = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  PANGEA_DOMAIN: z.string().min(1),
  PANGEA_TOKEN: z.string().min(1),
  NEON_DATABASE_URL: z.string().min(1),
  OPENAI_API_KEY: z.string().min(1),
});

const client = z.object({
  NEXT_PUBLIC_PANGEA_DOMAIN: z.string().min(1),
  NEXT_PUBLIC_PANGEA_CLIENT_TOKEN: z.string().min(1),
  NEXT_PUBLIC_PANGEA_LOGIN_URL: z.string().min(1),
});

type Env = z.infer<typeof server> & z.infer<typeof client>;

const processEnv = {
  NODE_ENV: process.env.NODE_ENV,
  PANGEA_DOMAIN: process.env.PANGEA_DOMAIN,
  PANGEA_TOKEN: process.env.PANGEA_TOKEN,
  NEON_DATABASE_URL: process.env.NEON_DATABASE_URL,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  NEXT_PUBLIC_PANGEA_DOMAIN: process.env.NEXT_PUBLIC_PANGEA_DOMAIN,
  NEXT_PUBLIC_PANGEA_CLIENT_TOKEN: process.env.NEXT_PUBLIC_PANGEA_CLIENT_TOKEN,
  NEXT_PUBLIC_PANGEA_LOGIN_URL: process.env.NEXT_PUBLIC_PANGEA_LOGIN_URL,
};

const merged = server.merge(client);

const isServer = typeof window === "undefined";

const parsed = isServer
  ? merged.safeParse(processEnv) // on server we can validate all env vars
  : client.safeParse(processEnv); // on client we can only validate the ones that are exposed

if (!parsed.success) {
  console.error(
    "❌ Invalid environment variables:",
    parsed.error.flatten().fieldErrors,
  );
  throw new Error("Invalid environment variables");
}

// eslint-disable-next-line no-undef
const env = new Proxy(parsed.data, {
  get(target, prop: string | symbol) {
    if (typeof prop !== "string") return undefined;
    if (!isServer && !prop.startsWith("NEXT_PUBLIC_")) {
      throw new Error(
        process.env.NODE_ENV === "production"
          ? "❌ Attempted to access a server-side environment variable on the client"
          : `❌ Attempted to access server-side environment variable '${prop}' on the client`,
      );
    }
    return target[prop as keyof typeof target];
  },
}) as Env;

export { env };
