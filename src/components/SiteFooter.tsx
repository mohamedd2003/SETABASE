import Link from "next/link";
import { FooterSkyline } from "@/components/FooterSkyline";
import { Logo } from "@/components/Logo";
import { site } from "@/content/site";

const pages = [
  { label: "For individuals", href: "/private" },
  { label: "For businesses", href: "/business" },
  { label: "Start here", href: "/" },
];

const cell = "flex flex-col gap-2 border-line-gold-soft p-5 sm:p-6";
const label = "text-xs text-ink-soft";
// 40px tall on touch screens, so each link is easy to tap; desktop keeps the tight rhythm.
const link =
  "-my-1.5 inline-flex min-h-10 items-center self-start text-sm text-ink transition-colors hover:text-gold nav:my-0 nav:min-h-0";

/**
 * The footer as the last sheet of a drawing set: a skyline of New Cairo standing on the
 * ground grid, and below it the company's details laid out as an architect's title block.
 */
export function SiteFooter() {
  return (
    <footer className="footer-scene relative overflow-hidden pt-6">
      <span aria-hidden="true" className="footer-glow pointer-events-none absolute inset-0" />
      <span
        aria-hidden="true"
        className="landing-floor footer-floor pointer-events-none absolute"
      />

      <div className="container-site relative">
        <FooterSkyline />

        {/* Title block: the cells divide with hairlines, like the corner of a drawing. */}
        <div className="relative -mt-6 grid overflow-hidden rounded-3xl border border-line-gold-soft bg-navy-deep/75 backdrop-blur-md sm:grid-cols-2 xl:-mt-10 xl:grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,1fr))]">
          <div className={`${cell} gap-4 sm:col-span-2 xl:col-span-1`}>
            <Logo size="sm" />
            <p className="max-w-[34ch] text-sm text-ink-soft">
              Property, facility, relocation and real estate &mdash; one partner in New Cairo
              instead of five.
            </p>
          </div>

          <div className={`${cell} border-t xl:border-s xl:border-t-0`}>
            <span className={label}>Office</span>
            <address className="flex flex-col text-sm text-ink not-italic">
              {site.office.lines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </address>
          </div>

          <div className={`${cell} border-t sm:border-s xl:border-t-0`}>
            <span className={label}>Contact</span>
            <a href={`mailto:${site.email}`} className={link}>
              {site.email}
            </a>
            <a href={`tel:${site.phone.replace(/\s/g, "")}`} className={link}>
              {site.phone}
            </a>
          </div>

          <nav
            aria-label="Footer"
            className={`${cell} border-t sm:col-span-2 xl:col-span-1 xl:border-s xl:border-t-0`}
          >
            <span className={label}>Pages</span>
            {pages.map((page) => (
              <Link key={page.href} href={page.href} className={link}>
                {page.label}
              </Link>
            ))}
          </nav>

          {/* The sheet's own line: who drew it, where, and when. */}
          <div className="col-span-full flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-t border-line-gold-soft px-5 py-3.5 text-xs text-ink-soft sm:px-6">
            <span>
              &copy; {new Date().getFullYear()} {site.name}
            </span>
            <span>Drawn in New Cairo</span>
          </div>
        </div>
      </div>

      <div className="h-8 nav:h-12" />
    </footer>
  );
}
