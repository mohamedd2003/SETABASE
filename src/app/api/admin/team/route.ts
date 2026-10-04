import bcrypt from "bcryptjs";
import { adminRoute, fail, invalid, ok, readJson } from "@/lib/api";
import { teamMemberCreateSchema } from "@/lib/admin-schemas";
import type { Lean } from "@/lib/catalog-data";
import { connectDb } from "@/lib/db";
import { envAdminEmail, listTeamMembers, serializeMember } from "@/lib/team-data";
import { TeamMemberModel, type TeamMemberDoc } from "@/models/TeamMember";

export const GET = adminRoute(async () => ok(await listTeamMembers()));

/** POST: a new team member. The password arrives in plain text and is stored hashed. */
export const POST = adminRoute(async (_session, request: Request) => {
  const body = await readJson(request);
  if (body === undefined) return fail("Expected a JSON body.", 400);
  const parsed = teamMemberCreateSchema.safeParse(body);
  if (!parsed.success) return invalid(parsed.error);

  const { password, name, email, isActive } = parsed.data;
  if (email === envAdminEmail()) {
    return fail("That email belongs to the built-in account from the server settings.", 409, {
      email: "Used by the built-in account.",
    });
  }

  await connectDb();
  if (await TeamMemberModel.exists({ email })) {
    return fail("A team member with that email already exists.", 409, { email: "Already in use." });
  }

  const doc = await TeamMemberModel.create({
    email,
    isActive,
    ...(name && { name }),
    passwordHash: await bcrypt.hash(password, 12),
  });
  return ok(serializeMember(doc.toObject() as Lean<TeamMemberDoc>), 201);
});
