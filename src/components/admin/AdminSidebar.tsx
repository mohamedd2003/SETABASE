"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  ChevronsUpDownIcon,
  ExternalLinkIcon,
  InboxIcon,
  LogOutIcon,
  PackageIcon,
  PlaneIcon,
  UsersIcon,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/components/admin/api-client";
import { Wordmark } from "@/components/admin/Wordmark";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";

export const adminNav = [
  { href: "/admin/requests", label: "Requests", icon: InboxIcon },
  { href: "/admin/special-offers", label: "Special Offers", icon: PackageIcon },
  { href: "/admin/corporate-relocation", label: "Corporate Relocation", icon: PlaneIcon },
  { href: "/admin/team", label: "Team", icon: UsersIcon },
] as const;

type AdminSidebarProps = {
  email: string;
  name?: string;
  /** Requests nobody has looked at yet; shown on the Requests item. */
  newRequests: number;
};

/** Comfortable row height when expanded; the primitive makes it a 32px square when collapsed. */
const rowClass = "relative h-11! group-data-[collapsible=icon]:size-8!";

/**
 * Three states, one markup: expanded (labels), collapsed to an icon rail (tooltips, a dot
 * for new requests, the account as a single avatar button) and, under 768px, a sheet.
 */
export function AdminSidebar({ email, name, newRequests }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isMobile, setOpenMobile } = useSidebar();
  const [signingOut, setSigningOut] = useState(false);

  // On the phone the sidebar is a sheet; a tap on a link should close it.
  const closeOnMobile = () => setOpenMobile(false);

  async function signOut() {
    setSigningOut(true);
    try {
      await api("/api/admin/auth/logout", { method: "POST" });
      router.replace("/admin/login");
      router.refresh();
    } catch {
      toast.error("Couldn't sign out. Try again.");
      setSigningOut(false);
    }
  }

  const initial = (name || email).charAt(0);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-14 justify-center px-4 group-data-[collapsible=icon]:px-0">
        <Link
          href="/admin/requests"
          onClick={closeOnMobile}
          className="flex items-center gap-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring group-data-[collapsible=icon]:justify-center"
        >
          <Wordmark className="text-base group-data-[collapsible=icon]:hidden" />
          <span
            aria-hidden="true"
            className="hidden font-serif text-lg font-semibold text-gold group-data-[collapsible=icon]:inline"
          >
            S
          </span>
          <span className="sr-only">SETABASE dashboard</span>
        </Link>
      </SidebarHeader>
      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminNav.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                const showBadge = item.href === "/admin/requests" && newRequests > 0;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={active}
                      tooltip={item.label}
                      className={rowClass}
                      render={<Link href={item.href} onClick={closeOnMobile} />}
                    >
                      <item.icon />
                      {showBadge ? (
                        // Collapsed, the count has no room; a dot says there is something new.
                        <span
                          aria-hidden="true"
                          className="absolute top-1.5 right-1.5 hidden size-2 rounded-full bg-gold group-data-[collapsible=icon]:block"
                        />
                      ) : null}
                      <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                    </SidebarMenuButton>
                    {showBadge ? (
                      <SidebarMenuBadge className="top-3.5! rounded-full bg-gold text-navy-deep peer-hover/menu-button:text-navy-deep peer-data-active/menu-button:text-navy-deep">
                        {newRequests > 99 ? "99+" : newRequests}
                      </SidebarMenuBadge>
                    ) : null}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Open the website"
              className={rowClass}
              render={<a href="/" target="_blank" rel="noreferrer" />}
            >
              <ExternalLinkIcon />
              <span className="group-data-[collapsible=icon]:hidden">Open the website</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    aria-label={`Account: ${email}`}
                    className="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
                  />
                }
              >
                <span
                  aria-hidden="true"
                  className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gold/15 text-sm font-medium text-gold uppercase"
                >
                  {initial}
                </span>
                <span className="grid min-w-0 flex-1 text-start leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate text-sm text-white">{name ?? email}</span>
                  <span className="truncate text-xs text-sidebar-foreground/70">{name ? email : "Signed in"}</span>
                </span>
                <ChevronsUpDownIcon className="ms-auto size-4 group-data-[collapsible=icon]:hidden" aria-hidden="true" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side={isMobile ? "top" : "right"}
                align="end"
                sideOffset={6}
                className="min-w-56"
              >
                {/* A menu label is a group label here — it must live inside a group. */}
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="grid gap-0.5 font-normal">
                    <span className="truncate text-sm font-medium text-foreground">{name ?? "Signed in"}</span>
                    <span className="truncate text-xs text-muted-foreground">{email}</span>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => {
                      closeOnMobile();
                      router.push("/admin/team");
                    }}
                  >
                    <UsersIcon aria-hidden="true" />
                    Team
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={signOut} disabled={signingOut}>
                    <LogOutIcon aria-hidden="true" />
                    {signingOut ? "Signing out…" : "Log out"}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      {/* The sidebar's edge: click it to collapse or expand. */}
      <SidebarRail />
    </Sidebar>
  );
}
