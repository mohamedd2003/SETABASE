import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { MobileNav } from "@/components/MobileNav";
import { site } from "@/content/site";

const defaultLinks = [
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

type SiteHeaderProps = {
  switchLink: { label: string; href: string };
  /** In-page links on the start side; the audience pages' Services and Contact by default. */
  navLinks?: { label: string; href: string }[];
};

const linkClass =
  "rounded-full px-4 py-2 text-sm text-ink-soft transition-colors hover:bg-white/[0.06] hover:text-white focus-visible:text-white";

/**
 * Floating pill header with the logo in the centre. A three-column grid (1fr auto 1fr)
 * keeps the logo exactly centred whatever the widths on either side.
 */
export function SiteHeader({ switchLink, navLinks = defaultLinks }: SiteHeaderProps) {
  return (
    <header data-autohide className="sticky top-0 z-40">
      <div className="container-site pt-3">
        <nav
          aria-label="Main"
          className="header-pill relative grid h-14 grid-cols-[1fr_auto_1fr] items-center rounded-full border border-line-gold-soft bg-navy-deep/90 px-2 shadow-[0_10px_30px_-14px_rgb(5_14_30/0.7)] backdrop-blur-md"
        >
          {/* Start: in-page links on desktop, the menu toggle on phones */}
          <div className="flex items-center justify-self-start">
            <div className="hidden items-center nav:flex">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} className={linkClass}>
                  {link.label}
                </a>
              ))}
            </div>
            <MobileNav
              links={[...navLinks, switchLink]}
              appLink={{ label: "Get the app", href: site.appUrl }}
            />
          </div>

          <Logo size="sm" className="justify-self-center px-3" />

          {/* End: audience switch and app on desktop; a spacer on phones keeps the logo centred */}
          <div className="flex items-center gap-1 justify-self-end">
            <Link href={switchLink.href} className={`${linkClass} hidden nav:inline-flex`}>
              {switchLink.label}
            </Link>
            {/* TODO(app): wire to the real app URL in content/site.ts */}
            <Button
              variant="brand"
              size="pill-sm"
              className="hidden nav:inline-flex"
              nativeButton={false}
              render={<Link href={site.appUrl} />}
            >
              Get the app
            </Button>
            <span aria-hidden="true" className="size-10 nav:hidden" />
          </div>

          {/* Reading progress, clipped to the pill's rounded edge. Scroll-driven CSS;
              hidden where unsupported or with reduced motion. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
          >
            <span className="scroll-progress absolute inset-x-8 bottom-0 h-px bg-gold" />
          </span>
        </nav>
      </div>
    </header>
  );
}
