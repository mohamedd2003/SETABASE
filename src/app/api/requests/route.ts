import { clientIp, fail, invalid, ok, rateLimit, readJson, tooMany } from "@/lib/api";
import { getRelocationCatalog, getSpecialServicesCatalog } from "@/lib/catalog-data";
import { connectDb, hasDb } from "@/lib/db";
import { packageRequestSchema } from "@/lib/package-request-schema";
import {
  estimateSpecialServices,
  flexItemMonthly,
  formatEgp,
  includedItems,
} from "@/lib/special-services-pricing";
import { RequestModel } from "@/models/Request";

const UNAVAILABLE =
  "One of the chosen packages is no longer available. Refresh the page and choose again.";

/**
 * Receives package requests from /business/special-services and /business/relocation.
 * Checks the chosen ids against the live catalog, prices on the server, keeps a snapshot
 * of what was chosen, and stores the request for the dashboard.
 */
export async function POST(request: Request) {
  const limit = rateLimit(`requests:${clientIp(request)}`, 10, 15 * 60_000);
  if (!limit.allowed) return tooMany(limit.retryAfter);

  const body = await readJson(request);
  if (body === undefined) return fail("Expected a JSON body.", 400);

  const parsed = packageRequestSchema.safeParse(body);
  if (!parsed.success) return invalid(parsed.error);

  const { requester, ...selection } = parsed.data;

  // Honeypot filled in → almost certainly a bot. Pretend it worked so it stops retrying.
  if (requester.website) return ok({ id: null }, 201);
  const { website, ...contact } = requester;
  void website;

  const allIn = (chosen: string[], known: Set<string>) => chosen.every((id) => known.has(id));
  const lines: { label: string; detail?: string }[] = [];
  let estimate: ReturnType<typeof estimateSpecialServices> | undefined;
  let flexItems: string[] = [];

  if (selection.service === "special-services") {
    const catalog = await getSpecialServicesCatalog();
    const ideas = catalog.eventGroups.flatMap((g) => g.ideas);
    if (
      !allIn(selection.packages, new Set(catalog.fixedPackages.map((p) => p.id))) ||
      !allIn(selection.flexItems, new Set(catalog.flexItems.map((f) => f.id))) ||
      !allIn(selection.eventIdeas, new Set(ideas.map((i) => i.id)))
    ) {
      return fail(UNAVAILABLE, 422);
    }

    const included = includedItems(catalog, selection.packages);
    flexItems = selection.flexItems.filter((id) => !included.has(id));
    estimate = estimateSpecialServices(
      { employees: selection.employees, packages: selection.packages, flexItems },
      catalog,
    );

    for (const pkg of catalog.fixedPackages.filter((p) => selection.packages.includes(p.id))) {
      lines.push({ label: pkg.title, detail: `${formatEgp(pkg.perEmployee * selection.employees)} a month` });
    }
    for (const item of catalog.flexItems.filter((f) => flexItems.includes(f.id))) {
      lines.push({
        label: item.label,
        detail:
          item.unit === "kit"
            ? `${formatEgp(item.price)} per new hire`
            : `${formatEgp(flexItemMonthly(item, selection.employees))} a month`,
      });
    }
    for (const idea of ideas.filter((i) => selection.eventIdeas.includes(i.id))) {
      lines.push({ label: idea.label, detail: "Event — priced on request" });
    }
  } else {
    const catalog = await getRelocationCatalog();
    if (
      !allIn(selection.stages, new Set(catalog.stages.map((s) => s.id))) ||
      !allIn(selection.options, new Set(catalog.options.map((o) => o.id)))
    ) {
      return fail(UNAVAILABLE, 422);
    }
    for (const stage of catalog.stages.filter((s) => selection.stages.includes(s.id))) {
      lines.push({ label: stage.title, detail: stage.when });
    }
    for (const option of catalog.options.filter((o) => selection.options.includes(o.id))) {
      lines.push({ label: option.label, detail: "Extra" });
    }
  }

  const record = {
    ...selection,
    ...(selection.service === "special-services" && { flexItems }),
    contact,
    selection: lines,
    estimate,
  };

  if (!hasDb()) {
    if (process.env.NODE_ENV === "production") {
      return fail("Requests can't be received right now. Email us instead.", 503);
    }
    // Local development without a database: the request is only logged.
    console.info("[requests] (no database) new request", JSON.stringify(record));
    return ok({ id: null }, 201);
  }

  await connectDb();
  const doc = await RequestModel.create(record);
  return ok({ id: String(doc._id) }, 201);
}
