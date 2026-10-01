import Image from "next/image";
import Link from "next/link";
import { cn } from "cn";

/*
 * Logo assets are derived from the master square (src/app/icon.jpeg) and live in /public/logo:
 *   setabase-horizontal.png  800×220  mark + "SETABASE SERVICES" side by side — header, footer
 *   setabase-stacked.png     900×620  mark above the wordmark — landing, social image
 * Both are transparent PNGs of the gold artwork, so they sit on any navy surface.
 * The gold lockup is designed for navy; on a light surface it is shown inside a navy tile
 * until the designer delivers the dedicated light version.
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
  /** On a light background the lockup is placed on a navy tile. */
  onLight?: boolean;
  className?: string;
};

/** Stacked lockup (mark above wordmark) for the landing halves. */
export function LogoStacked({ onLight = false, className }: LogoStackedProps) {
  const image = (
    <Image
      src="/logo/setabase-stacked.png"
      alt={alt}
      width={900}
      height={620}
      priority
      className="h-24 w-auto split:h-28"
    />
  );
  if (!onLight) return <span className={cn("inline-flex", className)}>{image}</span>;
  return (
    <span className={cn("inline-flex rounded-md bg-navy px-6 py-4", className)}>{image}</span>
  );
}
