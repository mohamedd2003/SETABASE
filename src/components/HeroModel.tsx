"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Box } from "@/components/SiteModel";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** The settled view; the arrival starts flatter and turned further. */
const TILT = 56;
const TURN = -36;

/** A villa on its plot: ground floor, a setback upper floor, an overhanging roof, an annex. */
function Villa() {
  return (
    <>
      <div className="model-plan">
        <span className="model-plot" style={{ inset: "84px 30px 26px 34px" }} />
        <span className="model-pool" style={{ left: 70, top: 262, width: 150, height: 34 }} />
      </div>
      <Box
        x={60}
        y={110}
        w={220}
        d={140}
        h={62}
        className="hero-part"
        explode={{ z: 40 }}
        front={<span className="model-glass model-glass-wide" />}
      />
      <Box
        x={92}
        y={124}
        w={150}
        d={104}
        h={50}
        z={62}
        className="hero-part"
        explode={{ x: -24, z: 140 }}
        front={<span className="model-glass model-glass-band" />}
      />
      <Box
        x={76}
        y={114}
        w={186}
        d={128}
        h={7}
        z={112}
        className="hero-part model-slab"
        explode={{ x: -40, y: -20, z: 250 }}
      />
      <Box
        x={290}
        y={150}
        w={86}
        d={90}
        h={38}
        className="hero-part"
        explode={{ x: 90, y: 10, z: 90 }}
        front={<span className="model-glass model-glass-band" />}
      />
      <Box
        x={36}
        y={96}
        w={14}
        d={14}
        h={30}
        className="hero-part model-tree"
        explode={{ x: -50, z: 60 }}
      />
      <Box
        x={366}
        y={262}
        w={14}
        d={14}
        h={36}
        className="hero-part model-tree"
        explode={{ x: 60, z: 70 }}
      />
    </>
  );
}

/** An office cluster: a podium carrying three towers of different heights. */
function Towers() {
  return (
    <>
      <div className="model-plan">
        <span className="model-plot" style={{ inset: "30px 26px 26px 30px" }} />
      </div>
      <Box x={50} y={44} w={320} d={220} h={26} className="hero-part" explode={{ z: 30 }} />
      <Box
        x={70}
        y={58}
        w={118}
        d={118}
        h={250}
        z={26}
        className="hero-part model-glazed"
        explode={{ x: -50, y: -20, z: 170 }}
      />
      <Box
        x={204}
        y={104}
        w={86}
        d={112}
        h={168}
        z={26}
        className="hero-part model-glazed"
        explode={{ x: 30, y: 30, z: 120 }}
      />
      <Box
        x={300}
        y={150}
        w={52}
        d={90}
        h={98}
        z={26}
        className="hero-part model-glazed"
        explode={{ x: 90, y: 20, z: 80 }}
      />
      <Box
        x={384}
        y={60}
        w={14}
        d={14}
        h={30}
        className="hero-part model-tree"
        explode={{ x: 60, z: 60 }}
      />
    </>
  );
}

/**
 * The hero's model. It arrives in pieces and flies together while the headline builds —
 * everything in one place — then comes apart again as the hero scrolls away, and leans
 * a little towards the pointer.
 */
export function HeroModel({ art }: { art: "villa" | "towers" }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const stage = root.current!;
      const table = stage.querySelector<HTMLElement>(".hero-table")!;
      const parts = stage.querySelectorAll<HTMLElement>(".hero-part");
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(table, { "--tilt": TILT, "--turn": TURN });
        gsap.set(parts, { "--explode": 0 });
        stage.dataset.ready = "";
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(table, { "--tilt": 34, "--turn": -78 });
        gsap.set(parts, { "--explode": 1 });
        stage.dataset.ready = "";

        gsap
          .timeline({ delay: 0.15 })
          .fromTo(stage, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: "power1.out" })
          .to(table, { "--tilt": TILT, "--turn": TURN, duration: 2.4, ease: "power3.inOut" }, 0)
          // Top pieces land last, like a building being stacked.
          .to(parts, { "--explode": 0, duration: 1.7, ease: "power3.inOut", stagger: 0.09 }, 0.25);

        // Taken apart again, and turned, as the hero leaves the screen.
        gsap.to(table, {
          "--scatter": 0.7,
          "--turn-s": 30,
          ease: "none",
          scrollTrigger: {
            trigger: stage.closest("section") ?? stage,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });

        if (window.matchMedia("(hover: hover)").matches) {
          const turnTo = gsap.quickTo(table, "--turn-o", { duration: 0.9, ease: "power3.out" });
          const tiltTo = gsap.quickTo(table, "--tilt-o", { duration: 0.9, ease: "power3.out" });
          const onMove = (e: PointerEvent) => {
            turnTo((e.clientX / window.innerWidth - 0.5) * 16);
            tiltTo((e.clientY / window.innerHeight - 0.5) * -8);
          };
          window.addEventListener("pointermove", onMove);
          return () => window.removeEventListener("pointermove", onMove);
        }
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} aria-hidden="true" className="hero-stage">
      <div className="hero-table">
        <Box x={0} y={0} w={420} d={320} h={12} className="model-plate" />
        <div className="model-site hero-site">{art === "villa" ? <Villa /> : <Towers />}</div>
      </div>
    </div>
  );
}
