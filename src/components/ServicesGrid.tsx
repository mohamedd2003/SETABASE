import { cn } from "cn";
import { DepartmentTile } from "@/components/DepartmentTile";
import { Eyebrow } from "@/components/Eyebrow";
import type { AudiencePage } from "@/content/types";

type ServicesGridProps = {
  services: AudiencePage["services"];
};

export function ServicesGrid({ services }: ServicesGridProps) {
  const count = services.departments.length;
  // The closing card fills whatever the last row leaves empty, in both the
  // two-column (sm) and three-column (nav) grids. Static class names for Tailwind.
  const smSpan = count % 2 === 0 ? "sm:col-span-2" : "sm:col-span-1";
  const navSpan = { 0: "nav:col-span-3", 1: "nav:col-span-2", 2: "nav:col-span-1" }[count % 3];

  return (
    <section id="services" className="container-site scroll-mt-24 py-16 nav:py-24">
      <div className="mb-10 flex flex-col gap-3 nav:flex-row nav:items-baseline nav:justify-between">
        <h2
          data-reveal
          className="font-serif text-[1.75rem]/[1.2] font-medium text-gold-gradient sm:text-2xl"
        >
          {services.title}
        </h2>
        <p data-reveal className="text-ink-soft">
          {services.subtitle}
        </p>
      </div>

      {/* Separate rounded cards with a small gap — shared cell borders can't round their corners. */}
      <div className="grid gap-3 sm:grid-cols-2 nav:grid-cols-3 nav:gap-4">
        {services.departments.map((department) => (
          <div key={department.id} id={department.id} data-reveal className="tile scroll-mt-24">
            <DepartmentTile department={department} />
          </div>
        ))}

        <div data-reveal className={cn(smSpan, navSpan)}>
          <a
            href="#contact"
            className="group relative flex h-full flex-col justify-between gap-8 overflow-hidden rounded-3xl border border-line-gold-soft bg-[color-mix(in_srgb,var(--navy-medium)_18%,var(--navy-deep))] p-7 transition-colors duration-500 hover:border-line-gold nav:p-8"
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
          </a>
        </div>
      </div>
    </section>
  );
}
