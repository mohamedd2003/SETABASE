import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { clientIp, fail, invalid, ok, rateLimit, readJson, tooMany } from "@/lib/api";
import { loginSchema } from "@/lib/admin-schemas";
import { authSecretProblem, sessionCookie, signSession, type AdminSession } from "@/lib/auth";
import type { Lean } from "@/lib/catalog-data";
import { connectDb, hasDb } from "@/lib/db";
import { cleanEnv } from "@/lib/env";
import { envAdminEmail } from "@/lib/team-data";
import { TeamMemberModel, type TeamMemberDoc } from "@/models/TeamMember";

/** `$2a$`, `$2b$` or `$2y$`, a two-digit cost, then 53 characters of salt and digest. */
const BCRYPT_HASH = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;

const SETTINGS_HINT =
  "Add it to the server's environment variables (on Vercel: Settings → Environment Variables), then redeploy.";

/**
 * The built-in account from the environment (ADMIN_EMAIL + ADMIN_PASSWORD_HASH). It always
 * works, so a team can't lock itself out. Next expands `$VAR` inside .env files, so the hash
 * is written there with `\$`; the backslashes come back out here. Vercel's settings hold it
 * as-is.
 */
function builtInAccount(): { email: string; hash: string } | null {
  const email = envAdminEmail();
  const hash = cleanEnv(process.env.ADMIN_PASSWORD_HASH)?.replace(/\\\$/g, "$");
  if (!email || !hash) return null;
  if (!BCRYPT_HASH.test(hash)) {
    console.error(
      `[auth] ADMIN_PASSWORD_HASH doesn't look like a bcrypt hash (got ${hash.length} characters). ` +
        "In .env.local every $ must be written as \\$ — run `npm run admin:hash` and paste the line it prints.",
    );
    return null;
  }
  return { email, hash };
}

/**
 * Signs an admin in: a team member from the database, or the built-in account.
 * Team members can't register the built-in account's email, so the two never collide.
 */
export async function POST(request: Request) {
  const limit = rateLimit(`login:${clientIp(request)}`, 5, 15 * 60_000);
  if (!limit.allowed) return tooMany(limit.retryAfter);

  // Without a signing secret no session can be issued, so say so up front — not as a crash
  // after the password check. Nobody can sign in while this is true, so naming the missing
  // setting gives nothing away.
  const secretProblem = authSecretProblem();
  if (secretProblem) {
    console.error(`[auth] ${secretProblem}. ${SETTINGS_HINT}`);
    return fail(
      `Sign-in isn't set up on this server: ${secretProblem}. Add it in the hosting settings and redeploy.`,
      503,
    );
  }

  try {
    return await signIn(request);
  } catch (error) {
    console.error("[auth] sign-in failed unexpectedly:", error);
    return fail("Something went wrong on our side. Try again in a moment.", 500);
  }
}

async function signIn(request: Request) {
  const body = await readJson(request);
  if (body === undefined) return fail("Expected a JSON body.", 400);

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) return invalid(parsed.error);

  const email = parsed.data.email.trim().toLowerCase();
  const { password } = parsed.data;

  const builtIn = builtInAccount();
  if (!builtIn && !hasDb()) {
    console.error(
      `[auth] No way to sign in: set ADMIN_EMAIL and ADMIN_PASSWORD_HASH, or MONGODB_URI with a team member. ${SETTINGS_HINT}`,
    );
    return fail("Sign-in isn't set up on this server: no account is configured.", 503);
  }

  let session: AdminSession | null = null;

  if (hasDb()) {
    try {
      await connectDb();
      const member = await TeamMemberModel.findOne({ email }).lean<Lean<TeamMemberDoc> | null>();
      if (member && member.isActive && (await bcrypt.compare(password, member.passwordHash))) {
        session = {
          id: String(member._id),
          email: member.email,
          name: member.name || undefined,
          version: member.tokenVersion ?? 0,
        };
        await TeamMemberModel.updateOne({ _id: member._id }, { $set: { lastLoginAt: new Date() } });
      }
    } catch (error) {
      // The built-in account below still works while the database is down.
      console.error("[auth] couldn't check team members:", error);
    }
  }

  if (!session && builtIn && email === builtIn.email && (await bcrypt.compare(password, builtIn.hash))) {
    session = { email: builtIn.email };
  }

  if (!session) return fail("Email or password is incorrect.", 401);

  (await cookies()).set(sessionCookie(await signSession(session)));
  return ok({ email: session.email, name: session.name });
}
