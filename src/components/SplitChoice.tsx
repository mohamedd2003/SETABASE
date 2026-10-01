import Link from "next/link";
import { Eyebrow } from "@/components/Eyebrow";
import { Wordmark } from "@/components/Logo";

type Half = {
  eyebrow: string;
  title: string;
  copy: string;
  href: "/private" | "/business";
  tone: "light" | "dark";
};

const halves: [Half, Half] = [
  {
    eyebrow: "For yourself",
    title: "Private",
    copy: "Owner, tenant, buyer, or moving to Egypt on your own.",
    href: "/private",
    tone: "light",
  },
  {
    eyebrow: "For your business",
    title: "Business",
    copy: "HOAs, developers, and employers — from local firms to multinationals — relocating staff or managing a workplace.",
    href: "/business",
    tone: "dark",
  },
];

/**
 * Landing choice screen: a pale half and a navy half, each a full-bleed link.
 * On hover the half shifts one step darker; on the navy half the title fills with the gold gradient.
 */
export function SplitChoice() {
  return (
    <main className="flex min-h-dvh flex-col split:flex-row">
      {halves.map((half) => {
        const light = half.tone === "light";
        return (
          <Link
            key={half.href}
            href={half.href}
            aria-label={`${half.title} — ${half.copy}`}
            className={[
              "group flex flex-1 flex-col items-center justify-center gap-5 px-6 py-16 text-center transition-colors duration-200 focus-visible:outline-offset-[-4px]",
              light
                ? "bg-pale hover:bg-[color-mix(in_srgb,var(--pale)_92%,var(--navy))] focus-visible:bg-[color-mix(in_srgb,var(--pale)_92%,var(--navy))]"
                : "bg-navy hover:bg-navy-deep focus-visible:bg-navy-deep",
            ].join(" ")}
          >
            <Wordmark size="sm" onLight={light} />
            <Eyebrow onLight={light} className="mt-3">
              {half.eyebrow}
            </Eyebrow>
            <h2
              className={[
                "font-serif text-3xl font-medium transition-colors duration-200",
                light
                  ? "text-navy-deep"
                  : "text-white [background-image:var(--gold-gradient)] bg-clip-text group-hover:text-transparent group-focus-visible:text-transparent",
              ].join(" ")}
            >
              {half.title}
            </h2>
            <p className={["max-w-[36ch]", light ? "text-ink-cream-soft" : "text-ink-soft"].join(" ")}>
              {half.copy}
            </p>
          </Link>
        );
      })}
    </main>
  );
}
