import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DepartmentIcon } from "@/components/DepartmentIcon";
import type { ServiceId } from "@/content/types";

type PackageHeroProps = {
  service: ServiceId;
  audience: string;
  title: string;
  paragraph: string;
  /** Short plain facts along the foot of the hero. */
  facts: string[];
  cta: string;
};

/** Load-sequence delay, in ms. */
const at = (ms: number) => ({ animationDelay: `${ms}ms` });

/**
 * The package pages' opening: the audience pages' dusk sky, shorter, with the department
 * named and the way back to all services. The model waits below, beside the packages.
 */
export function PackageHero({ service, audience, title, paragraph, facts, cta }: PackageHeroProps) {
  return (
    <section className="relative -mt-[68px] overflow-hidden rounded-b-[2rem] bg-navy-deep nav:rounded-b-[2.5rem]">
      <span aria-hidden="true" className="landing-sky hero-sky pointer-events-none absolute inset-0">
        <span className="landing-lights" />
        <span className="landing-glow" />
        <span className="landing-floor footer-floor" />
      </span>

      <div className="container-site relative pt-[calc(68px+3rem)] pb-10 nav:pt-[calc(68px+5rem)] nav:pb-14">
        <div data-scroll-fade>
          <nav aria-label="Breadcrumb" className="anim-rise text-sm">
            <Link href="/business#services" className="text-ink-soft transition-colors hover:text-gold">
              Business services
            </Link>
          </nav>

          <div className="anim-rise mt-8 flex items-center gap-3" style={at(80)}>
            <span className="flex size-11 items-center justify-center rounded-xl border border-line-gold-soft text-gold">
              <DepartmentIcon id={service} className="size-6" />
            </span>
            <span className="text-sm text-gold">{audience}</span>
          </div>

          <h1
            className="anim-rise mt-5 max-w-[18ch] font-serif text-[2.375rem]/[1.08] font-medium text-balance text-white sm:text-3xl nav:text-[3.5rem]"
            style={at(160)}
          >
            {title}
          </h1>
          <p className="anim-rise mt-6 max-w-[54ch] text-base text-white/80 sm:text-lg" style={at(260)}>
            {paragraph}
          </p>

          <div className="anim-rise mt-8" style={at(340)}>
            <Button variant="brandSolid" size="pill" nativeButton={false} render={<a href="#packages" />}>
              {cta}
            </Button>
          </div>
        </div>

        <ul
          className="anim-rise mt-12 grid gap-x-10 gap-y-4 border-t border-white/15 pt-6 sm:grid-cols-3 nav:mt-16"
          style={at(440)}
        >
          {facts.map((fact) => (
            <li key={fact} className="flex gap-3 text-sm text-white/85">
              <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-gold" />
              {fact}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
