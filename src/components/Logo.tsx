import Image from "next/image";
import Link from "next/link";
import { cn } from "cn";

/*
 * Logo assets are derived from the master square (src/app/icon.jpeg) and live in /public/logo:
 *   setabase-horizontal.png  800×220  mark + "SETABASE SERVICES" side by side — header, footer
 *   setabase-stacked.png     900×620  mark above the wordmark — landing (navy half), social image
 *   setabase-stacked-light.png 900×620  same geometry, wordmark in navy-deep — landing (light half)
 * All are transparent PNGs. The light variant is derived from the master; replace it with the
 * designer's official light-background file when it arrives (same path, same canvas).
 */

const alt = "SETABASE Services";

type LogoProps = {
  size?: "sm" | "md";
  className?: string;
};

const horizontalHeights = {
  sm: "h-10", // 40px — header, footer
  md: "h-12", // 48px
};

/** Horizontal lockup, linked to the landing page. */
export function Logo({ size = "md", className }: LogoProps) {
  return (
    <Link href="/" aria-label="SETABASE — home" className={cn("inline-flex shrink-0", className)}>
      <Image
        src="/logo/setabase-horizontal.png"
        alt={alt}
        width={800}
        height={220}
        priority
        className={cn("w-auto", horizontalHeights[size])}
      />
    </Link>
  );
}

type LogoStackedProps = {
  /** Light backgrounds get the light variant: gold mark, navy wordmark. */
  onLight?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

/** Stacked lockup (mark above wordmark) for the landing halves — transparent PNGs. */
export function LogoStacked({ onLight = false, className, style }: LogoStackedProps) {
  return (
    <span className={cn("inline-flex", className)} style={style}>
      <Image
        src={onLight ? "/logo/setabase-stacked-light.png" : "/logo/setabase-stacked.png"}
        alt={alt}
        width={900}
        height={620}
        priority
        className="h-20 w-auto split:h-28"
      />
    </span>
  );
}
