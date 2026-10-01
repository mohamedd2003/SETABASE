import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/Eyebrow";
import type { AudiencePage } from "@/content/types";

type HeroProps = {
  hero: AudiencePage["hero"];
};

export function Hero({ hero }: HeroProps) {
  return (
    <section className="container-site grid gap-12 py-16 nav:grid-cols-12 nav:items-center nav:gap-10 nav:py-24">
      <div className="flex flex-col items-start gap-8 nav:col-span-7">
        <h1 className="max-w-[18ch] font-serif text-3xl font-medium text-balance text-white nav:text-4xl">
          {hero.title}
        </h1>
        <p className="max-w-[52ch] text-lg text-ink-soft">{hero.paragraph}</p>
        <Button variant="brand" size="pill" render={<Link href="#contact" />}>
          {hero.cta}
        </Button>
      </div>

      <div className="border border-line-gold-soft bg-navy-deep p-7 nav:col-span-5 nav:p-8">
        <Eyebrow className="mb-4">{hero.summary.eyebrow}</Eyebrow>
        <ul className="divide-y divide-line-gold-soft">
          {hero.summary.rows.map((row) => (
            <li key={row.label} className="flex items-baseline justify-between gap-6 py-4">
              <span className="font-medium text-ink">{row.label}</span>
              <span className="text-end text-sm text-ink-soft">{row.audience}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
