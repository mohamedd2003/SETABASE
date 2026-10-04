import { cookies } from "next/headers";
import { AUTH_COOKIE, verifySession, type AdminSession } from "@/lib/auth";
import type { Lean } from "@/lib/catalog-data";
import { connectDb, hasDb } from "@/lib/db";
import { envAdminEmail } from "@/lib/team-data";
import { TeamMemberModel, type TeamMemberDoc } from "@/models/TeamMember";

/**
 * Server only: the signed-in admin, checked against the database.
 * The proxy trusts the token's signature; this also confirms the account behind it still
 * exists, is active, and hasn't changed its password since the token was issued.
 */
export async function readSession(token: string | undefined): Promise<AdminSession | null> {
  const session = await verifySession(token);
  if (!session) return null;

  // The built-in account: valid as long as the environment still names that email.
  if (!session.id) {
    return session.email.toLowerCase() === envAdminEmail() ? session : null;
  }

  if (!hasDb()) return null;
  try {
    await connectDb();
    const member = await TeamMemberModel.findById(session.id)
      .select("email name isActive tokenVersion")
      .lean<Lean<TeamMemberDoc> | null>();
    if (!member || !member.isActive || (member.tokenVersion ?? 0) !== (session.version ?? 0)) {
      return null;
    }
    return { id: session.id, email: member.email, name: member.name || undefined, version: session.version };
  } catch (error) {
    console.error("[session] couldn't check the account:", error);
    return null;
  }
}

export async function currentSession() {
  return readSession((await cookies()).get(AUTH_COOKIE)?.value);
}
