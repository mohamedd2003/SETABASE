"use client";

import { useId, useState } from "react";
import { MailIcon, PhoneIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { api, ApiError } from "@/components/admin/api-client";
import {
  formatDateTime,
  ServiceBadge,
  StatusBadge,
} from "@/components/admin/StatusBadge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { contractLengths } from "@/content/special-services";
import type { RequestRecord } from "@/lib/requests-data";
import { formatEgp } from "@/lib/special-services-pricing";
import {
  requestStatusLabels,
  requestStatuses,
  type RequestStatus,
} from "@/lib/request-types";

type RequestSheetProps = {
  request: RequestRecord | null;
  onClose: () => void;
  onChanged: (request: RequestRecord) => void;
  onDeleted: () => void;
};

const statusItems = requestStatuses.map((status) => ({
  value: status,
  label: requestStatusLabels[status],
}));

/** One request in full, with its status and the team's notes. */
export function RequestSheet({
  request,
  onClose,
  onChanged,
  onDeleted,
}: RequestSheetProps) {
  return (
    <Sheet open={request !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 overflow-y-auto bg-card p-0 sm:max-w-lg"
      >
        {request ? (
          <RequestDetails
            key={request.id}
            request={request}
            onChanged={onChanged}
            onDeleted={onDeleted}
          />
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

type RequestDetailsProps = Omit<RequestSheetProps, "onClose"> & {
  request: RequestRecord;
};

function RequestDetails({
  request,
  onChanged,
  onDeleted,
}: RequestDetailsProps) {
  const id = useId();
  const [status, setStatus] = useState<RequestStatus>(request.status);
  const [notes, setNotes] = useState(request.adminNotes ?? "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const dirty =
    status !== request.status || notes !== (request.adminNotes ?? "");

  async function save() {
    setSaving(true);
    try {
      const updated = await api<RequestRecord>(
        `/api/admin/requests/${request.id}`,
        {
          method: "PATCH",
          json: { status, adminNotes: notes },
        },
      );
      toast.success("Request saved.");
      onChanged(updated);
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Couldn't save the request.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    setDeleting(true);
    try {
      await api(`/api/admin/requests/${request.id}`, { method: "DELETE" });
      toast.success("Request deleted.");
      onDeleted();
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Couldn't delete the request.",
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <SheetHeader className="border-b border-border px-6 py-5">
        <div className="flex flex-wrap items-center gap-2">
          <ServiceBadge service={request.service} />
          <StatusBadge status={request.status} />
        </div>
        <SheetTitle className="mt-2 font-serif text-2xl font-medium text-foreground">
          {request.contact.name}
        </SheetTitle>
        <SheetDescription className="text-muted-foreground">
          {request.contact.company ? `${request.contact.company} · ` : ""}
          Received {formatDateTime(request.createdAt)}
        </SheetDescription>
      </SheetHeader>

      <div className="grid gap-6 px-6 py-5">
        {/* Contact */}
        <section>
          <h3 className="text-xs font-medium tracking-[0.03em] text-muted-foreground uppercase">
            Contact
          </h3>
          <dl className="mt-2 grid gap-2 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Email</dt>
              <dd>
                <a
                  href={`mailto:${request.contact.email}`}
                  className="inline-flex items-center gap-1.5 text-foreground underline-offset-4 hover:underline"
                >
                  <MailIcon className="size-3.5" aria-hidden="true" />
                  {request.contact.email}
                </a>
              </dd>
            </div>
            {request.contact.phone ? (
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">Phone</dt>
                <dd>
                  <a
                    href={`tel:${request.contact.phone.replace(/\s/g, "")}`}
                    className="inline-flex items-center gap-1.5 text-foreground underline-offset-4 hover:underline"
                  >
                    <PhoneIcon className="size-3.5" aria-hidden="true" />
                    {request.contact.phone}
                  </a>
                </dd>
              </div>
            ) : null}
          </dl>
          {request.contact.message ? (
            <blockquote className="mt-3 rounded-xl bg-muted/70 px-4 py-3 text-sm text-foreground">
              {request.contact.message}
            </blockquote>
          ) : null}
        </section>

        {/* The move, or the office */}
        <section>
          <h3 className="text-xs font-medium tracking-[0.03em] text-muted-foreground uppercase">
            {request.service === "relocation" ? "The move" : "The office"}
          </h3>
          <dl className="mt-2 grid gap-2 text-sm">
            <Row
              label={
                request.service === "relocation"
                  ? "People relocating"
                  : "Employees"
              }
              value={request.employees ? String(request.employees) : "—"}
            />
            {request.service === "relocation" ? (
              <>
                <Row label="Moving from" value={request.movingFrom ?? "—"} />
                <Row label="Moving to" value={request.destination ?? "—"} />
                <Row
                  label="Arriving around"
                  value={
                    request.arrival ? formatMonth(request.arrival) : "Not set"
                  }
                />
              </>
            ) : (
              <Row
                label="Contract length"
                value={
                  contractLengths.find(
                    (c) => c.value === request.contractLength,
                  )?.label ?? "Not decided"
                }
              />
            )}
          </dl>
        </section>

        {/* Selection */}
        <section>
          <h3 className="text-xs font-medium tracking-[0.03em] text-muted-foreground uppercase">
            Chosen
          </h3>
          {request.selection.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">
              Nothing recorded.
            </p>
          ) : (
            <ul className="mt-2 divide-y divide-border rounded-xl border border-border">
              {request.selection.map((line, i) => (
                <li
                  key={`${line.label}-${i}`}
                  className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 px-3.5 py-2 text-sm"
                >
                  <span className="text-foreground">{line.label}</span>
                  {line.detail ? (
                    <span className="shrink-0 text-muted-foreground">
                      {line.detail}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
          {request.estimate ? (
            <div className="mt-3 rounded-xl bg-accent/70 px-4 py-3">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm text-foreground">
                  Estimated per month
                </span>
                <span className="font-serif text-xl text-foreground">
                  {formatEgp(request.estimate.monthly)}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatEgp(request.estimate.subtotal)} before discounts
                {request.estimate.bundleDiscount > 0
                  ? ` · bundle −${formatEgp(request.estimate.bundleDiscount)}`
                  : ""}
                {request.estimate.volumeDiscount > 0
                  ? ` · team size −${formatEgp(request.estimate.volumeDiscount)}`
                  : ""}
                {request.estimate.perHire > 0
                  ? ` · plus ${formatEgp(request.estimate.perHire)} per new hire`
                  : ""}
              </p>
            </div>
          ) : null}
        </section>

        {/* Handling */}
        <section className="grid gap-4 border-t border-border pt-5">
          <div className="grid gap-2">
            <Label htmlFor={`${id}-status`}>Status</Label>
            <Select
              items={statusItems}
              value={status}
              onValueChange={(value) => setStatus(value as RequestStatus)}
            >
              <SelectTrigger id={`${id}-status`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`${id}-notes`}>Admin notes</Label>
            <Textarea
              id={`${id}-notes`}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Calls made, what was agreed, next step…"
              className="min-h-28"
              maxLength={5000}
            />
          </div>
        </section>
      </div>

      <SheetFooter className="mt-auto flex-row items-center justify-between gap-3 border-t border-border px-6 py-4">
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button
                variant="ghost"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              />
            }
          >
            <Trash2Icon aria-hidden="true" />
            Delete
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this request?</AlertDialogTitle>
              <AlertDialogDescription>
                The request from {request.contact.name} will be removed for
                good. This can&rsquo;t be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep it</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                onClick={remove}
                disabled={deleting}
              >
                {deleting ? "Deleting…" : "Delete request"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button onClick={save} disabled={!dirty || saving}>
          {saving ? "Saving…" : "Save"}
        </Button>
      </SheetFooter>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-end text-foreground">{value}</dd>
    </div>
  );
}

function formatMonth(yyyyMm: string) {
  const [year, month] = yyyyMm.split("-").map(Number);
  if (!year || !month) return yyyyMm;
  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, 1)));
}
