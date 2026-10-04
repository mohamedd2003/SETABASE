import type { NextRequest } from "next/server";
import { adminRoute, invalid, ok } from "@/lib/api";
import { requestsQuerySchema } from "@/lib/admin-schemas";
import { listRequests } from "@/lib/requests-data";

/** GET /api/admin/requests?service=&status=&search=&page=&pageSize= */
export const GET = adminRoute(async (_session, request: NextRequest) => {
  const params = Object.fromEntries(request.nextUrl.searchParams.entries());
  // Empty filters arrive as "" from the UI; treat them as unset.
  for (const key of Object.keys(params)) if (params[key] === "") delete params[key];

  const parsed = requestsQuerySchema.safeParse(params);
  if (!parsed.success) return invalid(parsed.error);

  return ok(await listRequests(parsed.data));
});
