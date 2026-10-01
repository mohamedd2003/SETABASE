import { DepartmentTile } from "@/components/DepartmentTile";
import type { AudiencePage } from "@/content/types";

type ServicesGridProps = {
  services: AudiencePage["services"];
};

export function ServicesGrid({ services }: ServicesGridProps) {
  return (
    <section id="services" className="container-site scroll-mt-20 py-16 nav:py-24">
      <div className="mb-10 flex flex-col gap-3 nav:flex-row nav:items-baseline nav:justify-between">
        <h2 className="font-serif text-[1.75rem]/[1.2] font-medium text-gold-gradient sm:text-2xl">
          {services.title}
        </h2>
        <p className="text-ink-soft">{services.subtitle}</p>
      </div>

      {/* Shared-border grid: the wrapper draws the start and top lines, each tile draws its end and bottom. */}
      <div className="grid border-s border-t border-line-gold-soft nav:grid-cols-3">
        {services.departments.map((department) => (
          <DepartmentTile key={department.id} department={department} />
        ))}
      </div>
    </section>
  );
}
