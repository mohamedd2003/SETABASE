import { Fragment } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/Eyebrow";
import type { AudiencePage } from "@/content/types";

type PhotoHeroProps = {
  hero: AudiencePage["hero"] & { photo: NonNullable<AudiencePage["hero"]["photo"]> };
};

/** Load-sequence delay, in ms. */
const at = (ms: number) => ({ animationDelay: `${ms}ms` });

const WORD_START = 200;
const WORD_STEP = 45;

/** The sticky header's footprint: 12px top gap + 56px pill. The photo runs up behind it. */
const HEADER_OFFSET = "-mt-[68px]";

/**
 * Full-bleed photo hero. The photo settles in from a slight zoom while the headline builds
 * word by word; a strip along the bottom carries the strapline, the four services as
 * jump links, and a scroll cue. A navy wash keeps every word on the photo readable.
 */
export function PhotoHero({ hero }: PhotoHeroProps) {
  const words = hero.title.split(" ");
  const landed = WORD_START + words.length * WORD_STEP;

  return (
    <section
      className={`relative ${HEADER_OFFSET} flex min-h-[100svh] flex-col overflow-hidden rounded-b-[2rem] bg-navy-deep nav:rounded-b-[2.5rem]`}
    >
      <Image
        src={hero.photo.src}
        alt={hero.photo.alt}
        fill
        priority
        placeholder="blur"
        sizes="100vw"
        className="hero-photo object-cover object-[50%_55%]"
      />

      {/* Navy wash: denser at the top for the header and headline, and at the foot for the strip. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgb(10_30_58/0.82)_0%,rgb(10_30_58/0.5)_34%,rgb(10_30_58/0.42)_58%,rgb(10_30_58/0.94)_100%)]"
      />
      {/* A soft pool behind the centred text, so lit windows never compete with the copy. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_55%_42%_at_50%_46%,rgb(10_30_58/0.5),transparent_72%)]"
      />

      <div className="container-site relative flex flex-1 flex-col items-center justify-center pb-12 pt-[calc(68px+3.5rem)] text-center">
        <h1
          aria-label={hero.title}
          className="mx-auto max-w-[17ch] font-serif text-[2.375rem]/[1.1] font-medium text-balance text-white sm:text-3xl nav:text-4xl"
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
          className="anim-rise mx-auto mt-6 max-w-[56ch] text-base text-white/85 sm:text-lg"
          style={at(landed)}
        >
          {hero.paragraph}
        </p>

        <div
          className="anim-rise mt-9 flex flex-wrap items-center justify-center gap-3"
          style={at(landed + 110)}
        >
          <Button variant="brandSolid" size="pill" render={<a href="#contact" />}>
            {hero.cta}
          </Button>
          {hero.secondaryCta ? (
            <Button
              variant="brand"
              size="pill"
              className="bg-navy-deep/30 backdrop-blur-sm"
              render={<a href="#services" />}
            >
              {hero.secondaryCta}
            </Button>
          ) : null}
        </div>
      </div>

      {/* Bottom strip */}
      <div className="container-site relative pb-7 nav:pb-9">
        <div
          className="anim-rise grid gap-7 border-t border-white/15 pt-7 nav:grid-cols-[minmax(0,16rem)_1fr_auto] nav:items-end nav:gap-10"
          style={at(landed + 260)}
        >
          <div>
            <Eyebrow>{hero.summary.eyebrow}</Eyebrow>
            {hero.strapline ? (
              <p className="mt-3 max-w-[22ch] font-serif text-[1.375rem]/[1.25] font-medium text-balance text-white">
                {hero.strapline}
              </p>
            ) : null}
          </div>

          {/* Four across when there's room for each name on one line; two-by-two otherwise. */}
          <ul className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 nav:grid-cols-2 xl:grid-cols-4">
            {hero.summary.rows.map((row) => (
              <li key={row.id}>
                <a href={`#${row.id}`} className="group/row block">
                  <span className="flex items-center gap-2 text-sm font-medium text-white transition-colors duration-300 group-hover/row:text-gold xl:whitespace-nowrap">
                    <span
                      aria-hidden="true"
                      className="h-px w-3 origin-left bg-gold transition-[scale] duration-300 group-hover/row:scale-x-[1.8] rtl:origin-right"
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
            className="group hidden items-center gap-3 justify-self-end text-sm text-white/80 transition-colors hover:text-white sm:flex"
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
}
