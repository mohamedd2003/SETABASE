import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { adminRoute, fail, invalid, ok, readJson } from "@/lib/api";
import { objectIdSchema, teamMemberPatchSchema } from "@/lib/admin-schemas";
import { sessionCookie, signSession } from "@/lib/auth";
import type { Lean } from "@/lib/catalog-data";
import { connectDb } from "@/lib/db";
import { envAdminEmail, serializeMember } from "@/lib/team-data";
import { TeamMemberModel, type TeamMemberDoc } from "@/models/TeamMember";

type Ctx = { params: Promise<{ id: string }> };

const badId = () => fail("Not a valid team member id.", 400);
const notFound = () => fail("Team member not found.", 404);

export const GET = adminRoute(async (_session, _request: Request, ctx: Ctx) => {
  const { id } = await ctx.params;
  if (!objectIdSchema.safeParse(id).success) return badId();
  await connectDb();
  const doc = await TeamMemberModel.findById(id, { passwordHash: 0 }).lean<Lean<TeamMemberDoc> | null>();
  return doc ? ok(serializeMember(doc)) : notFound();
});

/**
 * PATCH: name, email, active flag and/or a new password. A new password bumps the member's
 * tokenVersion, which ends their other sessions; your own session gets a fresh cookie.
 */
export const PATCH = adminRoute(async (session, request: Request, ctx: Ctx) => {
  const { id } = await ctx.params;
  if (!objectIdSchema.safeParse(id).success) return badId();

  const body = await readJson(request);
  if (body === undefined) return fail("Expected a JSON body.", 400);
  const parsed = teamMemberPatchSchema.safeParse(body);
  if (!parsed.success) return invalid(parsed.error);

  const self = session.id === id;
  const { name, email, password, isActive } = parsed.data;

  if (self && isActive === false) {
    return fail("You can't deactivate your own account.", 400, { isActive: "Not for your own account." });
  }
  if (email !== undefined && email === envAdminEmail()) {
    return fail("That email belongs to the built-in account from the server settings.", 409, {
      email: "Used by the built-in account.",
    });
  }

  await connectDb();
  if (email !== undefined && (await TeamMemberModel.exists({ email, _id: { $ne: id } }))) {
    return fail("A team member with that email already exists.", 409, { email: "Already in use." });
  }

  const $set: Record<string, unknown> = {};
  const $unset: Record<string, 1> = {};
  if (name !== undefined) {
    if (name) $set.name = name;
    else $unset.name = 1;
  }
  if (email !== undefined) $set.email = email;
  if (isActive !== undefined) $set.isActive = isActive;
  if (password) $set.passwordHash = await bcrypt.hash(password, 12);

  const update: Record<string, unknown> = {};
  if (Object.keys($set).length) update.$set = $set;
  if (Object.keys($unset).length) update.$unset = $unset;
  if (password) update.$inc = { tokenVersion: 1 };

  const doc = await TeamMemberModel.findByIdAndUpdate(id, update, { new: true, runValidators: true }).lean<
    Lean<TeamMemberDoc> | null
  >();
  if (!doc) return notFound();

  if (self && password) {
    const fresh = { id, email: doc.email, name: doc.name || undefined, version: doc.tokenVersion ?? 0 };
    (await cookies()).set(sessionCookie(await signSession(fresh)));
  }

  return ok(serializeMember(doc));
});

export const DELETE = adminRoute(async (session, _request: Request, ctx: Ctx) => {
  const { id } = await ctx.params;
  if (!objectIdSchema.safeParse(id).success) return badId();
  if (session.id === id) return fail("You can't remove your own account.", 400);

  await connectDb();
  const deleted = await TeamMemberModel.findByIdAndDelete(id);
  return deleted ? ok({ id }) : notFound();
});
