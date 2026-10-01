/**
 * Hairline building drawings for the landing halves — a villa elevation for private
 * clients, an office cluster for business. They echo the logo's building mark and its
 * sweeping base line. The parent reveals them with a ground-up wipe (.landing-build),
 * so nothing here depends on SVG path-length maths.
 * Colour comes from `currentColor`; the parent sets opacity.
 */

type ArtProps = {
  className?: string;
};

const outline = {
  stroke: "currentColor",
  fill: "none",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const detail = {
  stroke: "currentColor",
  fill: "none",
  strokeWidth: 1.25,
  strokeLinecap: "round",
} as const;

/** Modern flat-roofed villa with a boundary wall and a palm — the private half. */
export function VillaElevation({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 420 300" className={className} aria-hidden="true" focusable="false">
      <g {...outline}>
        {/* Ground, curved like the swoosh under the logo */}
        <path d="M6 272C118 258 300 256 414 268" />
        {/* Boundary wall and gate */}
        <path d="M28 270v-26h62" />
        {/* Lower volume */}
        <path d="M90 268V166h196v102" />
        {/* Upper setback volume */}
        <path d="M150 166v-58h136v58" />
        {/* Roof slab with overhang */}
        <path d="M136 108h164" />
        {/* Terrace line */}
        <path d="M90 166h60" />
        {/* Entrance */}
        <path d="M110 268v-62h36v62" />
        {/* Palm */}
        <path d="M352 266c-3-28 4-50 0-72" />
        <path d="M352 194c-20-12-36-9-48 4" />
        <path d="M352 194c-16-16-18-31-12-45" />
        <path d="M352 194c16-15 34-16 46-7" />
        <path d="M352 194c6-19 18-31 32-36" />
      </g>
      <g {...detail}>
        {/* Lower windows */}
        <path d="M168 196h44v30h-44z" />
        <path d="M228 196h44v30h-44z" />
        {/* Upper ribbon window */}
        <path d="M168 128h100v26h-100z" />
        <path d="M218 128v26" />
      </g>
    </svg>
  );
}

/** Three office towers of stepped height — the business half. */
export function TowerCluster({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 420 300" className={className} aria-hidden="true" focusable="false">
      <g {...outline}>
        {/* Ground, curved like the swoosh under the logo */}
        <path d="M6 272C118 258 300 256 414 268" />
        {/* Left tower */}
        <path d="M62 268V140h74v128" />
        {/* Centre tower, tallest */}
        <path d="M146 268V54h92v214" />
        {/* Crown */}
        <path d="M160 54h64l-12-18h-40z" />
        <path d="M192 36V12" />
        {/* Right tower */}
        <path d="M248 268V172h86v96" />
        {/* Podium */}
        <path d="M40 268v-30h330v30" />
      </g>
      <g {...detail}>
        {/* Floor lines */}
        <path d="M62 170h74M62 200h74" />
        <path d="M146 92h92M146 130h92M146 168h92M146 206h92" />
        <path d="M248 202h86M248 232h86" />
        {/* Vertical mullions */}
        <path d="M99 140v98" />
        <path d="M192 54v184" />
        <path d="M291 172v66" />
      </g>
    </svg>
  );
}
