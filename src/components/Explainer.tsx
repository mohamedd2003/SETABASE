import type { Explainer as ExplainerContent } from "@/content/types";

type ExplainerProps = {
  explainer: ExplainerContent;
};

/** The one light section on the page: a short Property vs Facility explainer on cream. */
export function Explainer({ explainer }: ExplainerProps) {
  return (
    <section className="bg-cream text-ink-cream">
      <div className="container-site py-16 nav:py-20">
        <div className="max-w-[60ch]">
          <h2 className="font-serif text-2xl font-medium text-balance">{explainer.title}</h2>
          <p className="mt-4 text-ink-cream-soft">{explainer.intro}</p>
        </div>

        <div className="mt-10 grid gap-10 nav:grid-cols-2 nav:gap-0">
          {explainer.columns.map((column, index) => (
            <div
              key={column.title}
              className={
                index === 0
                  ? "nav:border-e nav:border-line nav:pe-12"
                  : "border-t border-line pt-10 nav:border-t-0 nav:ps-12 nav:pt-0"
              }
            >
              <h3 className="font-serif text-xl font-medium">{column.title}</h3>
              <p className="mt-3 text-ink-cream-soft">{column.summary}</p>
              <p className="mt-5 border-s-2 border-gold-dark ps-4 font-serif text-lg italic">
                {column.example}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-12 font-serif text-xl font-medium">{explainer.closing}</p>
      </div>
    </section>
  );
}
