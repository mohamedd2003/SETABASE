"use client";

import { useRef, type CSSProperties, type RefObject } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Box } from "@/components/SiteModel";

gsap.registerPlugin(useGSAP);

/**
 * Drops every newly chosen part into place: it starts above the model (`--explode: 1`,
 * using each Box's `explode` offset) and falls to rest. Parts are found by `part-<key>`.
 * Nothing moves on first paint — only in answer to a choice.
 */
function useDropIn(root: RefObject<HTMLDivElement | null>, on: string[]) {
  const previous = useRef<string[] | null>(null);

  useGSAP(
    () => {
      const before = previous.current;
      previous.current = on;
      if (before === null) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const added = on.filter((key) => !before.includes(key));
      added.forEach((key, i) => {
        const parts = root.current?.querySelectorAll(`.part-${key}`);
        if (!parts?.length) return;
        gsap.fromTo(
          parts,
          { "--explode": 1 },
          { "--explode": 0, duration: 0.9, delay: i * 0.08, ease: "power3.out", overwrite: true },
        );
      });
    },
    { scope: root, dependencies: [on.join("|")] },
  );
}

const partClass = (key: string, on: string[], preview: string | null, extra = "") =>
  ["build-part", `part-${key}`, on.includes(key) && "is-on", preview === key && "is-preview", extra]
    .filter(Boolean)
    .join(" ");

type ModelProps = {
  /** Keys of the parts the visitor has chosen. */
  on: string[];
  /** A part being considered (hovered) — outlined, not built. */
  preview?: string | null;
};

/* ------------------------------------------------------------------------- */

const PLATE = 240;
const FLOOR = { x: 44, size: 152, h: 34, gap: 4, base: 22 };

/** Bottom to top: the four fixed packages, then the flexible floor, then the roof terrace. */
export const officeFloors = [
  { key: "essential-delivery", sign: "Essential delivery" },
  { key: "premium-delivery", sign: "Premium delivery" },
  { key: "essential-services", sign: "Essential services" },
  { key: "premium-services", sign: "Premium services" },
  { key: "flexible", sign: "Flexible pack" },
] as const;

/**
 * Special Services: an office building whose floors are the packages. The lobby always
 * stands; each package is a floor, and events are the roof terrace.
 */
export function OfficeBuildModel({ on, preview = null }: ModelProps) {
  const root = useRef<HTMLDivElement>(null);
  useDropIn(root, on);
  const roofZ = FLOOR.base + officeFloors.length * (FLOOR.h + FLOOR.gap);

  return (
    <div ref={root} aria-hidden="true" className="build-stage">
      <div
        className="build-table"
        style={{ width: PLATE, height: PLATE, "--lift": "130px" } as CSSProperties}
      >
        <Box x={0} y={0} w={PLATE} d={PLATE} h={10} className="model-plate" />
        <div className="build-site">
          {/* The lobby: always there, the building everything else is added to. */}
          <Box
            x={FLOOR.x - 6}
            y={FLOOR.x - 6}
            w={FLOOR.size + 12}
            d={FLOOR.size + 12}
            h={FLOOR.base}
            front={<span className="model-glass model-glass-band" />}
          />
          {officeFloors.map((floor, i) => (
            <Box
              key={floor.key}
              x={FLOOR.x}
              y={FLOOR.x}
              w={FLOOR.size}
              d={FLOOR.size}
              h={FLOOR.h}
              z={FLOOR.base + i * (FLOOR.h + FLOOR.gap)}
              explode={{ z: 160 }}
              className={partClass(floor.key, on, preview, "model-glazed")}
              front={<span className="build-sign">{floor.sign}</span>}
            />
          ))}
          {/* Roof terrace: a slab, a pavilion and two planters. */}
          <Box
            x={FLOOR.x - 8}
            y={FLOOR.x - 8}
            w={FLOOR.size + 16}
            d={FLOOR.size + 16}
            h={5}
            z={roofZ}
            explode={{ z: 200 }}
            className={partClass("events", on, preview, "model-slab")}
          />
          <Box
            x={FLOOR.x + 24}
            y={FLOOR.x + 30}
            w={70}
            d={56}
            h={24}
            z={roofZ + 5}
            explode={{ z: 240 }}
            className={partClass("events", on, preview)}
            front={<span className="model-glass model-glass-band" />}
          />
          <Box
            x={FLOOR.x + 116}
            y={FLOOR.x + 104}
            w={14}
            d={14}
            h={18}
            z={roofZ + 5}
            explode={{ z: 260 }}
            className={partClass("events", on, preview, "model-tree")}
          />
          <Box
            x={FLOOR.x + 12}
            y={FLOOR.x + 116}
            w={14}
            d={14}
            h={22}
            z={roofZ + 5}
            explode={{ z: 280 }}
            className={partClass("events", on, preview, "model-tree")}
          />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------- */

/**
 * Corporate Relocation: the employee's new life on one site. The employer's tower always
 * stands; choosing the stages lights the home plot (before moving), sends the container up
 * the road (moving), builds the home (settling in), and adds the extras (options).
 */
export function RelocationBuildModel({ on, preview = null }: ModelProps) {
  const root = useRef<HTMLDivElement>(null);
  useDropIn(root, on);
  const has = (key: string) => on.includes(key) || preview === key;

  return (
    <div ref={root} aria-hidden="true" className="build-stage">
      <div
        className="build-table"
        style={{ width: 400, height: 280, "--lift": "70px" } as CSSProperties}
      >
        <Box x={0} y={0} w={400} d={280} h={10} className="model-plate" />
        <div className="build-site">
          <div className="model-plan">
            {/* The road in from the airport, and the home plot beside it. */}
            <span className="model-road" style={{ left: 196, width: 22 }} />
            <span
              className={`build-route${has("moving") ? " is-on" : ""}`}
              style={{ left: 24, top: 250, width: 172 }}
            />
            <span
              className={`build-plot${has("before-moving") ? " is-on" : ""}`}
              style={{ left: 22, top: 26, width: 160, height: 150 }}
            />
            <span
              className="model-pool"
              style={{ left: 40, top: 140, width: 80, height: 24 }}
            />
          </div>

          {/* The employer's office: context, always built. */}
          <Box x={248} y={40} w={110} d={110} h={170} className="model-glazed" />
          <Box x={262} y={164} w={84} d={60} h={70} className="model-glazed" />

          {/* Before moving: a pin on the chosen plot. */}
          <Box
            x={160}
            y={34}
            w={8}
            d={8}
            h={64}
            explode={{ z: 140 }}
            className={partClass("before-moving", on, preview)}
          />
          <Box
            x={152}
            y={26}
            w={24}
            d={24}
            h={14}
            z={64}
            explode={{ z: 160 }}
            className={partClass("before-moving", on, preview)}
          />

          {/* Moving: the container and two crates on the road in. */}
          <Box
            x={60}
            y={218}
            w={96}
            d={34}
            h={34}
            explode={{ x: -120, z: 60 }}
            className={partClass("moving", on, preview, "model-glazed")}
          />
          <Box
            x={168}
            y={228}
            w={20}
            d={20}
            h={18}
            explode={{ x: -140, z: 80 }}
            className={partClass("moving", on, preview)}
          />

          {/* Settling in: the home itself, on its plot. */}
          <Box
            x={36}
            y={40}
            w={110}
            d={84}
            h={42}
            explode={{ z: 120 }}
            className={partClass("final-step", on, preview)}
            front={<span className="model-glass model-glass-wide" />}
          />
          <Box
            x={52}
            y={50}
            w={72}
            d={60}
            h={32}
            z={42}
            explode={{ z: 180 }}
            className={partClass("final-step", on, preview)}
            front={<span className="model-glass model-glass-band" />}
          />

          {/* Options: the car in the drive and the garden. */}
          <Box
            x={150}
            y={140}
            w={34}
            d={18}
            h={12}
            explode={{ x: 60, z: 70 }}
            className={partClass("options", on, preview)}
          />
          <Box
            x={132}
            y={110}
            w={14}
            d={14}
            h={30}
            explode={{ z: 90 }}
            className={partClass("options", on, preview, "model-tree")}
          />
          <Box
            x={28}
            y={168}
            w={14}
            d={14}
            h={24}
            explode={{ z: 110 }}
            className={partClass("options", on, preview, "model-tree")}
          />
        </div>
      </div>
    </div>
  );
}
