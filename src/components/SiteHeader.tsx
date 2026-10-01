import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { MobileNav } from "@/components/MobileNav";
import { site } from "@/content/site";
import type { AudiencePage } from "@/content/types";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

type SiteHeaderProps = {
  switchLink: AudiencePage["switchLink"];
};

const linkClass =
  "text-sm text-ink-soft transition-colors hover:text-white focus-visible:text-white";

export function SiteHeader({ switchLink }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-line-gold-soft bg-navy/95 backdrop-blur-md">
      <div className="container-site flex h-16 items-center justify-between gap-6">
        <Logo size="sm" />

        <nav aria-label="Main" className="hidden items-center gap-7 nav:flex">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className={linkClass}>
              {link.label}
            </a>
          ))}
          <Link href={switchLink.href} className={linkClass}>
            {switchLink.label}
          </Link>
          {/* TODO(app): wire to the real app URL in content/site.ts */}
          <Button variant="brand" size="pill-sm" render={<Link href={site.appUrl} />}>
            Get the app
          </Button>
        </nav>

        <MobileNav
          links={[...navLinks, switchLink]}
          appLink={{ label: "Get the app", href: site.appUrl }}
        />
      </div>
      {/* Reading progress — scroll-driven CSS; hidden where unsupported or with reduced motion. */}
      <span aria-hidden="true" className="scroll-progress absolute inset-x-0 -bottom-px h-px bg-gold" />
    </header>
  );
}
