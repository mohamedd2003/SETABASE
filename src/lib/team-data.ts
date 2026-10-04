import type { Lean } from "@/lib/catalog-data";
import { connectDb } from "@/lib/db";
import { cleanEnv } from "@/lib/env";
import type { TeamMemberRecord } from "@/lib/team-types";
import { TeamMemberModel, type TeamMemberDoc } from "@/models/TeamMember";

/** Server only: the team collection, without password hashes. */

export function serializeMember(doc: Lean<TeamMemberDoc>): TeamMemberRecord {
  return {
    id: String(doc._id),
    name: doc.name || undefined,
    email: doc.email,
    isActive: doc.isActive ?? true,
    lastLoginAt: doc.lastLoginAt?.toISOString(),
    createdAt: (doc.createdAt ?? new Date(0)).toISOString(),
    updatedAt: (doc.updatedAt ?? doc.createdAt ?? new Date(0)).toISOString(),
  };
}

export async function listTeamMembers(): Promise<TeamMemberRecord[]> {
  await connectDb();
  const docs = await TeamMemberModel.find({}, { passwordHash: 0 })
    .sort({ createdAt: 1 })
    .lean<Lean<TeamMemberDoc>[]>();
  return docs.map(serializeMember);
}

/** The built-in account's email, normalised the way stored emails are. */
export function envAdminEmail() {
  return cleanEnv(process.env.ADMIN_EMAIL)?.toLowerCase() || null;
}
