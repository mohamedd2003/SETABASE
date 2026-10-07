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

/** A drawing's north arrow: a needle in a ring, with N above it. */
function NorthArrow() {
  return (
    <svg
      viewBox="0 0 40 52"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className="h-12 w-auto shrink-0 text-gold"
    >
      <text
        x="20"
        y="9"
        textAnchor="middle"
        fill="currentColor"
        fontSize="10"
        fontFamily="var(--font-sans)"
        fontWeight="500"
      >
        N
      </text>
      <circle cx="20" cy="32" r="15" stroke="currentColor" strokeOpacity="0.45" />
      <path d="M20 15 26 38 20 34Z" fill="currentColor" />
      <path d="M20 15 14 38 20 34Z" stroke="currentColor" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * The footer as the last sheet of a drawing set: a skyline of New Cairo standing on the
 * ground grid, and below it the company's details laid out as an architect's title block —
 * with a location plan of the office, the way a drawing marks where its site is.
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

          {/* Location plan: its columns line up with the cells above, so the map's edge
              falls on the same hairline as the Office cell. */}
          <div className="col-span-full grid border-t border-line-gold-soft sm:grid-cols-2 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,3fr)]">
            <div className={`${cell} justify-between gap-6`}>
              <div className="flex flex-col gap-2">
                <span className={label}>Location plan</span>
                <p className="font-serif text-[1.375rem]/[1.25] font-medium text-white">
                  Find us at {site.office.place}
                </p>              </div>
              <div className="flex items-end justify-between gap-4">
                <a
                  href={site.office.directions}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center rounded-full border border-gold px-5 text-sm font-medium text-gold transition-colors duration-300 hover:bg-gold hover:text-navy-deep"
                >
                  Get directions
                  <span className="sr-only"> (opens Google Maps in a new tab)</span>
                </a>
                <NorthArrow />
              </div>
            </div>

            {/* The map as a viewport on the sheet, toned like a blueprint to sit on the navy;
                a gold mark pulses over the office. */}
            <div className="footer-map relative h-56 border-t border-line-gold-soft sm:h-auto sm:min-h-60 sm:border-s sm:border-t-0">
              <iframe
                src={site.office.mapEmbed}
                title={`Map of the ${site.name} office at ${site.office.place}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 size-full border-0"
              />
              <span aria-hidden="true" className="footer-map-mark" />
              <span aria-hidden="true" className="footer-map-corners" />
            </div>
          </div>

          {/* The sheet's own line: where it was drawn. The copyright sits under the block. */}
          <div className="col-span-full border-t border-line-gold-soft px-5 py-3.5 text-xs text-ink-soft sm:px-6">
            Drawn in New Cairo
          </div>
        </div>
      </div>

      <div className="container-site relative flex flex-col items-center gap-1 pt-6 pb-8 text-center text-xs text-ink-soft nav:pt-8 nav:pb-10">
        <p>&copy; {new Date().getFullYear()} All Rights Reserved.</p>
        <a
          href={site.credit.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-10 items-center text-ink underline underline-offset-4 transition-colors hover:text-gold nav:min-h-0"
        >
          {site.credit.label}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </footer>
  );
}
