import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { hasDb } from "@/lib/db";
import { countNewRequests } from "@/lib/requests-data";
import { currentSession } from "@/lib/session";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s — SETABASE Dashboard" },
  robots: { index: false, follow: false },
};

/**
 * Every dashboard page. The proxy already turned guests away; this is the server's own
 * check, which also notices an account that was removed or deactivated since signing in.
 */
export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const session = await currentSession();
  if (!session) redirect("/admin/login?reason=signed-out");

  // The sidebar remembers whether it was left open or collapsed (the primitive writes this
  // cookie on toggle); reading it here means no jump after a reload.
  const sidebarOpen = (await cookies()).get("sidebar_state")?.value !== "false";

  // The badge is a nicety; a database hiccup shouldn't take the shell down with it.
  const newRequests = hasDb() ? await countNewRequests().catch(() => 0) : 0;

  return (
    <div data-admin className="contents">
      <TooltipProvider>
        <SidebarProvider defaultOpen={sidebarOpen}>
          <AdminSidebar email={session.email} name={session.name} newRequests={newRequests} />
          <SidebarInset className="min-w-0 bg-background">
            <AdminTopbar />
            <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
      <Toaster position="bottom-right" richColors closeButton />
    </div>
  );
}
