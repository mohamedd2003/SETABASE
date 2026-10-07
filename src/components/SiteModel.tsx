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
  /**
   * Where this block flies to when the model is taken apart (`--explode` / `--scatter`
   * above 0), as an offset in px. Unset blocks stay put.
   */
  explode?: { x?: number; y?: number; z?: number };
};

const explodeVars = (explode: BoxProps["explode"]) =>
  explode && {
    "--dx": `${explode.x ?? 0}px`,
    "--dy": `${explode.y ?? 0}px`,
    "--dz": `${explode.z ?? 0}px`,
  };

/** A solid block: a top and four walls, folded up from its footprint in CSS 3D. */
export function Box({ x, y, w, d, h, z = 0, className, front, explode }: BoxProps) {
  const style = {
    left: x,
    top: y,
    width: w,
    height: d,
    "--h": `${h}px`,
    "--z": `${z}px`,
    ...explodeVars(explode),
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

type RoofProps = Omit<BoxProps, "h" | "front"> & {
  /** Height of the ridge above the eaves. The ridge runs along the width. */
  peak: number;
};

/**
 * A pitched roof over a footprint: two slopes up to a ridge along the width, closed by a
 * gable at each end. Sits at `z`, the top of the walls below it, and flattens with the
 * model's `--rise` like every block.
 */
export function Roof({ x, y, w, d, peak, z = 0, className, explode }: RoofProps) {
  const half = d / 2;
  // Rounded: the server and the browser disagree in the last digits of trig results,
  // and any difference in the style string is a hydration mismatch.
  const round = (n: number) => Math.round(n * 1000) / 1000;
  const style = {
    left: x,
    top: y,
    width: w,
    height: d,
    "--h": `${peak}px`,
    "--z": `${z}px`,
    "--slant": `${round(Math.hypot(half, peak))}px`,
    "--pitch": `${round((Math.atan2(peak, half) * 180) / Math.PI)}deg`,
    ...explodeVars(explode),
  } as CSSProperties;

  return (
    <div className={["model-box model-roof", className].filter(Boolean).join(" ")} style={style}>
      <div className="model-roof-pitch">
        <div className="model-face model-roof-back" />
        <div className="model-face model-roof-left" />
        <div className="model-face model-roof-right" />
        <div className="model-face model-roof-front" />
      </div>
    </div>
  );
}

/** A front door with a window either side: the detail that makes a block read as a home. */
export function HouseFront() {
  return (
    <>
      <span className="model-glass" style={{ inset: "28% 64% 32% 16%" }} />
      <span className="model-door" />
      <span className="model-glass" style={{ inset: "28% 16% 32% 64%" }} />
    </>
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
 * An architect's site model of the two audiences on one base: a house for private clients
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
            {/* A home at first glance: walls with a front door and windows under a pitched
                roof with a chimney, and a lower garage wing under a roof of its own. */}
            <Box x={40} y={180} w={140} d={100} h={52} front={<HouseFront />} />
            <Roof x={34} y={174} w={152} d={112} peak={36} z={52} />
            <Box x={156} y={216} w={12} d={12} h={40} z={52} className="model-slab" />
            <Box
              x={180}
              y={206}
              w={52}
              d={72}
              h={30}
              front={<span className="model-glass model-glass-band" />}
            />
            <Roof x={176} y={201} w={60} d={82} peak={16} z={30} />
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
