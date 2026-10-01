import { ServicesElevator } from "@/components/ServicesElevator";
import type { AudiencePage } from "@/content/types";

type ServicesGridProps = {
  services: AudiencePage["services"];
};

export function ServicesGrid({ services }: ServicesGridProps) {
  return (
    <section id="services" className="container-site scroll-mt-24 py-16 nav:py-24">
      <div className="mb-4 flex flex-col gap-3 nav:mb-0 nav:flex-row nav:items-baseline nav:justify-between">
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

      <ServicesElevator departments={services.departments} />
    </section>
  );
}
