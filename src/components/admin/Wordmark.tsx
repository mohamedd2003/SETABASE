import { cn } from "cn";

/** SETABASE as text: "SETA" in the surface's ink, "BASE" in the gold foil. */
export function Wordmark({ className, light = true }: { className?: string; light?: boolean }) {
  return (
    <span
      className={cn(
        "font-serif text-xl font-semibold tracking-[0.08em] uppercase",
        light ? "text-white" : "text-navy-deep",
        className,
      )}
    >
      SETA
      <span className="text-gold-gradient">BASE</span>
    </span>
  );
}
