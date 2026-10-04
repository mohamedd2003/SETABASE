import { revalidatePath } from "next/cache";
import { adminRoute, fail, invalid, ok, readJson } from "@/lib/api";
import { relocationPackageInputSchema } from "@/lib/admin-schemas";
import { loadRelocationPackages, serializeRelocationPackage, type Lean } from "@/lib/catalog-data";
import { connectDb } from "@/lib/db";
import { RelocationPackageModel, type RelocationPackageDoc } from "@/models/RelocationPackage";

export const GET = adminRoute(async () => ok(await loadRelocationPackages()));

export const POST = adminRoute(async (_session, request: Request) => {
  const body = await readJson(request);
  if (body === undefined) return fail("Expected a JSON body.", 400);
  const parsed = relocationPackageInputSchema.safeParse(body);
  if (!parsed.success) return invalid(parsed.error);

  await connectDb();
  if (await RelocationPackageModel.exists({ slug: parsed.data.slug })) {
    return fail("That slug is already in use.", 409, { slug: "Already in use." });
  }

  const doc = await RelocationPackageModel.create(parsed.data);
  revalidatePath("/business/relocation");
  return ok(serializeRelocationPackage(doc.toObject() as Lean<RelocationPackageDoc>), 201);
});
