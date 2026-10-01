"use client";

import { useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Box } from "@/components/SiteModel";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export type ExplainerFocus = "property" | "facility" | null;

/** Floor heights, in px: three storeys of 70 with 6px slabs between them. */
const STOREY = 70;
const SLAB = 6;
const level = (i: number) => i * (STOREY + SLAB);

/** Where the leak is: under the slab above the middle apartment. */
const LEAK = { x: 74, y: 70 };
const DROP_FROM = level(2) - SLAB - 8;
const DROP_TO = level(1);

/** A flat layer at a given height inside the building, rising with it. */
const at = (z: number): CSSProperties => ({
  transform: `translateZ(calc(${z + 0.5}px * var(--rise, 1)))`,
});

/**
 * A three-storey block cut open at the front, with a pipe leaking into the middle
 * apartment. Property Management lights the apartment — the owner's unit and its
 * boundary; Facility Management lights the pipe and the leak.
 */
export function ExplainerModel({ focus }: { focus: ExplainerFocus }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const start = { trigger: root.current, start: "top 80%" };

        gsap.fromTo(
          ".explainer-building",
          { "--rise": 0 },
          {
            "--rise": 1,
            duration: 1.3,
            ease: "power3.out",
            scrollTrigger: { ...start, once: true },
          },
        );
        gsap.fromTo(
          ".explainer-table",
          { "--turn": -50 },
          {
            "--turn": -24,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          },
        );

        // The leak: a drop falls, lands, and ripples out across the floor. On repeat.
        gsap
          .timeline({ repeat: -1, repeatDelay: 1.4, delay: 1.2, scrollTrigger: start })
          .fromTo(
            ".explainer-drop",
            { "--z": `${DROP_FROM}px` },
            { "--z": `${DROP_TO}px`, duration: 0.75, ease: "power2.in" },
          )
          .fromTo(
            ".explainer-drop .model-face",
            { opacity: 1 },
            { opacity: 0, duration: 0.12 },
            ">-0.05",
          )
          .fromTo(
            ".explainer-ripple",
            { scale: 0.2, opacity: 0.9 },
            { scale: 1.8, opacity: 0, duration: 1.1, ease: "power2.out", stagger: 0.18 },
            "<",
          );
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} aria-hidden="true" className="explainer-stage" data-focus={focus ?? undefined}>
      <div className="explainer-table">
        <Box x={0} y={0} w={300} d={230} h={8} className="model-plate" />

        <div className="model-site explainer-site">
          <div className="model-building explainer-building">
            {/* The street-side plot line. */}
            <div className="model-plan">
              <span className="model-plot" style={{ inset: "26px 22px 22px 26px" }} />
            </div>

            {[0, 1, 2].map((i) => (
              <Box
                key={`floor-${i}`}
                x={40}
                y={40}
                w={220}
                d={150}
                h={STOREY}
                z={level(i)}
                className={`explainer-room${i === 1 ? " explainer-unit" : ""}`}
              />
            ))}
            {[1, 2, 3].map((i) => (
              <Box
                key={`slab-${i}`}
                x={36}
                y={36}
                w={228}
                d={158}
                h={SLAB}
                z={level(i) - SLAB}
                className="model-slab"
              />
            ))}

            {/* The owner's apartment: its boundary drawn on the floor. */}
            <div className="model-plan" style={at(DROP_TO)}>
              <span
                className="model-plot explainer-boundary"
                style={{ inset: "48px 46px 46px 48px" }}
              />
              <span className="explainer-ripple" style={{ left: LEAK.x, top: LEAK.y + 4 }} />
              <span className="explainer-ripple" style={{ left: LEAK.x, top: LEAK.y + 4 }} />
            </div>

            {/* The pipe runs up through the slab; the leak comes from its joint. */}
            <Box
              x={LEAK.x - 2}
              y={LEAK.y - 14}
              w={12}
              d={12}
              h={STOREY + 30}
              z={level(1) + 30}
              className="explainer-pipe"
            />
            <Box x={LEAK.x} y={LEAK.y} w={5} d={5} h={7} z={DROP_FROM} className="explainer-drop" />
          </div>
        </div>
      </div>
    </div>
  );
}
