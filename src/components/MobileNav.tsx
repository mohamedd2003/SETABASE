"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { MenuIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type NavLink = { label: string; href: string };

type MobileNavProps = {
  links: NavLink[];
  appLink: NavLink;
};

/** Below 880px the header links collapse behind this toggle. */
export function MobileNav({ links, appLink }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

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
          className="absolute inset-x-0 top-full border-b border-line-gold-soft bg-navy-deep"
        >
          <nav aria-label="Main" className="container-site flex flex-col gap-1 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-line-gold-soft py-3 text-base text-ink transition-colors last:border-b-0 hover:text-gold"
              >
                {link.label}
              </Link>
            ))}
            <Button
              variant="brand"
              size="pill"
              className="mt-4 self-start"
              render={<Link href={appLink.href} onClick={() => setOpen(false)} />}
            >
              {appLink.label}
            </Button>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
