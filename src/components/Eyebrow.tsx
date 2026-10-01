import { cn } from "cn";

type EyebrowProps = React.ComponentProps<"p"> & {
  /** Use the solid dark-gold version on cream backgrounds. */
  onLight?: boolean;
};

/** Uppercase section label — IBM Plex Sans, 0.03em tracking, gold gradient, never bold. */
export function Eyebrow({ onLight = false, className, ...props }: EyebrowProps) {
  return <p className={cn(onLight ? "eyebrow-on-light" : "eyebrow", className)} {...props} />;
}
