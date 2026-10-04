"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon, XIcon } from "lucide-react";
import { EmptyState, PageHeader } from "@/components/admin/States";
import { formatDate, ServiceBadge, StatusBadge } from "@/components/admin/StatusBadge";
import { RequestSheet } from "@/components/admin/requests/RequestSheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { RequestsQuery } from "@/lib/admin-schemas";
import type { RequestRecord, RequestsPage } from "@/lib/requests-data";
import { requestStatusLabels, requestStatuses } from "@/lib/request-types";

type RequestsViewProps = {
  data: RequestsPage;
  query: RequestsQuery;
};

/** `short` is what fits beside the others on a phone. */
const tabs = [
  { value: "all", label: "All", short: "All" },
  { value: "special-services", label: "Special Services", short: "Special Services" },
  { value: "relocation", label: "Corporate Relocation", short: "Relocation" },
] as const;

const statusOptions = [
  { value: "all", label: "Any status" },
  ...requestStatuses.map((status) => ({ value: status, label: requestStatusLabels[status] })),
];

/**
 * The inbox. Filters live in the URL, so the server renders each view and a link to a
 * filtered list can be shared; the row sheet edits one request and refreshes the list.
 */
export function RequestsView({ data, query }: RequestsViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [search, setSearch] = useState(query.search ?? "");
  const [open, setOpen] = useState<RequestRecord | null>(null);

  function update(patch: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(patch)) {
      if (value && value !== "all") params.set(key, value);
      else params.delete(key);
    }
    // Any change of filter starts again from the first page.
    if (!("page" in patch)) params.delete("page");
    const next = params.toString();
    startTransition(() => router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false }));
  }

  // Search waits for a pause in typing before it asks the server.
  useEffect(() => {
    if (search === (query.search ?? "")) return;
    const timer = setTimeout(() => update({ search: search.trim() || undefined }), 350);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const stats = [
    { label: "Total", value: data.stats.total },
    { label: "New", value: data.stats.new },
    { label: "In progress", value: data.stats["in-progress"] },
    { label: "Closed", value: data.stats.closed },
  ];

  const filtered = Boolean(query.status || query.search);

  return (
    <div className="grid grid-cols-1 gap-6">
      <PageHeader title="Requests" description="Package requests from the website, newest first." />

      <div className="grid grid-cols-2 gap-3 @3xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="mt-1 font-serif text-2xl text-foreground tabular-nums">{stat.value}</p>
          </div>
        ))}
      </div>

      <Tabs value={query.service ?? "all"} onValueChange={(value) => update({ service: String(value) })}>
        <TabsList
          variant="line"
          className="w-full justify-start overflow-x-auto border-b border-border [scrollbar-width:none]"
        >
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="flex-none px-2.5 @md:px-3">
              <span className="@md:hidden">{tab.short}</span>
              <span className="hidden @md:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="flex flex-col gap-3 @xl:flex-row @xl:items-center">
        <div className="relative flex-1">
          <SearchIcon aria-hidden="true" className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or company"
            aria-label="Search requests"
            className="ps-10"
          />
        </div>
        <Select
          items={statusOptions}
          value={query.status ?? "all"}
          onValueChange={(value) => update({ status: String(value) })}
        >
          <SelectTrigger aria-label="Filter by status" className="w-full @xl:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {filtered ? (
          <Button
            variant="ghost"
            onClick={() => {
              setSearch("");
              update({ status: undefined, search: undefined });
            }}
          >
            <XIcon aria-hidden="true" />
            Clear
          </Button>
        ) : null}
      </div>

      <div className={pending ? "opacity-60 transition-opacity" : "transition-opacity"} aria-busy={pending}>
        {data.items.length === 0 ? (
          <EmptyState
            title={filtered ? "No requests match" : "No requests yet"}
            description={
              filtered
                ? "Try a different status or search."
                : "Requests sent from the Special Services and Corporate Relocation pages will appear here."
            }
          />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            {/* Narrow, each request is one cell (name, company, date, type) beside its status;
                columns of their own appear as the room beside the sidebar grows. */}
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="hidden w-28 @3xl:table-cell">Date</TableHead>
                  <TableHead>
                    <span className="@3xl:hidden">Request</span>
                    <span className="hidden @3xl:inline">Name</span>
                  </TableHead>
                  <TableHead className="hidden @3xl:table-cell">Company</TableHead>
                  <TableHead className="hidden @7xl:table-cell">Email</TableHead>
                  <TableHead className="hidden @3xl:table-cell">Type</TableHead>
                  <TableHead className="hidden @5xl:table-cell">Package</TableHead>
                  <TableHead className="hidden @sm:table-cell">Status</TableHead>
                  <TableHead className="w-10 text-end @3xl:w-20">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((request) => (
                  <TableRow
                    key={request.id}
                    tabIndex={0}
                    onClick={() => setOpen(request)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setOpen(request);
                      }
                    }}
                    className="cursor-pointer outline-none focus-visible:bg-accent/60"
                  >
                    <TableCell className="hidden text-muted-foreground @3xl:table-cell">
                      {formatDate(request.createdAt)}
                    </TableCell>
                    <TableCell className="py-3 whitespace-normal">
                      <p className="font-medium wrap-anywhere text-foreground">{request.contact.name}</p>
                      <p className="mt-0.5 text-xs wrap-anywhere text-muted-foreground @3xl:hidden">
                        {request.contact.company ? `${request.contact.company} · ` : ""}
                        {formatDate(request.createdAt)}
                      </p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5 @3xl:hidden">
                        <ServiceBadge service={request.service} />
                        {/* On a phone there's no Status column; the status rides along here. */}
                        <StatusBadge status={request.status} className="@sm:hidden" />
                      </div>
                    </TableCell>
                    <TableCell className="hidden min-w-32 whitespace-normal text-muted-foreground @3xl:table-cell">
                      {request.contact.company ?? "—"}
                    </TableCell>
                    <TableCell className="hidden max-w-60 text-muted-foreground @7xl:table-cell">
                      <span className="block truncate" title={request.contact.email}>
                        {request.contact.email}
                      </span>
                    </TableCell>
                    <TableCell className="hidden @3xl:table-cell">
                      <ServiceBadge service={request.service} />
                    </TableCell>
                    <TableCell className="hidden max-w-56 @5xl:table-cell">
                      <PackageSummary request={request} />
                    </TableCell>
                    <TableCell className="hidden @sm:table-cell">
                      <StatusBadge status={request.status} />
                    </TableCell>
                    <TableCell className="text-end @max-3xl:ps-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label={`View the request from ${request.contact.name}`}
                        className="@max-3xl:size-10 @max-3xl:px-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpen(request);
                        }}
                      >
                        <span className="hidden @3xl:inline">View</span>
                        <ChevronRightIcon aria-hidden="true" className="@3xl:hidden" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-3 text-sm text-muted-foreground">
              <span>
                {data.total} {data.total === 1 ? "request" : "requests"} · page {data.page} of {data.pageCount}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={data.page <= 1}
                  onClick={() => update({ page: String(data.page - 1) })}
                  aria-label="Previous page"
                >
                  <ChevronLeftIcon aria-hidden="true" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={data.page >= data.pageCount}
                  onClick={() => update({ page: String(data.page + 1) })}
                  aria-label="Next page"
                >
                  <ChevronRightIcon aria-hidden="true" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <RequestSheet
        request={open}
        onClose={() => setOpen(null)}
        onChanged={(updated) => {
          setOpen(updated);
          router.refresh();
        }}
        onDeleted={() => {
          setOpen(null);
          router.refresh();
        }}
      />
    </div>
  );
}

/** The first thing chosen, and how many more. */
function PackageSummary({ request }: { request: RequestRecord }) {
  const [first, ...rest] = request.selection;
  if (!first) return <span className="text-muted-foreground">—</span>;
  return (
    <span className="block truncate text-foreground">
      {first.label}
      {rest.length > 0 ? <span className="text-muted-foreground"> +{rest.length}</span> : null}
    </span>
  );
}
