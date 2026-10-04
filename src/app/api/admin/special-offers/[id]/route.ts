import { revalidatePath } from "next/cache";
import { adminRoute, fail, invalid, ok, readJson } from "@/lib/api";
import { objectIdSchema, offerInputSchema } from "@/lib/admin-schemas";
import { serializeOffer, type Lean } from "@/lib/catalog-data";
import { connectDb } from "@/lib/db";
import { SpecialOfferModel, type SpecialOfferDoc } from "@/models/SpecialOffer";

type Ctx = { params: Promise<{ id: string }> };

const badId = () => fail("Not a valid offer id.", 400);
const notFound = () => fail("Offer not found.", 404);
const PUBLIC_PAGE = "/business/special-services";

export const GET = adminRoute(async (_session, _request: Request, ctx: Ctx) => {
  const { id } = await ctx.params;
  if (!objectIdSchema.safeParse(id).success) return badId();
  await connectDb();
  const doc = await SpecialOfferModel.findById(id).lean<Lean<SpecialOfferDoc> | null>();
  return doc ? ok(serializeOffer(doc)) : notFound();
});

/** PATCH: any subset of the offer's fields, e.g. just `isActive` from the table switch. */
export const PATCH = adminRoute(async (_session, request: Request, ctx: Ctx) => {
  const { id } = await ctx.params;
  if (!objectIdSchema.safeParse(id).success) return badId();

  const body = await readJson(request);
  if (body === undefined) return fail("Expected a JSON body.", 400);
  const parsed = offerInputSchema.partial().safeParse(body);
  if (!parsed.success) return invalid(parsed.error);

  await connectDb();
  if (parsed.data.slug && (await SpecialOfferModel.exists({ slug: parsed.data.slug, _id: { $ne: id } }))) {
    return fail("That slug is already in use.", 409, { slug: "Already in use." });
  }

  const doc = await SpecialOfferModel.findByIdAndUpdate(
    id,
    { $set: parsed.data },
    { new: true, runValidators: true },
  ).lean<Lean<SpecialOfferDoc> | null>();
  if (!doc) return notFound();

  revalidatePath(PUBLIC_PAGE);
  return ok(serializeOffer(doc));
});

export const DELETE = adminRoute(async (_session, _request: Request, ctx: Ctx) => {
  const { id } = await ctx.params;
  if (!objectIdSchema.safeParse(id).success) return badId();

  await connectDb();
  const deleted = await SpecialOfferModel.findByIdAndDelete(id);
  if (!deleted) return notFound();

  revalidatePath(PUBLIC_PAGE);
  return ok({ id });
});
