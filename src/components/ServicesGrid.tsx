import Link from "next/link";
import { cn } from "cn";
import { DepartmentTile } from "@/components/DepartmentTile";
import { Eyebrow } from "@/components/Eyebrow";
import type { AudiencePage } from "@/content/types";

type ServicesGridProps = {
  services: AudiencePage["services"];
};

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as React.CSSProperties;

/** Grid cell: draws its end and bottom lines; the grid wrapper draws the start and top. */
const cell = "border-e border-b border-line-gold-soft";

export function ServicesGrid({ services }: ServicesGridProps) {
  const count = services.departments.length;
  // Cells left empty on the last row of the three-column grid become one closing card.
  const remainder = count % 3;
  const closingSpan = remainder === 0 ? 0 : 3 - remainder;

  return (
    <section id="services" className="container-site scroll-mt-20 py-16 nav:py-24">
      <div className="mb-10 flex flex-col gap-3 nav:flex-row nav:items-baseline nav:justify-between">
        <h2
          data-reveal
          className="font-serif text-[1.75rem]/[1.2] font-medium text-gold-gradient sm:text-2xl"
        >
          {services.title}
        </h2>
        <p data-reveal style={delay(100)} className="text-ink-soft">
          {services.subtitle}
        </p>
      </div>

      <div className="grid border-s border-t border-line-gold-soft nav:grid-cols-3">
        {services.departments.map((department, i) => (
          <div
            key={department.id}
            id={department.id}
            data-reveal
            style={delay((i % 3) * 110)}
            className={cn("tile scroll-mt-24", cell)}
          >
            <DepartmentTile department={department} />
          </div>
        ))}

        {closingSpan > 0 ? (
          <div
            data-reveal
            style={delay(remainder * 110)}
            className={cn(cell, closingSpan === 2 && "nav:col-span-2")}
          >
            <Link
              href="#contact"
              className="group relative flex h-full flex-col justify-between gap-8 overflow-hidden bg-[color-mix(in_srgb,var(--navy-medium)_18%,var(--navy-deep))] p-7 focus-visible:outline-offset-[-2px] nav:p-8"
            >
              <span
                aria-hidden="true"
                className="blueprint-grid blueprint-grid-gold pointer-events-none absolute inset-0 opacity-70 transition-opacity duration-500 group-hover:opacity-100"
              />
              <span className="relative flex flex-col gap-3">
                <Eyebrow>Not sure where to start?</Eyebrow>
                <span className="max-w-[24ch] font-serif text-[1.375rem]/[1.3] font-medium text-balance text-white sm:text-xl">
                  Describe the situation — we&rsquo;ll route it to the right team.
                </span>
              </span>
              <span className="relative inline-flex items-center gap-2 self-start rounded-full border border-gold px-5 py-2.5 text-xs font-medium tracking-[0.03em] text-gold uppercase transition-colors duration-300 group-hover:bg-gold group-hover:text-navy-deep">
                Talk to our team
              </span>
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
