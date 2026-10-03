import { packageRequestSchema } from "@/lib/package-request-schema";
import { estimateSpecialServices } from "@/lib/special-services-pricing";

/**
 * Receives package requests from /business/special-services and /business/relocation.
 * Validates, prices on the server, and logs. Nothing is stored yet.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Expected a JSON body." }, { status: 400 });
  }

  const parsed = packageRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      {
        error: "Some fields are invalid.",
        issues: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 422 },
    );
  }

  const { requester, ...selection } = parsed.data;

  // Honeypot filled in → almost certainly a bot. Pretend it worked so it stops retrying.
  if (requester.website) {
    return Response.json({ ok: true });
  }

  const { website, ...contact } = requester;
  void website;

  // The shape a dashboard row will take. The estimate is recomputed here, never trusted
  // from the browser.
  const record = {
    id: crypto.randomUUID(),
    receivedAt: new Date().toISOString(),
    status: "new" as const,
    contact,
    ...selection,
    estimate:
      selection.service === "special-services"
        ? estimateSpecialServices({
            employees: selection.employees,
            packages: selection.packages,
            flexItems: selection.flexItems,
          })
        : null,
  };

  // TODO(dashboard): save `record` to the dashboard's database and notify the department.
  //   Add rate limiting (per IP) before going live.
  console.info("[package-request] new request", JSON.stringify(record));

  return Response.json({ ok: true, id: record.id });
}
