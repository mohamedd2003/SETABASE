import { revalidatePath } from "next/cache";
import { adminRoute, fail, invalid, ok, readJson } from "@/lib/api";
import { offerInputSchema } from "@/lib/admin-schemas";
import { loadSpecialOffers, serializeOffer, type Lean } from "@/lib/catalog-data";
import { connectDb } from "@/lib/db";
import { SpecialOfferModel, type SpecialOfferDoc } from "@/models/SpecialOffer";

export const GET = adminRoute(async () => ok(await loadSpecialOffers()));

/** POST: a new offer. The slug must be unique — the public page uses it as the package id. */
export const POST = adminRoute(async (_session, request: Request) => {
  const body = await readJson(request);
  if (body === undefined) return fail("Expected a JSON body.", 400);
  const parsed = offerInputSchema.safeParse(body);
  if (!parsed.success) return invalid(parsed.error);

  await connectDb();
  if (await SpecialOfferModel.exists({ slug: parsed.data.slug })) {
    return fail("That slug is already in use.", 409, { slug: "Already in use." });
  }

  const doc = await SpecialOfferModel.create(parsed.data);
  revalidatePath("/business/special-services");
  return ok(serializeOffer(doc.toObject() as Lean<SpecialOfferDoc>), 201);
});
