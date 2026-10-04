"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontalIcon, PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { api, ApiError } from "@/components/admin/api-client";
import { OfferForm } from "@/components/admin/offers/OfferForm";
import { EmptyState, PageHeader } from "@/components/admin/States";
import { CategoryBadge } from "@/components/admin/StatusBadge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { SpecialOffer } from "@/lib/catalog";
import { formatEgp } from "@/lib/special-services-pricing";

type Editing = { mode: "create" } | { mode: "edit"; offer: SpecialOffer } | null;

/** The Special Services catalog: what the website sells, and whether it's live. */
export function OffersView({ offers }: { offers: SpecialOffer[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Editing>(null);
  const [deleting, setDeleting] = useState<SpecialOffer | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  async function toggleActive(offer: SpecialOffer, isActive: boolean) {
    setBusy(offer.id);
    try {
      await api(`/api/admin/special-offers/${offer.id}`, { method: "PATCH", json: { isActive } });
      toast.success(isActive ? `${offer.title} is live.` : `${offer.title} is hidden from the website.`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Couldn't update the offer.");
    } finally {
      setBusy(null);
    }
  }

  async function remove() {
    if (!deleting) return;
    setBusy(deleting.id);
    try {
      await api(`/api/admin/special-offers/${deleting.id}`, { method: "DELETE" });
      toast.success(`${deleting.title} deleted.`);
      setDeleting(null);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Couldn't delete the offer.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      <PageHeader
        title="Special Offers"
        description="The packages on the Special Services page. Changes go live when saved."
      >
        <Button onClick={() => setEditing({ mode: "create" })}>
          <PlusIcon aria-hidden="true" />
          Add offer
        </Button>
      </PageHeader>

      {offers.length === 0 ? (
        <EmptyState
          title="No offers yet"
          description="Add the first package — the Special Services page lists only what is here."
        >
          <Button onClick={() => setEditing({ mode: "create" })}>
            <PlusIcon aria-hidden="true" />
            Add offer
          </Button>
        </EmptyState>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          {/* Narrow, category and price sit under the title so the switch and the menu stay
              in view; they get columns of their own once there is room. */}
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Offer</TableHead>
                <TableHead className="hidden @3xl:table-cell">Category</TableHead>
                <TableHead className="hidden @3xl:table-cell">Client price</TableHead>
                <TableHead className="hidden @4xl:table-cell">Per employee</TableHead>
                <TableHead className="hidden @5xl:table-cell">Items</TableHead>
                <TableHead className="hidden @4xl:table-cell">Order</TableHead>
                <TableHead>Active</TableHead>
                <TableHead className="w-12 text-end">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {offers.map((offer) => (
                <TableRow key={offer.id} className={busy === offer.id ? "opacity-60" : undefined}>
                  <TableCell className="py-3 whitespace-normal">
                    <p className="font-medium wrap-anywhere text-foreground">{offer.title}</p>
                    <p className="text-xs wrap-anywhere text-muted-foreground">{offer.slug}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 @3xl:hidden">
                      <CategoryBadge category={offer.category} />
                      <span className="text-xs text-foreground tabular-nums">
                        <ClientPrice offer={offer} />
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden @3xl:table-cell">
                    <CategoryBadge category={offer.category} />
                  </TableCell>
                  <TableCell className="hidden text-foreground tabular-nums @3xl:table-cell">
                    <ClientPrice offer={offer} />
                  </TableCell>
                  <TableCell className="hidden text-foreground tabular-nums @4xl:table-cell">
                    {offer.pricePerEmployee !== undefined && !offer.priceOnRequest ? (
                      formatEgp(offer.pricePerEmployee)
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground tabular-nums @5xl:table-cell">
                    {offer.items.length}
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground tabular-nums @4xl:table-cell">
                    {offer.sortOrder}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={offer.isActive}
                      disabled={busy === offer.id}
                      onCheckedChange={(checked) => toggleActive(offer, checked)}
                      aria-label={`${offer.title} is ${offer.isActive ? "active" : "inactive"}`}
                    />
                  </TableCell>
                  <TableCell className="text-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon"
                            className="pointer-coarse:size-10"
                            aria-label={`Actions for ${offer.title}`}
                          />
                        }
                      >
                        <MoreHorizontalIcon aria-hidden="true" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditing({ mode: "edit", offer })}>
                          <PencilIcon aria-hidden="true" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" onClick={() => setDeleting(offer)}>
                          <Trash2Icon aria-hidden="true" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[92svh] overflow-y-auto bg-card sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="pe-8 font-serif text-xl font-medium sm:text-2xl">
              {editing?.mode === "edit" ? `Edit ${editing.offer.title}` : "Add an offer"}
            </DialogTitle>
            <DialogDescription>
              {editing?.mode === "edit"
                ? "Saving updates the website right away."
                : "A new package for the Special Services page."}
            </DialogDescription>
          </DialogHeader>
          {editing ? (
            <OfferForm
              key={editing.mode === "edit" ? editing.offer.id : "new"}
              offer={editing.mode === "edit" ? editing.offer : undefined}
              onCancel={() => setEditing(null)}
              onSaved={() => {
                setEditing(null);
                router.refresh();
              }}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleting !== null} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleting?.title}?</AlertDialogTitle>
            <AlertDialogDescription>
              It disappears from the website immediately. Requests that already chose it keep their copy of
              its name. This can&rsquo;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={remove} disabled={busy !== null}>
              {busy ? "Deleting…" : "Delete offer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/** What the client pays a month for 20 employees, or why there's no single figure. */
function ClientPrice({ offer }: { offer: SpecialOffer }) {
  if (offer.priceOnRequest) return <span className="text-muted-foreground">On request</span>;
  if (offer.clientPrice === undefined) return <span className="text-muted-foreground">À la carte</span>;
  return <>{formatEgp(offer.clientPrice)}/mo</>;
}
