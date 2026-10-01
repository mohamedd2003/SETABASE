import Link from "next/link";
import { Eyebrow } from "@/components/Eyebrow";
import { TowerCluster, VillaElevation } from "@/components/LandingArt";
import { LogoStacked } from "@/components/Logo";

type Half = {
  eyebrow: string;
  title: string;
  copy: string;
  href: "/private" | "/business";
  tone: "light" | "dark";
};

const halves: [Half, Half] = [
  {
    eyebrow: "For yourself",
    title: "Private",
    copy: "Owner, tenant, buyer, or moving to Egypt on your own.",
    href: "/private",
    tone: "light",
  },
  {
    eyebrow: "For your business",
    title: "Business",
    copy: "HOAs, developers, and employers — from local firms to multinationals — relocating staff or managing a workplace.",
    href: "/business",
    tone: "dark",
  },
];

/** Load sequence: the drawings build from the ground up, then the content rises. */
const rise = (ms: number) => ({ animationDelay: `${ms}ms` });

/**
 * Landing choice screen — two full-bleed halves, each an architect's plate for its audience.
 * Hovering a half opens it up: it widens, its drawing brightens, and the rule under the
 * title extends. Content sits in a fixed-width column so nothing re-wraps as the half grows.
 */
export function SplitChoice() {
  return (
    <main className="landing flex min-h-dvh flex-col split:flex-row">
      {halves.map((half) => {
        const light = half.tone === "light";
        return (
          <Link
            key={half.href}
            href={half.href}
            aria-label={`${half.title} — ${half.copy}`}
            className={[
              // No `flex-1` here: .landing-half owns flex-grow so the hover can change it.
              // A utility would sit in a later cascade layer and win.
              // Tight vertical padding on phones so both halves fit one screen without scrolling.
              "landing-half group relative flex flex-col items-center justify-center overflow-hidden px-6 py-10 text-center focus-visible:outline-offset-[-4px] split:py-20",
              light
                ? "bg-pale hover:bg-[color-mix(in_srgb,var(--pale)_93%,var(--navy))] focus-visible:bg-[color-mix(in_srgb,var(--pale)_93%,var(--navy))]"
                : "bg-navy hover:bg-navy-deep focus-visible:bg-navy-deep",
            ].join(" ")}
          >
            <span
              aria-hidden="true"
              className={[
                "landing-grid pointer-events-none absolute inset-0",
                light ? "landing-grid-light" : "landing-grid-dark",
              ].join(" ")}
            />

            <span
              aria-hidden="true"
              className={[
                // Phones keep the grid only: the halves are too short for the drawing
                // and the copy to share space without the text losing legibility.
                "landing-art pointer-events-none absolute inset-x-0 bottom-0 hidden justify-center px-8 pb-10 transition-[opacity,transform] duration-700 group-hover:-translate-y-2 group-focus-visible:-translate-y-2 split:flex",
                light
                  ? "text-navy-deep opacity-[0.15] group-hover:opacity-[0.26] group-focus-visible:opacity-[0.26]"
                  : "text-gold opacity-[0.2] group-hover:opacity-[0.34] group-focus-visible:opacity-[0.34]",
              ].join(" ")}
            >
              {light ? (
                <VillaElevation className="h-auto w-[min(80%,29rem)]" />
              ) : (
                <TowerCluster className="h-auto w-[min(80%,29rem)]" />
              )}
            </span>

            <span className="relative z-10 flex w-full max-w-[25rem] flex-col items-center gap-5">
              <LogoStacked onLight={light} className="landing-rise" style={rise(420)} />
              <Eyebrow onLight={light} className="landing-rise mt-2" style={rise(520)}>
                {half.eyebrow}
              </Eyebrow>
              <h2
                style={rise(600)}
                className={[
                  "landing-rise font-serif text-[2.5rem]/[1.1] font-medium sm:text-3xl split:text-4xl",
                  light ? "text-navy-deep" : "text-white",
                ].join(" ")}
              >
                {half.title}
              </h2>
              {/* Dimension rule: solid dark gold reads on pale, brand gold on navy. */}
              <span
                aria-hidden="true"
                style={rise(700)}
                className={[
                  "landing-rise landing-rule block h-px",
                  light ? "bg-gold-dark" : "bg-gold",
                ].join(" ")}
              />
              <p
                style={rise(780)}
                className={["landing-rise", light ? "text-ink-cream-soft" : "text-ink-soft"].join(" ")}
              >
                {half.copy}
              </p>
            </span>
          </Link>
        );
      })}
    </main>
  );
}
