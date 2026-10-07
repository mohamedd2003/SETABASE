"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { DepartmentIcon } from "@/components/DepartmentIcon";
import { ServiceDetail } from "@/components/ServiceDetail";
import { Box } from "@/components/SiteModel";
import { site } from "@/content/site";
import type { Department } from "@/content/types";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** One floor per department, stacked on a small plate; the roof belongs to the closing card. */
const PLATE = 220;
const FLOOR = { inset: 30, size: 160, height: 44, gap: 6, base: 10 };

type ServicesElevatorProps = {
  departments: Department[];
};

/**
 * The services as floors of one building. The building stays in view while the services
 * scroll past; whichever is in the middle of the screen slides its floor out and lights
 * it, and the building turns as you go. The closing card is the roof. Every service keeps
 * its own id, so the hero's jump links land on the right floor.
 */
export function ServicesElevator({ departments }: ServicesElevatorProps) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(-1);
  const roof = departments.length;
  const roofZ = FLOOR.base + roof * (FLOOR.height + FLOOR.gap);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const floors = q<HTMLElement>("[data-floor]");

      // Which floor is lit follows the scroll either way; only the motion is optional.
      floors.forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => self.isActive && setActive(i),
          onLeaveBack: () => i === 0 && setActive(-1),
        });
      });

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        root.current!.dataset.motion = "";

        // The building rises floor by floor when the section arrives…
        gsap.fromTo(
          q(".tower-rise"),
          { "--rise": 0 },
          {
            "--rise": 1,
            duration: 1.1,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
          },
        );

        // …and turns slowly as the services scroll past.
        gsap.fromTo(
          q(".tower-table"),
          { "--turn": -58 },
          {
            "--turn": -16,
            ease: "none",
            scrollTrigger: {
              trigger: q("[data-floor-list]")[0],
              start: "top 60%",
              end: "bottom 40%",
              scrub: 1,
            },
          },
        );

        // Each service's rail fills as it is read.
        floors.forEach((el) => {
          gsap.fromTo(
            el.querySelector("[data-rail]"),
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top 65%", end: "bottom 45%", scrub: true },
            },
          );
        });

        return () => delete root.current?.dataset.motion;
      });
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className="relative grid grid-cols-[minmax(0,1fr)] nav:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] nav:gap-12"
    >
      {/* The building. Sticky on every size: a compact strip on phones, a column on desktop. */}
      <div className="sticky top-0 z-10 -mx-5 bg-[linear-gradient(to_bottom,var(--navy)_88%,transparent)] pb-4 px-5 md:-mx-8 md:px-8 nav:top-20 nav:mx-0 nav:h-fit nav:self-start nav:bg-none nav:px-0">
        <div aria-hidden="true" className="tower-stage">
          <div className="tower-table">
            <Box x={0} y={0} w={PLATE} d={PLATE} h={FLOOR.base} className="model-plate" />
            {departments.map((department, i) => (
              <Box
                key={department.id}
                x={FLOOR.inset}
                y={FLOOR.inset}
                w={FLOOR.size}
                d={FLOOR.size}
                h={FLOOR.height}
                z={FLOOR.base + i * (FLOOR.height + FLOOR.gap)}
                className={`tower-rise tower-floor model-glazed${active === i ? " is-lit" : ""}`}
                front={<DepartmentIcon id={department.id} className="tower-icon" />}
              />
            ))}
            <Box
              x={FLOOR.inset - 8}
              y={FLOOR.inset - 8}
              w={FLOOR.size + 16}
              d={FLOOR.size + 16}
              h={5}
              z={roofZ}
              className={`tower-rise tower-floor model-slab${active === roof ? " is-lit" : ""}`}
            />
            <Box
              x={FLOOR.inset + 50}
              y={FLOOR.inset + 50}
              w={60}
              d={60}
              h={20}
              z={roofZ + 5}
              className={`tower-rise tower-floor${active === roof ? " is-lit" : ""}`}
            />
          </div>
        </div>
      </div>

      <ul data-floor-list className="relative flex flex-col">
        {departments.map((department, i) => (
          <li
            key={department.id}
            id={department.id}
            data-floor
            data-active={active === i ? "" : undefined}
            className="tile elevator-floor scroll-mt-48 nav:flex nav:min-h-[62svh] nav:scroll-mt-28 nav:items-center"
          >
            <article className="tile-body relative w-full rounded-3xl py-8 ps-7 pe-2 nav:py-10 nav:ps-10">
              <span
                aria-hidden="true"
                className="absolute inset-y-8 start-0 w-px overflow-hidden rounded-full bg-line-gold-soft nav:inset-y-10"
              >
                <span data-rail className="absolute inset-0 origin-top rounded-full bg-gold" />
              </span>

              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-xl border border-line-gold-soft text-gold">
                  <DepartmentIcon id={department.id} className="size-6" />
                </span>
                <span className="text-sm text-gold">{department.eyebrow}</span>
              </div>
              <h3 className="mt-5 font-serif text-[1.625rem]/[1.15] font-medium text-white sm:text-[2rem]">
                {department.title}
              </h3>
              <p className="mt-4 max-w-[46ch] text-ink-soft">{department.description}</p>
              {department.note ? (
                <p className="mt-4 max-w-[40ch] font-serif text-lg/[1.45] italic text-gold">
                  {department.note}
                </p>
              ) : null}
              {department.detail ? <ServiceDetail detail={department.detail} /> : null}
              <div className="mt-7 flex flex-wrap items-center gap-3">
                {department.packagesHref ? (
                  <Link
                    href={department.packagesHref}
                    className="inline-flex items-center rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-navy-deep transition-colors duration-300 hover:bg-[color-mix(in_srgb,var(--gold)_85%,white)]"
                  >
                    See the packages
                  </Link>
                ) : null}
                <a
                  href="#contact"
                  className="inline-flex items-center rounded-full border border-gold px-5 py-2.5 text-sm font-medium text-gold transition-colors duration-300 hover:bg-gold hover:text-navy-deep"
                >
                  Ask about {department.title}
                </a>
              </div>
              <p className="mt-3 text-xs text-ink-soft">{site.reassurance}</p>
            </article>
          </li>
        ))}

        {/* The roof: for anyone who doesn't know which floor they need. */}
        <li
          data-floor
          data-active={active === roof ? "" : undefined}
          className="elevator-floor nav:flex nav:min-h-[50svh] nav:items-center"
        >
          <div className="relative w-full overflow-hidden rounded-3xl border border-line-gold-soft bg-[color-mix(in_srgb,var(--navy-medium)_18%,var(--navy-deep))] p-7 nav:p-10">
            <span
              aria-hidden="true"
              className="blueprint-grid blueprint-grid-gold pointer-events-none absolute inset-0"
            />
            <span data-rail aria-hidden="true" className="hidden" />
            <div className="relative">
              <p className="text-sm text-gold">Not sure where to start?</p>
              <p className="mt-3 max-w-[24ch] font-serif text-[1.625rem]/[1.25] font-medium text-balance text-white sm:text-2xl">
                Describe the situation — we&rsquo;ll route it to the right team.
              </p>
              <a
                href="#contact"
                className="mt-7 inline-flex items-center rounded-full bg-gold px-6 py-3 text-sm font-medium text-navy-deep transition-colors hover:bg-[color-mix(in_srgb,var(--gold)_85%,white)]"
              >
                Talk to our team
              </a>
              <p className="mt-3 text-xs text-ink-soft">{site.reassurance}</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
}
