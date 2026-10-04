"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontalIcon, PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { api, ApiError } from "@/components/admin/api-client";
import { RelocationForm } from "@/components/admin/relocation/RelocationForm";
import { EmptyState, PageHeader } from "@/components/admin/States";
import { StageBadge } from "@/components/admin/StatusBadge";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  relocationStageLabels,
  relocationStages,
  type RelocationPackage,
  type RelocationStageKey,
} from "@/lib/catalog";
import { formatEgp } from "@/lib/special-services-pricing";

type Editing = { mode: "create" } | { mode: "edit"; pkg: RelocationPackage } | null;
type StageFilter = RelocationStageKey | "all";

/** The Corporate Relocation catalog, filterable by stage of the move. */
export function RelocationView({ packages }: { packages: RelocationPackage[] }) {
  const router = useRouter();
  const [stage, setStage] = useState<StageFilter>("all");
  const [editing, setEditing] = useState<Editing>(null);
  const [deleting, setDeleting] = useState<RelocationPackage | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const visible = stage === "all" ? packages : packages.filter((p) => p.stage === stage);

  async function toggleActive(pkg: RelocationPackage, isActive: boolean) {
    setBusy(pkg.id);
    try {
      await api(`/api/admin/corporate-relocation/${pkg.id}`, { method: "PATCH", json: { isActive } });
      toast.success(isActive ? `${pkg.title} is live.` : `${pkg.title} is hidden from the website.`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Couldn't update the package.");
    } finally {
      setBusy(null);
    }
  }

  async function remove() {
    if (!deleting) return;
    setBusy(deleting.id);
    try {
      await api(`/api/admin/corporate-relocation/${deleting.id}`, { method: "DELETE" });
      toast.success(`${deleting.title} deleted.`);
      setDeleting(null);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Couldn't delete the package.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      <PageHeader
        title="Corporate Relocation"
        description="The stages and extras on the Corporate Relocation page. Changes go live when saved."
      >
        <Button onClick={() => setEditing({ mode: "create" })}>
          <PlusIcon aria-hidden="true" />
          Add package
        </Button>
      </PageHeader>

      <Tabs value={stage} onValueChange={(value) => setStage(value as StageFilter)}>
        <TabsList
          variant="line"
          // Five stages don't fit on a phone: the strip scrolls, and its end fades so that shows.
          className="w-full justify-start overflow-x-auto border-b border-border [scrollbar-width:none] @max-xl:pe-8 @max-xl:mask-r-from-[calc(100%-2rem)]"
        >
          <TabsTrigger value="all" className="flex-none px-2.5 @md:px-3">
            All
          </TabsTrigger>
          {relocationStages.map((key) => (
            <TabsTrigger key={key} value={key} className="flex-none px-2.5 @md:px-3">
              {relocationStageLabels[key]}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {visible.length === 0 ? (
        <EmptyState
          title={packages.length === 0 ? "No packages yet" : "Nothing in this stage"}
          description={
            packages.length === 0
              ? "Add the first package — the Corporate Relocation page lists only what is here."
              : "Add a package to this stage, or pick another."
          }
        >
          <Button onClick={() => setEditing({ mode: "create" })}>
            <PlusIcon aria-hidden="true" />
            Add package
          </Button>
        </EmptyState>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          {/* Narrow, stage and price sit under the title so the switch and the menu stay in
              view; they get columns of their own once there is room. */}
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Package</TableHead>
                <TableHead className="hidden @3xl:table-cell">Stage</TableHead>
                <TableHead className="hidden @4xl:table-cell">When</TableHead>
                <TableHead className="hidden @5xl:table-cell">Features</TableHead>
                <TableHead className="hidden @3xl:table-cell">Price</TableHead>
                <TableHead className="hidden @4xl:table-cell">Order</TableHead>
                <TableHead>Active</TableHead>
                <TableHead className="w-12 text-end">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((pkg) => (
                <TableRow key={pkg.id} className={busy === pkg.id ? "opacity-60" : undefined}>
                  <TableCell className="py-3 whitespace-normal">
                    <p className="font-medium wrap-anywhere text-foreground">{pkg.title}</p>
                    <p className="text-xs wrap-anywhere text-muted-foreground">{pkg.slug}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 @3xl:hidden">
                      <StageBadge stage={pkg.stage} />
                      <span className="text-xs text-foreground tabular-nums">
                        <PackagePrice pkg={pkg} />
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden @3xl:table-cell">
                    <StageBadge stage={pkg.stage} />
                  </TableCell>
                  <TableCell className="hidden min-w-40 whitespace-normal text-muted-foreground @4xl:table-cell">
                    {pkg.when ?? "—"}
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground tabular-nums @5xl:table-cell">
                    {pkg.features.length}
                  </TableCell>
                  <TableCell className="hidden text-foreground tabular-nums @3xl:table-cell">
                    <PackagePrice pkg={pkg} />
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground tabular-nums @4xl:table-cell">{pkg.sortOrder}</TableCell>
                  <TableCell>
                    <Switch
                      checked={pkg.isActive}
                      disabled={busy === pkg.id}
                      onCheckedChange={(checked) => toggleActive(pkg, checked)}
                      aria-label={`${pkg.title} is ${pkg.isActive ? "active" : "inactive"}`}
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
                            aria-label={`Actions for ${pkg.title}`}
                          />
                        }
                      >
                        <MoreHorizontalIcon aria-hidden="true" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditing({ mode: "edit", pkg })}>
                          <PencilIcon aria-hidden="true" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" onClick={() => setDeleting(pkg)}>
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
        <DialogContent className="max-h-[92svh] overflow-y-auto bg-card sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="pe-8 font-serif text-xl font-medium sm:text-2xl">
              {editing?.mode === "edit" ? `Edit ${editing.pkg.title}` : "Add a package"}
            </DialogTitle>
            <DialogDescription>
              {editing?.mode === "edit"
                ? "Saving updates the website right away."
                : "A new stage or set of extras for the Corporate Relocation page."}
            </DialogDescription>
          </DialogHeader>
          {editing ? (
            <RelocationForm
              key={editing.mode === "edit" ? editing.pkg.id : "new"}
              pkg={editing.mode === "edit" ? editing.pkg : undefined}
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
              {busy ? "Deleting…" : "Delete package"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function PackagePrice({ pkg }: { pkg: RelocationPackage }) {
  if (pkg.priceOnRequest || pkg.price === undefined) {
    return <span className="text-muted-foreground">On request</span>;
  }
  return <>{formatEgp(pkg.price)}</>;
}
