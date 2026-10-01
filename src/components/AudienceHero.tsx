import { Fragment, type CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/Eyebrow";
import { HeroCarousel, HeroCarouselControls, HeroCarouselSlides } from "@/components/HeroCarousel";
import { HeroModel } from "@/components/HeroModel";
import type { AudiencePage } from "@/content/types";

type AudienceHeroProps = {
  hero: AudiencePage["hero"];
};

/** Load-sequence delay, in ms. */
const at = (ms: number) => ({ animationDelay: `${ms}ms` });

const WORD_START = 200;
const WORD_STEP = 45;

/** The sticky header's footprint: 12px top gap + 56px pill. The sky runs up behind it. */
const HEADER_OFFSET = "-mt-[68px]";

/**
 * Hero for both audience pages. The headline builds word by word while the audience's
 * building flies together from its pieces beside it; a strip along the foot carries the
 * services as jump links. Private's photos crossfade softly behind the sky.
 */
export function AudienceHero({ hero }: AudienceHeroProps) {
  const words = hero.title.split(" ");
  const landed = WORD_START + words.length * WORD_STEP;
  const photos = hero.photos?.length ? hero.photos : null;

  const section = (
    <section
      className={`relative ${HEADER_OFFSET} flex min-h-[100svh] flex-col overflow-hidden rounded-b-[2rem] bg-navy-deep nav:rounded-b-[2.5rem]`}
    >
      <span
        aria-hidden="true"
        className="landing-sky hero-sky pointer-events-none absolute inset-0"
      >
        {photos ? (
          <span className="hero-backdrop">
            <HeroCarouselSlides />
          </span>
        ) : null}
        <span className="landing-lights" />
        <span className="landing-glow" />
        <span className="landing-floor" />
      </span>

      <div className="container-site relative grid flex-1 grid-cols-[minmax(0,1fr)] content-center gap-2 pt-[68px] pb-6 nav:gap-4 nav:pt-[calc(68px+2.5rem)] nav:grid-cols-[minmax(0,11fr)_minmax(0,10fr)] nav:items-center nav:gap-10 nav:pb-10">
        <div data-scroll-fade className="relative z-10">
          <h1
            aria-label={hero.title}
            className="max-w-[16ch] font-serif text-[2.375rem]/[1.08] font-medium text-balance text-white sm:text-3xl nav:text-[3.25rem] xl:text-4xl"
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
            className="anim-rise mt-6 max-w-[50ch] text-base text-white/80 sm:text-lg"
            style={at(landed)}
          >
            {hero.paragraph}
          </p>

          <div
            className="anim-rise mt-8 flex flex-wrap items-center gap-3"
            style={at(landed + 110)}
          >
            <Button
              variant="brandSolid"
              size="pill"
              nativeButton={false}
              render={<a href="#contact" />}
            >
              {hero.cta}
            </Button>
            <Button
              variant="brand"
              size="pill"
              nativeButton={false}
              className="bg-navy-deep/30 backdrop-blur-sm"
              render={<a href="#services" />}
            >
              {hero.secondaryCta ?? "Explore services"}
            </Button>
          </div>
        </div>

        {/* Phones see the model first, so its arrival isn't spent below the fold. */}
        <div className="order-first nav:order-none">
          <HeroModel art={hero.art} />
        </div>
      </div>

      {/* Bottom strip: the services as jump links. */}
      <div className="container-site relative pb-7 nav:pb-9">
        <div
          className={`anim-rise relative grid gap-6 border-t border-white/15 pt-6 nav:items-end nav:gap-x-10 ${
            // Without a strapline the label takes its own row, leaving the services the width.
            hero.strapline
              ? "nav:grid-cols-[minmax(0,15rem)_1fr_auto]"
              : "nav:grid-cols-[1fr_auto] nav:gap-y-4"
          }`}
          style={at(landed + 260)}
        >
          {photos ? (
            <div className="absolute end-0 bottom-full -me-1.5 mb-1">
              <HeroCarouselControls />
            </div>
          ) : null}

          <div className={hero.strapline ? undefined : "nav:col-span-full"}>
            <Eyebrow>{hero.summary.eyebrow}</Eyebrow>
            {hero.strapline ? (
              <p className="mt-3 max-w-[22ch] font-serif text-[1.375rem]/[1.25] font-medium text-balance text-white">
                {hero.strapline}
              </p>
            ) : null}
          </div>

          <ul
            style={{ "--cols": hero.summary.rows.length } as CSSProperties}
            className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 xl:grid-cols-[repeat(var(--cols),minmax(0,1fr))]"
          >
            {hero.summary.rows.map((row) => (
              <li key={row.id}>
                <a href={`#${row.id}`} className="group/row block">
                  <span className="flex items-center gap-2 text-sm font-medium text-white transition-colors duration-300 group-hover/row:text-gold">
                    <span
                      aria-hidden="true"
                      className="h-px w-3 shrink-0 origin-left bg-gold transition-[scale] duration-300 group-hover/row:scale-x-[1.8] rtl:origin-right"
                    />
                    {row.label}
                  </span>
                  <span className="mt-1 block ps-5 text-xs text-white/60">{row.audience}</span>
                </a>
              </li>
            ))}
          </ul>

          <a
            href="#services"
            className="group hidden items-center gap-3 justify-self-end text-sm text-white/80 transition-colors hover:text-white nav:flex"
          >
            <span
              aria-hidden="true"
              className="flex h-9 w-6 justify-center rounded-full border border-white/45 transition-colors group-hover:border-gold"
            >
              <span className="scroll-cue mt-1.5 h-1.5 w-1 rounded-full bg-gold" />
            </span>
            Scroll
          </a>
        </div>
      </div>
    </section>
  );

  // The carousel's state is shared by the backdrop and its controls in the strip.
  return photos ? <HeroCarousel photos={photos}>{section}</HeroCarousel> : section;
}
