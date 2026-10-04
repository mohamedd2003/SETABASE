import { connectDb } from "@/lib/db";
import type { RequestsQuery } from "@/lib/admin-schemas";
import type { Lean } from "@/lib/catalog-data";
import { requestStatuses, type RequestService, type RequestStatus } from "@/lib/request-types";
import { RequestModel, type RequestDoc } from "@/models/Request";

/** Server only: the requests collection as the dashboard reads it. */

export type RequestRecord = {
  id: string;
  service: RequestService;
  status: RequestStatus;
  contact: { name: string; company?: string; email: string; phone?: string; message?: string };
  employees?: number;
  packages: string[];
  flexItems: string[];
  eventIdeas: string[];
  contractLength?: string;
  stages: string[];
  options: string[];
  movingFrom?: string;
  destination?: string;
  arrival?: string;
  selection: { label: string; detail?: string }[];
  estimate: {
    subtotal: number;
    bundleDiscount: number;
    volumeDiscount: number;
    volumeRate: number;
    monthly: number;
    perHire: number;
  } | null;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
};

const clean = (value: string | null | undefined) => (value ? value : undefined);

export function serializeRequest(doc: Lean<RequestDoc>): RequestRecord {
  const estimate = doc.estimate;
  return {
    id: String(doc._id),
    service: doc.service,
    status: doc.status ?? "new",
    contact: {
      name: doc.contact.name,
      company: clean(doc.contact.company),
      email: doc.contact.email,
      phone: clean(doc.contact.phone),
      message: clean(doc.contact.message),
    },
    employees: doc.employees ?? undefined,
    packages: [...doc.packages],
    flexItems: [...doc.flexItems],
    eventIdeas: [...doc.eventIdeas],
    contractLength: clean(doc.contractLength),
    stages: [...doc.stages],
    options: [...doc.options],
    movingFrom: clean(doc.movingFrom),
    destination: clean(doc.destination),
    arrival: clean(doc.arrival),
    selection: doc.selection.map((line) => ({ label: line.label, detail: clean(line.detail) })),
    estimate:
      estimate && typeof estimate.monthly === "number"
        ? {
            subtotal: estimate.subtotal ?? 0,
            bundleDiscount: estimate.bundleDiscount ?? 0,
            volumeDiscount: estimate.volumeDiscount ?? 0,
            volumeRate: estimate.volumeRate ?? 0,
            monthly: estimate.monthly,
            perHire: estimate.perHire ?? 0,
          }
        : null,
    adminNotes: clean(doc.adminNotes),
    createdAt: (doc.createdAt ?? new Date(0)).toISOString(),
    updatedAt: (doc.updatedAt ?? doc.createdAt ?? new Date(0)).toISOString(),
  };
}

export type RequestStats = Record<"total" | RequestStatus, number>;

export type RequestsPage = {
  items: RequestRecord[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
  stats: RequestStats;
};

const escapeRegex = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export async function listRequests(query: RequestsQuery): Promise<RequestsPage> {
  await connectDb();

  const scope: Record<string, unknown> = {};
  if (query.service) scope.service = query.service;

  const filter: Record<string, unknown> = { ...scope };
  if (query.status) filter.status = query.status;
  if (query.search) {
    const pattern = new RegExp(escapeRegex(query.search), "i");
    filter.$or = [{ "contact.name": pattern }, { "contact.email": pattern }, { "contact.company": pattern }];
  }

  const [docs, total, byStatus] = await Promise.all([
    RequestModel.find(filter)
      .sort({ createdAt: -1 })
      .skip((query.page - 1) * query.pageSize)
      .limit(query.pageSize)
      .lean<Lean<RequestDoc>[]>(),
    RequestModel.countDocuments(filter),
    // The stats row counts the whole tab, not just the filtered page.
    RequestModel.aggregate<{ _id: RequestStatus; count: number }>([
      { $match: scope },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
  ]);

  const stats = Object.fromEntries([
    ["total", 0],
    ...requestStatuses.map((status) => [status, 0]),
  ]) as RequestStats;
  for (const row of byStatus) {
    if (row._id in stats) stats[row._id] = row.count;
    stats.total += row.count;
  }

  return {
    items: docs.map(serializeRequest),
    total,
    page: query.page,
    pageSize: query.pageSize,
    pageCount: Math.max(1, Math.ceil(total / query.pageSize)),
    stats,
  };
}

export async function getRequest(id: string): Promise<RequestRecord | null> {
  await connectDb();
  const doc = await RequestModel.findById(id).lean<Lean<RequestDoc> | null>();
  return doc ? serializeRequest(doc) : null;
}

/** For the sidebar badge. */
export async function countNewRequests(): Promise<number> {
  await connectDb();
  return RequestModel.countDocuments({ status: "new" });
}
