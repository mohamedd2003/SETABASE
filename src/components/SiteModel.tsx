import type { CSSProperties, ReactNode } from "react";
import type { AudienceKey } from "@/content/landing";

type BoxProps = {
  /** Footprint on the plate, in px: position, width (x) and depth (y). */
  x: number;
  y: number;
  w: number;
  d: number;
  /** Height, and the height it stands on. Both grow with the model's `--rise`. */
  h: number;
  z?: number;
  className?: string;
  /** Detail drawn on the street-facing side. */
  front?: ReactNode;
};

/** A solid block: a top and four walls, folded up from its footprint in CSS 3D. */
export function Box({ x, y, w, d, h, z = 0, className, front }: BoxProps) {
  const style = {
    left: x,
    top: y,
    width: w,
    height: d,
    "--h": `${h}px`,
    "--z": `${z}px`,
  } as CSSProperties;

  return (
    <div className={["model-box", className].filter(Boolean).join(" ")} style={style}>
      <div className="model-face model-top" />
      <div className="model-face model-front">{front}</div>
      <div className="model-face model-back" />
      <div className="model-face model-left" />
      <div className="model-face model-right" />
    </div>
  );
}

type BuildingProps = {
  audience: AudienceKey;
  focus: AudienceKey | null;
  onPick: (audience: AudienceKey) => void;
  onPreview: (audience: AudienceKey | null) => void;
  children: ReactNode;
};

function Building({ audience, focus, onPick, onPreview, children }: BuildingProps) {
  return (
    <div
      className="model-building model-rise"
      data-state={focus === null ? undefined : focus === audience ? "lit" : "dim"}
      onClick={() => onPick(audience)}
      onPointerEnter={() => onPreview(audience)}
      onPointerLeave={() => onPreview(null)}
    >
      {children}
    </div>
  );
}

type SiteModelProps = {
  focus: AudienceKey | null;
  onPick: (audience: AudienceKey) => void;
  onPreview: (audience: AudienceKey | null) => void;
};

/**
 * An architect's site model of the two audiences on one base: a villa for private clients
 * and an office cluster for business. Purely visual — the guide beside it carries the same
 * choices for keyboard and screen-reader users, so the model is hidden from them.
 */
export function SiteModel({ focus, onPick, onPreview }: SiteModelProps) {
  return (
    <div aria-hidden="true" className="model-stage">
      <div className="model-table">
        {/* The base plate: a site plan with a road between the two plots. */}
        <Box x={0} y={0} w={520} d={380} h={14} className="model-plate" />

        <div className="model-site">
          <div className="model-plan">
            <span className="model-road" />
            <span className="model-pool" />
            <span className="model-plot model-plot-villa" />
            <span className="model-plot model-plot-tower" />
          </div>

          <Building audience="private" focus={focus} onPick={onPick} onPreview={onPreview}>
            {/* Ground floor, a setback upper floor, and a thin roof slab that overhangs both. */}
            <Box
              x={36}
              y={178}
              w={196}
              d={128}
              h={58}
              front={<span className="model-glass model-glass-wide" />}
            />
            <Box
              x={62}
              y={192}
              w={132}
              d={92}
              h={46}
              z={58}
              front={<span className="model-glass model-glass-band" />}
            />
            <Box x={50} y={184} w={160} d={110} h={6} z={104} className="model-slab" />
            <Box x={238} y={262} w={12} d={12} h={34} className="model-tree" />
            <Box x={20} y={150} w={14} d={14} h={28} className="model-tree" />
          </Building>

          <Building audience="business" focus={focus} onPick={onPick} onPreview={onPreview}>
            {/* A podium with two towers standing on it. */}
            <Box x={292} y={52} w={180} d={190} h={22} />
            <Box x={302} y={64} w={96} d={96} h={236} z={22} className="model-glazed" />
            <Box x={404} y={150} w={58} d={82} h={142} z={22} className="model-glazed" />
            <Box x={470} y={262} w={12} d={12} h={30} className="model-tree" />
          </Building>
        </div>
      </div>
    </div>
  );
}
