"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRightIcon } from "lucide-react";
import { adminNav } from "@/components/admin/AdminSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";

/** Sidebar toggle, the page's title and where it sits: Dashboard › Section. */
export function AdminTopbar() {
  const pathname = usePathname();
  const current = adminNav.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur-sm sm:px-6">
      <SidebarTrigger className="-ms-1.5 text-foreground pointer-coarse:-ms-2.5 pointer-coarse:size-10" />
      <span aria-hidden="true" className="h-5 w-px shrink-0 bg-border" />
      <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-sm">
        <Link
          href="/admin/requests"
          className="shrink-0 py-2.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          Dashboard
        </Link>
        {current ? (
          <>
            <ChevronRightIcon aria-hidden="true" className="size-3.5 shrink-0 text-muted-foreground" />
            <span aria-current="page" className="truncate font-medium text-foreground">
              {current.label}
            </span>
          </>
        ) : null}
      </nav>
    </header>
  );
}
