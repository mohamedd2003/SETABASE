"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontalIcon, PencilIcon, PlusIcon, ShieldIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { api, ApiError } from "@/components/admin/api-client";
import { EmptyState, PageHeader } from "@/components/admin/States";
import { formatDateTime } from "@/components/admin/StatusBadge";
import { TeamMemberForm } from "@/components/admin/team/TeamMemberForm";
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
import { Badge } from "@/components/ui/badge";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { TeamMemberRecord } from "@/lib/team-types";

type TeamViewProps = {
  members: TeamMemberRecord[];
  /** The signed-in member's id; absent when signed in with the built-in account. */
  currentId?: string;
  /** The built-in account's email, shown as a read-only row so the list is complete. */
  builtInEmail: string | null;
  currentEmail: string;
};

type Editing = { mode: "create" } | { mode: "edit"; member: TeamMemberRecord } | null;

/** Who can sign in to this dashboard. */
export function TeamView({ members, currentId, builtInEmail, currentEmail }: TeamViewProps) {
  const router = useRouter();
  const [editing, setEditing] = useState<Editing>(null);
  const [deleting, setDeleting] = useState<TeamMemberRecord | null>(null);
  const [busy, setBusy] = useState(false);

  async function remove() {
    if (!deleting) return;
    setBusy(true);
    try {
      await api(`/api/admin/team/${deleting.id}`, { method: "DELETE" });
      toast.success(`${deleting.name || deleting.email} removed.`);
      setDeleting(null);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Couldn't remove the team member.");
    } finally {
      setBusy(false);
    }
  }

  const isBuiltInSession = !currentId && builtInEmail === currentEmail.toLowerCase();

  return (
    <div className="grid gap-6">
      <PageHeader title="Team" description="Everyone who can sign in to this dashboard.">
        <Button onClick={() => setEditing({ mode: "create" })}>
          <PlusIcon aria-hidden="true" />
          Add member
        </Button>
      </PageHeader>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Member</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Last sign-in</TableHead>
              <TableHead className="hidden lg:table-cell">Added</TableHead>
              <TableHead className="w-12 text-end">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {builtInEmail ? (
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableCell>
                  <p className="flex items-center gap-2 font-medium text-foreground">
                    <ShieldIcon className="size-4 text-gold-dark" aria-hidden="true" />
                    Built-in account
                    {isBuiltInSession ? <YouBadge /> : null}
                  </p>
                  <p className="text-xs text-muted-foreground">{builtInEmail}</p>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="border-transparent bg-[#dcefe0] text-[#1f6b3a]">
                    Always active
                  </Badge>
                </TableCell>
                <TableCell className="hidden text-muted-foreground md:table-cell">—</TableCell>
                <TableCell className="hidden text-muted-foreground lg:table-cell">From the server settings</TableCell>
                <TableCell className="text-end text-xs text-muted-foreground">Change it in .env</TableCell>
              </TableRow>
            ) : null}

            {members.map((member) => {
              const self = member.id === currentId;
              return (
                <TableRow key={member.id}>
                  <TableCell>
                    <p className="flex items-center gap-2 font-medium text-foreground">
                      {member.name || member.email}
                      {self ? <YouBadge /> : null}
                    </p>
                    {member.name ? <p className="text-xs text-muted-foreground">{member.email}</p> : null}
                  </TableCell>
                  <TableCell>
                    {member.isActive ? (
                      <Badge variant="secondary" className="border-transparent bg-[#dcefe0] text-[#1f6b3a]">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="border-transparent bg-muted text-muted-foreground">
                        Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">
                    {member.lastLoginAt ? formatDateTime(member.lastLoginAt) : "Never"}
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground lg:table-cell">
                    {formatDateTime(member.createdAt)}
                  </TableCell>
                  <TableCell className="text-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={<Button variant="ghost" size="icon" aria-label={`Actions for ${member.name || member.email}`} />}
                      >
                        <MoreHorizontalIcon aria-hidden="true" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditing({ mode: "edit", member })}>
                          <PencilIcon aria-hidden="true" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" disabled={self} onClick={() => setDeleting(member)}>
                          <Trash2Icon aria-hidden="true" />
                          {self ? "Remove (not your own account)" : "Remove"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {members.length === 0 ? (
          <div className="border-t border-border">
            <EmptyState
              title="No team members yet"
              description="Add the people who should be able to sign in. The built-in account from the server settings always works as a fallback."
            >
              <Button onClick={() => setEditing({ mode: "create" })}>
                <PlusIcon aria-hidden="true" />
                Add member
              </Button>
            </EmptyState>
          </div>
        ) : null}
      </div>

      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[92svh] overflow-y-auto bg-card sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl font-medium">
              {editing?.mode === "edit" ? `Edit ${editing.member.name || editing.member.email}` : "Add a team member"}
            </DialogTitle>
            <DialogDescription>
              {editing?.mode === "edit"
                ? "Change their details or set a new password."
                : "They sign in at /admin with the email and password you set here."}
            </DialogDescription>
          </DialogHeader>
          {editing ? (
            <TeamMemberForm
              key={editing.mode === "edit" ? editing.member.id : "new"}
              member={editing.mode === "edit" ? editing.member : undefined}
              self={editing.mode === "edit" && editing.member.id === currentId}
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
            <AlertDialogTitle>Remove {deleting?.name || deleting?.email}?</AlertDialogTitle>
            <AlertDialogDescription>
              They&rsquo;re signed out at once and can&rsquo;t sign in again. Requests and packages they worked on
              stay as they are. This can&rsquo;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep them</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={remove} disabled={busy}>
              {busy ? "Removing…" : "Remove member"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function YouBadge() {
  return (
    <Badge variant="outline" className="border-gold/50 text-gold-dark">
      You
    </Badge>
  );
}
