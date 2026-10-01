"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { MenuIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type NavLink = { label: string; href: string };

type MobileNavProps = {
  links: NavLink[];
  appLink: NavLink;
};

/**
 * Below 880px the header links collapse behind this toggle. The menu opens as a rounded
 * card under the header pill (it positions against the pill) and closes on Escape.
 */
export function MobileNav({ links, appLink }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const itemClass =
    "rounded-2xl px-4 py-3 text-base text-ink transition-colors hover:bg-white/[0.06] hover:text-gold";

  return (
    <div className="nav:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="flex size-10 items-center justify-center rounded-full border border-line-gold-soft text-gold transition-colors hover:border-gold"
      >
        {open ? <XIcon className="size-5" /> : <MenuIcon className="size-5" />}
      </button>

      {open ? (
        <div
          id={panelId}
          className="anim-rise absolute inset-x-0 top-full mt-2 rounded-3xl border border-line-gold-soft bg-navy-deep p-3 shadow-[0_16px_40px_-16px_rgb(5_14_30/0.8)]"
          style={{ animationDuration: "320ms" }}
        >
          <div className="flex flex-col gap-1">
            {links.map((link) =>
              // In-page anchors stay native so the browser updates :target and scrolls itself;
              // next/link's pushState skips both.
              link.href.startsWith("#") ? (
                <a key={link.href} href={link.href} onClick={() => setOpen(false)} className={itemClass}>
                  {link.label}
                </a>
              ) : (
                <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className={itemClass}>
                  {link.label}
                </Link>
              ),
            )}
            <Button
              variant="brand"
              size="pill"
              className="mt-2 w-full"
              render={<Link href={appLink.href} onClick={() => setOpen(false)} />}
            >
              {appLink.label}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
