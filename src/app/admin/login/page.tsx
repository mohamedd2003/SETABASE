import type { Metadata } from "next";
import { InboxIcon, PackageIcon, PlaneIcon, ShieldCheckIcon } from "lucide-react";
import { LoginForm } from "@/components/admin/LoginForm";
import { Wordmark } from "@/components/admin/Wordmark";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

const features = [
  { icon: InboxIcon, title: "Requests", text: "Track incoming leads" },
  { icon: PackageIcon, title: "Special Offers", text: "Manage workplace packages" },
  { icon: PlaneIcon, title: "Corporate Relocation", text: "Manage relocation packages" },
  { icon: ShieldCheckIcon, title: "Secure access", text: "Admin-only dashboard" },
];

type Props = { searchParams: Promise<{ next?: string; reason?: string }> };

export default async function AdminLoginPage({ searchParams }: Props) {
  const { next, reason } = await searchParams;

  return (
    <div data-admin className="grid min-h-svh bg-cream text-navy-deep nav:grid-cols-2">
      {/* Form side */}
      <main className="flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-sm">
          <Wordmark light={false} className="nav:hidden" />
          <h1 className="mt-8 font-serif text-3xl font-medium nav:mt-0">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to access the SETABASE dashboard</p>
          <LoginForm next={next} reason={reason} />
        </div>
      </main>

      {/* Brand side */}
      <aside className="admin-brand relative hidden flex-col justify-between overflow-hidden p-10 text-white nav:flex xl:p-14">
        <span aria-hidden="true" className="blueprint-grid blueprint-grid-gold pointer-events-none absolute inset-0" />
        <Wordmark className="relative" />

        <div className="relative">
          <h2 className="font-serif text-[2.75rem]/[1.1] font-medium text-balance xl:text-4xl">
            Manage SETABASE
            <span className="text-gold-gradient block">all in one place</span>
          </h2>
          <p className="mt-5 max-w-[44ch] text-white/75">
            Every request from the website, and every package it sells, from one screen. Changes to
            packages go live on the site as soon as they are saved.
          </p>

          <ul className="mt-10 grid grid-cols-2 gap-3">
            {features.map(({ icon: Icon, title, text }) => (
              <li
                key={title}
                className="rounded-2xl border border-gold/25 bg-white/[0.04] p-4 backdrop-blur-sm"
              >
                <Icon className="size-5 text-gold" aria-hidden="true" />
                <p className="mt-3 text-sm font-medium">{title}</p>
                <p className="mt-0.5 text-xs text-white/65">{text}</p>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-white/55">© 2026 SETABASE. All rights reserved.</p>
      </aside>
    </div>
  );
}
