"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { DepartmentIcon } from "@/components/DepartmentIcon";
import { ExplainerModel, type ExplainerFocus } from "@/components/ExplainerModel";
import type { Explainer as ExplainerContent } from "@/content/types";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type ExplainerProps = {
  explainer: ExplainerContent;
};

const sides = [
  { focus: "property", icon: "property-management" },
  { focus: "facility", icon: "facility-management" },
] as const;

/**
 * Property vs Facility Management, told through one leak. A cut-open building sits
 * between the two answers with a pipe dripping into the middle apartment; pointing at an
 * answer (or, on phones, scrolling to it) lights the part of the case it looks after.
 */
export function Explainer({ explainer }: ExplainerProps) {
  const root = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<ExplainerFocus>(null);
  const [scrolled, setScrolled] = useState<ExplainerFocus>(null);
  const focus = hovered ?? scrolled;

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      // Phones can't point: whichever answer is in the middle of the screen leads.
      mm.add("(width < 48rem)", () => {
        q<HTMLElement>("[data-side]").forEach((el) => {
          ScrollTrigger.create({
            trigger: el,
            start: "top 60%",
            end: "bottom 40%",
            onToggle: (self) =>
              self.isActive && setScrolled(el.dataset.side as Exclude<ExplainerFocus, null>),
          });
        });
        return () => setScrolled(null);
      });

      // The two links from the building out to each answer draw as the section arrives.
      mm.add("(width >= 80rem) and (prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          q("[data-link]"),
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.9,
            ease: "power2.inOut",
            stagger: 0.15,
            scrollTrigger: { trigger: root.current, start: "top 60%", once: true },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section className="px-3 sm:px-4">
      <div
        ref={root}
        data-scale-in
        className="explainer-scene relative overflow-clip rounded-[2rem] nav:rounded-[2.5rem]"
      >
        <span
          aria-hidden="true"
          className="blueprint-grid blueprint-grid-gold pointer-events-none absolute inset-0"
        />

        <div className="container-site relative py-16 nav:py-24">
          <div data-reveal className="max-w-[44rem]">
            <h2 className="font-serif text-[1.75rem]/[1.15] font-medium min-[22.5rem]:text-[2rem] text-balance text-white sm:text-[2.5rem] nav:text-3xl">
              {explainer.title}
            </h2>
            <p className="mt-4 max-w-[56ch] text-ink-soft">{explainer.intro}</p>
          </div>

          <div className="mt-10 grid grid-cols-[minmax(0,1fr)] items-center gap-5 md:grid-cols-2 md:items-stretch nav:mt-14 nav:gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,23rem)_minmax(0,1fr)] xl:items-center">
            {/* Sticky on phones, so the model is in view as each answer scrolls past; from tablets
                up both answers sit side by side under it (and beside it from 1280px). */}
            <div className="sticky top-0 z-10 -mx-5 bg-[linear-gradient(to_bottom,var(--surface-raised)_82%,transparent)] px-5 pt-8 md:static md:col-span-2 md:mx-0 md:bg-none md:px-0 md:pt-0 xl:order-2 xl:col-span-1">
              <ExplainerModel focus={focus} />
            </div>

            {explainer.columns.map((column, i) => {
              const side = sides[i];
              const lit = focus === side.focus;
              return (
                <article
                  key={column.title}
                  data-reveal
                  data-side={side.focus}
                  data-lit={lit ? "" : undefined}
                  onPointerEnter={() => setHovered(side.focus)}
                  onPointerLeave={() => setHovered(null)}
                  className={`group relative rounded-3xl border border-line-gold-soft bg-navy-deep/45 p-6 backdrop-blur-sm transition-colors duration-500 data-[lit]:border-gold data-[lit]:bg-navy-deep/70 sm:p-7 ${
                    i === 0 ? "xl:order-1" : "xl:order-3"
                  }`}
                >
                  {/* The link back to the building, on the side that faces it. */}
                  <span
                    aria-hidden="true"
                    data-link
                    className={`absolute top-1/2 hidden h-px w-8 bg-gold/60 xl:block ${
                      i === 0 ? "-end-8 origin-left" : "-start-8 origin-right"
                    }`}
                  />

                  <div className="flex items-center gap-3">
                    <span className="flex size-11 items-center justify-center rounded-xl border border-line-gold-soft text-gold transition-colors duration-500 group-data-[lit]:bg-gold group-data-[lit]:text-navy-deep">
                      <DepartmentIcon id={side.icon} className="size-6" />
                    </span>
                    <h3 className="font-serif text-[1.375rem]/[1.25] font-medium text-white sm:text-xl">
                      {column.title}
                    </h3>
                  </div>

                  <p className="mt-4 text-ink-soft">{column.summary}</p>

                  <div className="mt-5 rounded-2xl border border-line-gold-soft bg-navy-deep/60 px-4 py-3.5">
                    <p className="flex items-center gap-2 text-xs text-gold">
                      <DepartmentIcon id="leak" className="size-3.5" />
                      In the leak
                    </p>
                    <p className="mt-1.5 font-serif text-base/[1.5] italic text-white sm:text-lg/[1.5]">
                      {column.example}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>

          <p
            data-reveal
            className="mt-12 flex items-center gap-4 border-t border-line-gold-soft pt-8 font-serif text-[1.375rem]/[1.3] font-medium text-white sm:text-xl nav:mt-14"
          >
            <span aria-hidden="true" className="h-px w-10 shrink-0 bg-gold" />
            {explainer.closing}
          </p>
        </div>
      </div>
    </section>
  );
}
