import { DepartmentIcon } from "@/components/DepartmentIcon";
import type { Explainer as ExplainerContent } from "@/content/types";

type ExplainerProps = {
  explainer: ExplainerContent;
};

const icons = ["property-management", "facility-management"] as const;

/**
 * The one light section on the page: Property vs Facility Management on cream.
 * The leak example sits between the two columns — the case both teams answer to.
 */
export function Explainer({ explainer }: ExplainerProps) {
  const [left, right] = explainer.columns;

  return (
    // An inset rounded block rather than a full-bleed band, like the photo hero's rounded foot.
    <section className="px-3 sm:px-4">
      <div data-scale-in className="rounded-[2rem] bg-cream text-ink-cream nav:rounded-[2.5rem]">
        <div className="container-site py-16 nav:py-24">
          <div data-reveal className="max-w-[60ch]">
            <h2 className="font-serif text-[1.75rem]/[1.2] font-medium text-balance sm:text-2xl">
              {explainer.title}
            </h2>
            <p className="mt-4 text-ink-cream-soft">{explainer.intro}</p>
          </div>

          <div className="mt-12 grid gap-10 nav:grid-cols-[1fr_auto_1fr] nav:gap-12">
            {[left, right].map((column, i) => (
              <div
                key={column.title}
                data-reveal
                className={
                  i === 1 ? "border-t border-line pt-10 nav:order-3 nav:border-t-0 nav:pt-0" : ""
                }
              >
                <DepartmentIcon id={icons[i]} className="mb-4 size-9 text-gold-dark" />
                <h3 className="font-serif text-[1.375rem]/[1.3] font-medium sm:text-xl">
                  {column.title}
                </h3>
                <p className="mt-3 text-ink-cream-soft">{column.summary}</p>
                <p className="mt-5 rounded-2xl border border-line border-s-[3px] border-s-gold-dark bg-white/55 px-5 py-4 font-serif text-base italic sm:text-lg">
                  {column.example}
                </p>
              </div>
            ))}

            {/* The shared case, between the two answers. */}
            <div
              aria-hidden="true"
              data-reveal
              className="hidden flex-col items-center gap-3 nav:order-2 nav:flex"
            >
              <span className="flex size-12 items-center justify-center rounded-full border border-gold-dark/60 bg-white text-gold-dark">
                <DepartmentIcon id="leak" className="size-6" />
              </span>
              <span
                data-draw
                className="w-px flex-1 bg-gradient-to-b from-gold-dark/60 to-transparent"
              />
            </div>
          </div>

          <p
            data-reveal
            className="mt-14 border-t border-line pt-8 font-serif text-[1.375rem]/[1.3] font-medium sm:text-xl"
          >
            {explainer.closing}
          </p>
        </div>
      </div>
    </section>
  );
}
