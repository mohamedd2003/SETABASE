import { adminRoute, fail, invalid, ok, readJson } from "@/lib/api";
import { objectIdSchema, requestPatchSchema } from "@/lib/admin-schemas";
import { connectDb } from "@/lib/db";
import { getRequest, serializeRequest } from "@/lib/requests-data";
import type { Lean } from "@/lib/catalog-data";
import { RequestModel, type RequestDoc } from "@/models/Request";

type Ctx = { params: Promise<{ id: string }> };

const badId = () => fail("Not a valid request id.", 400);
const notFound = () => fail("Request not found.", 404);

export const GET = adminRoute(async (_session, _request: Request, ctx: Ctx) => {
  const { id } = await ctx.params;
  if (!objectIdSchema.safeParse(id).success) return badId();
  const record = await getRequest(id);
  return record ? ok(record) : notFound();
});

/** PATCH: status and/or adminNotes. */
export const PATCH = adminRoute(async (_session, request: Request, ctx: Ctx) => {
  const { id } = await ctx.params;
  if (!objectIdSchema.safeParse(id).success) return badId();

  const body = await readJson(request);
  if (body === undefined) return fail("Expected a JSON body.", 400);
  const parsed = requestPatchSchema.safeParse(body);
  if (!parsed.success) return invalid(parsed.error);

  await connectDb();
  const doc = await RequestModel.findByIdAndUpdate(id, { $set: parsed.data }, { new: true }).lean<
    Lean<RequestDoc> | null
  >();
  return doc ? ok(serializeRequest(doc)) : notFound();
});

export const DELETE = adminRoute(async (_session, _request: Request, ctx: Ctx) => {
  const { id } = await ctx.params;
  if (!objectIdSchema.safeParse(id).success) return badId();

  await connectDb();
  const deleted = await RequestModel.findByIdAndDelete(id);
  return deleted ? ok({ id }) : notFound();
});
