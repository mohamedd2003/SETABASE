import type { ZodError } from "zod";
import type { AdminSession } from "@/lib/auth";
import { currentSession } from "@/lib/session";

/* ---------------------------------------------------------------------------
   Responses — { data } on success, { error: { message, fields? } } on failure.
--------------------------------------------------------------------------- */

export const ok = (data: unknown, status = 200) => Response.json({ data }, { status });

export function fail(message: string, status: number, fields?: Record<string, string>) {
  return Response.json({ error: { message, ...(fields && { fields }) } }, { status });
}

/** A 422 built from a zod error, one message per field. */
export function invalid(error: ZodError) {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const path = issue.path.join(".") || "_";
    fields[path] ??= issue.message;
  }
  return fail("Some fields are invalid.", 422, fields);
}

export async function readJson(request: Request): Promise<unknown | undefined> {
  try {
    return await request.json();
  } catch {
    return undefined;
  }
}

/* ---------------------------------------------------------------------------
   Admin guard — every /api/admin/* handler starts with this.
--------------------------------------------------------------------------- */

export class Unauthorized extends Error {}

export async function requireAdmin(): Promise<AdminSession> {
  const session = await currentSession();
  if (!session) throw new Unauthorized("Sign in to continue.");
  return session;
}

/** Wraps a handler so auth failures become 401s and unexpected errors become 500s. */
export function adminRoute<Args extends unknown[]>(
  handler: (session: AdminSession, ...args: Args) => Promise<Response>,
) {
  return async (...args: Args) => {
    try {
      const session = await requireAdmin();
      return await handler(session, ...args);
    } catch (error) {
      if (error instanceof Unauthorized) return fail(error.message, 401);
      console.error("[api/admin]", error);
      return fail("Something went wrong on our side.", 500);
    }
  };
}

/* ---------------------------------------------------------------------------
   Rate limiting — a fixed window per key, in memory.
   TODO(scale): move to Upstash Redis so limits hold across serverless instances.
--------------------------------------------------------------------------- */

type Window = { count: number; resetAt: number };
const windows = new Map<string, Window>();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const current = windows.get(key);
  if (!current || current.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }
  current.count += 1;
  if (current.count > limit) {
    return { allowed: false, retryAfter: Math.ceil((current.resetAt - now) / 1000) };
  }
  return { allowed: true, retryAfter: 0 };
}

export function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

export const tooMany = (retryAfter: number) =>
  Response.json(
    { error: { message: "Too many attempts. Try again in a few minutes." } },
    { status: 429, headers: { "Retry-After": String(retryAfter) } },
  );
