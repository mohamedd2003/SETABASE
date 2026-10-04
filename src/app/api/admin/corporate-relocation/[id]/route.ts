import { revalidatePath } from "next/cache";
import { adminRoute, fail, invalid, ok, readJson } from "@/lib/api";
import { objectIdSchema, relocationPackageInputSchema } from "@/lib/admin-schemas";
import { serializeRelocationPackage, type Lean } from "@/lib/catalog-data";
import { connectDb } from "@/lib/db";
import { RelocationPackageModel, type RelocationPackageDoc } from "@/models/RelocationPackage";

type Ctx = { params: Promise<{ id: string }> };

const badId = () => fail("Not a valid package id.", 400);
const notFound = () => fail("Package not found.", 404);
const PUBLIC_PAGE = "/business/relocation";

export const GET = adminRoute(async (_session, _request: Request, ctx: Ctx) => {
  const { id } = await ctx.params;
  if (!objectIdSchema.safeParse(id).success) return badId();
  await connectDb();
  const doc = await RelocationPackageModel.findById(id).lean<Lean<RelocationPackageDoc> | null>();
  return doc ? ok(serializeRelocationPackage(doc)) : notFound();
});

export const PATCH = adminRoute(async (_session, request: Request, ctx: Ctx) => {
  const { id } = await ctx.params;
  if (!objectIdSchema.safeParse(id).success) return badId();

  const body = await readJson(request);
  if (body === undefined) return fail("Expected a JSON body.", 400);
  const parsed = relocationPackageInputSchema.partial().safeParse(body);
  if (!parsed.success) return invalid(parsed.error);

  await connectDb();
  if (
    parsed.data.slug &&
    (await RelocationPackageModel.exists({ slug: parsed.data.slug, _id: { $ne: id } }))
  ) {
    return fail("That slug is already in use.", 409, { slug: "Already in use." });
  }

  const doc = await RelocationPackageModel.findByIdAndUpdate(
    id,
    { $set: parsed.data },
    { new: true, runValidators: true },
  ).lean<Lean<RelocationPackageDoc> | null>();
  if (!doc) return notFound();

  revalidatePath(PUBLIC_PAGE);
  return ok(serializeRelocationPackage(doc));
});

export const DELETE = adminRoute(async (_session, _request: Request, ctx: Ctx) => {
  const { id } = await ctx.params;
  if (!objectIdSchema.safeParse(id).success) return badId();

  await connectDb();
  const deleted = await RelocationPackageModel.findByIdAndDelete(id);
  if (!deleted) return notFound();

  revalidatePath(PUBLIC_PAGE);
  return ok({ id });
});
