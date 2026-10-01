"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Box } from "@/components/SiteModel";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const PLATE = { w: 900, d: 170 };

/** A strip of New Cairo after dark: footprint x, width, depth, height, and its facade. */
const BUILDINGS = [
  { x: 18, w: 70, d: 80, h: 92, kind: "lit" },
  { x: 98, w: 58, d: 70, h: 152, kind: "glazed" },
  { x: 168, w: 92, d: 96, h: 58, kind: "plain" },
  { x: 272, w: 78, d: 88, h: 214, kind: "lit" },
  { x: 362, w: 112, d: 104, h: 118, kind: "glazed" },
  { x: 488, w: 72, d: 80, h: 252, kind: "lit" },
  { x: 572, w: 60, d: 70, h: 168, kind: "glazed" },
  { x: 646, w: 118, d: 92, h: 66, kind: "lit" },
  { x: 776, w: 60, d: 72, h: 134, kind: "glazed" },
  { x: 846, w: 40, d: 52, h: 80, kind: "plain" },
] as const;

const facade = { lit: "footer-lit", glazed: "model-glazed", plain: "" } as const;

/**
 * The footer's skyline. It rises from the middle outwards when the footer arrives, then
 * pans slowly with the scroll, as if walking past.
 */
export function FooterSkyline() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const table = root.current!.querySelector<HTMLElement>(".footer-table")!;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".footer-rise",
          { "--rise": 0 },
          {
            "--rise": 1,
            duration: 1.2,
            ease: "power3.out",
            stagger: { each: 0.07, from: "center" },
            scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
          },
        );
        gsap.fromTo(
          table,
          { "--turn": -14 },
          {
            "--turn": 6,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top bottom",
              end: "bottom bottom",
              scrub: 1,
            },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} aria-hidden="true" className="footer-stage">
      <div className="footer-table">
        <Box x={0} y={0} w={PLATE.w} d={PLATE.d} h={10} className="model-plate" />
        <div className="model-site footer-site">
          {BUILDINGS.map((b) => (
            <Box
              key={b.x}
              x={b.x}
              y={(PLATE.d - b.d) / 2}
              w={b.w}
              d={b.d}
              h={b.h}
              className={`footer-rise ${facade[b.kind]}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
