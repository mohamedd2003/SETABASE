import { SignJWT, jwtVerify } from "jose";

/**
 * The admin session: a signed JWT in an httpOnly cookie. Runs in both the Node runtime
 * (route handlers) and the edge runtime (proxy.ts), so it uses only Web APIs and `jose`.
 *
 * Two kinds of account sign in: team members stored in the database (the token carries
 * their id and a version number, so a password change or removal ends their sessions) and
 * the built-in account from the environment, which has no id.
 */
export const AUTH_COOKIE = "setabase_admin";
export const SESSION_DAYS = 7;

export type AdminSession = {
  /** The team member's id; absent for the built-in account from the environment. */
  id?: string;
  email: string;
  name?: string;
  /** The member's tokenVersion when the session was issued. */
  version?: number;
};

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) {
    throw new Error("AUTH_SECRET must be set and at least 32 characters long.");
  }
  return new TextEncoder().encode(value);
}

export async function signSession(session: AdminSession) {
  return new SignJWT({ email: session.email, name: session.name, v: session.version })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(session.id ?? "env")
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(secret());
}

/**
 * The session the token carries, or null when it is missing, forged or expired.
 * Checks the signature only — whether the account still exists is the server's job
 * (see lib/session.ts).
 */
export async function verifySession(token: string | undefined): Promise<AdminSession | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret(), { algorithms: ["HS256"] });
    if (typeof payload.email !== "string") return null;
    return {
      id: payload.sub && payload.sub !== "env" ? payload.sub : undefined,
      email: payload.email,
      name: typeof payload.name === "string" ? payload.name : undefined,
      version: typeof payload.v === "number" ? payload.v : undefined,
    };
  } catch {
    return null;
  }
}

export const sessionCookie = (token: string) => ({
  name: AUTH_COOKIE,
  value: token,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_DAYS * 24 * 60 * 60,
});
