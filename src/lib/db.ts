import mongoose from "mongoose";
import { cleanEnv } from "@/lib/env";

/**
 * One MongoDB connection per server process. Next's dev server reloads modules, so the
 * connection is parked on `globalThis` to survive those reloads. It is keyed by the
 * connection string: when `.env.local` changes MONGODB_URI, the next call reconnects to the
 * new database instead of carrying on with the old one.
 */
type Cache = { uri: string | null; conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };

declare global {
  var __setabaseMongoose: Cache | undefined;
}

const cache: Cache = globalThis.__setabaseMongoose ?? { uri: null, conn: null, promise: null };
globalThis.__setabaseMongoose = cache;

/** True when a database is configured — the public site falls back to its built-in catalog without one. */
export const hasDb = () => Boolean(cleanEnv(process.env.MONGODB_URI));

export async function connectDb() {
  const uri = cleanEnv(process.env.MONGODB_URI);
  if (!uri) throw new Error("MONGODB_URI is not set.");

  if (cache.uri !== uri) {
    // A different database than the one we're on (dev only — the env never changes at
    // runtime in production): drop the old connection before opening the new one.
    if (cache.conn) {
      await mongoose.disconnect().catch(() => {});
    }
    cache.uri = uri;
    cache.conn = null;
    cache.promise = null;
  }

  if (cache.conn) return cache.conn;

  cache.promise ??= mongoose.connect(uri, {
    bufferCommands: false,
    serverSelectionTimeoutMS: 5000,
  });
  try {
    cache.conn = await cache.promise;
  } catch (error) {
    cache.promise = null;
    cache.uri = null;
    throw error;
  }
  return cache.conn;
}
