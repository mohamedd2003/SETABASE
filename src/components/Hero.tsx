import { Fragment } from "react";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/Eyebrow";
import { TowerCluster, VillaElevation } from "@/components/LandingArt";
import type { AudiencePage } from "@/content/types";

type HeroProps = {
  hero: AudiencePage["hero"];
};

/** Load-sequence delay, in ms. */
const at = (ms: number) => ({ animationDelay: `${ms}ms` });

const WORD_START = 120;
const WORD_STEP = 45;

/**
 * The page's one bold moment: the headline builds word by word, then the copy, the CTA
 * and the summary panel follow. The panel carries the same drawing as its landing half,
 * standing on a gold line, and each row jumps to its service card.
 */
export function Hero({ hero }: HeroProps) {
  const words = hero.title.split(" ");
  // When the last word has started rising — everything else keys off this.
  const landed = WORD_START + words.length * WORD_STEP;
  const Art = hero.art === "villa" ? VillaElevation : TowerCluster;

  return (
    <section className="relative overflow-hidden">
      <span
        aria-hidden="true"
        className="blueprint-grid blueprint-grid-gold pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_75%_at_22%_45%,#000_10%,transparent_75%)]"
      />

      <div className="container-site relative grid gap-12 py-16 nav:grid-cols-12 nav:items-center nav:gap-10 nav:py-24">
        <div data-scroll-fade className="flex flex-col items-start gap-8 nav:col-span-7">
          {/* 38px on phones → 48px from 640px → 64px once the two-column layout kicks in */}
          <h1
            aria-label={hero.title}
            className="max-w-[18ch] font-serif text-[2.375rem]/[1.1] font-medium text-balance text-white sm:text-3xl nav:text-4xl"
          >
            {words.map((word, i) => (
              <Fragment key={i}>
                <span aria-hidden="true" className="hero-word">
                  <span style={at(WORD_START + i * WORD_STEP)}>{word}</span>
                </span>
                {i < words.length - 1 ? " " : null}
              </Fragment>
            ))}
          </h1>
          <p
            className="anim-rise max-w-[52ch] text-base text-ink-soft sm:text-lg"
            style={at(landed)}
          >
            {hero.paragraph}
          </p>
          <Button
            variant="brand"
            size="pill"
            className="anim-rise"
            style={at(landed + 110)}
            nativeButton={false}
            render={<a href="#contact" />}
          >
            {hero.cta}
          </Button>
        </div>

        <div
          className="anim-rise overflow-hidden rounded-3xl border border-line-gold-soft bg-navy-deep nav:col-span-5"
          style={at(landed - 180)}
        >
          {/* The building stands on the panel's own line. */}
          <div
            aria-hidden="true"
            className="overflow-hidden border-b border-line-gold px-7 pt-7 text-gold"
          >
            <span className="anim-build block opacity-60" style={at(landed)}>
              <Art className="mx-auto -mb-[6%] block h-auto w-full max-w-[15rem]" />
            </span>
          </div>

          <div className="p-7 nav:p-8">
            <Eyebrow className="mb-3">{hero.summary.eyebrow}</Eyebrow>
            <ul className="divide-y divide-line-gold-soft">
              {hero.summary.rows.map((row, i) => (
                <li key={row.id} className="anim-rise" style={at(landed + 120 + i * 70)}>
                  <a
                    href={`#${row.id}`}
                    className="group/row flex items-baseline justify-between gap-6 py-4"
                  >
                    {/* Transform only — the label slides and the dimension rule (the landing
                        page's motif) fills the space it leaves, so nothing re-wraps. */}
                    <span className="relative font-medium text-ink transition-[color,translate] duration-300 group-hover/row:translate-x-4 group-hover/row:text-gold rtl:group-hover/row:-translate-x-4">
                      <span
                        aria-hidden="true"
                        className="absolute -start-4 top-1/2 h-px w-3 origin-left scale-x-0 bg-gold transition-[scale] duration-300 group-hover/row:scale-x-100 rtl:origin-right"
                      />
                      {row.label}
                    </span>
                    <span className="text-end text-sm text-ink-soft">{row.audience}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
