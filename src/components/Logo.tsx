import Link from "next/link";
import { cn } from "cn";

type WordmarkProps = {
  size?: "sm" | "md" | "lg";
  /** On light backgrounds "SETA" is navy instead of white. */
  onLight?: boolean;
  className?: string;
};

const sizes = {
  sm: "text-[1.125rem]",
  md: "text-[1.375rem]",
  lg: "text-[1.75rem]",
};

/**
 * Text wordmark: Newsreader Semibold, uppercase — "SETA" in white (navy on light), "BASE" in the gold gradient.
 * Min. height 32px per the brand guidelines.
 * TODO(logo): swap the inner span for the real SVG logo once the master file is delivered.
 */
export function Wordmark({ size = "md", onLight = false, className }: WordmarkProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-8 items-center font-serif font-semibold uppercase leading-none tracking-[0.12em]",
        sizes[size],
        className,
      )}
    >
      <span className={onLight ? "text-navy-deep" : "text-white"}>Seta</span>
      {/* The metallic gradient reads only on navy; on light backgrounds use solid dark gold. */}
      <span className={onLight ? "text-gold-dark" : "text-gold-gradient"}>base</span>
    </span>
  );
}

/** The wordmark as a link back to the landing page. */
export function Logo({ size = "md", onLight, className }: WordmarkProps) {
  return (
    <Link href="/" aria-label="SETABASE — home" className={cn("inline-flex", className)}>
      <Wordmark size={size} onLight={onLight} />
    </Link>
  );
}
