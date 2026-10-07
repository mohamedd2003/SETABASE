import type { ServiceDetail as ServiceDetailContent } from "@/content/types";

type ServiceDetailProps = {
  detail: ServiceDetailContent;
};

const label = "text-sm text-gold";

/**
 * The deeper layer under a department's description: what the service means, what's
 * included, how it works and what it costs — so a visitor is informed before they are
 * asked to get in touch. Only the parts the department has are shown.
 */
export function ServiceDetail({ detail }: ServiceDetailProps) {
  const { intro, groups, steps, pricing, closing } = detail;

  return (
    <div className="mt-7 grid gap-7 border-t border-line-gold-soft pt-7">
      {intro ? <p className="max-w-[52ch] text-ink-soft">{intro}</p> : null}

      {groups?.length ? (
        <div className={`grid gap-7 ${groups.length > 1 ? "sm:grid-cols-2 sm:gap-6" : ""}`}>
          {groups.map((group) => (
            <section key={group.title}>
              <h4 className="font-serif text-[1.25rem]/[1.25] font-medium text-white">{group.title}</h4>
              {group.lead ? <p className="mt-2 text-sm text-ink-soft">{group.lead}</p> : null}
              <ul className="mt-4 grid gap-2 text-sm text-ink">
                {group.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden="true" className="mt-[0.75em] h-px w-3 shrink-0 bg-gold" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      ) : null}

      {steps?.length ? (
        <section>
          <h4 className={label}>How it works</h4>
          <ol className={`mt-3 grid gap-4 ${steps.length > 3 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
            {steps.map((step, i) => (
              <li key={step.title} className="border-t border-line-gold-soft pt-3">
                <span className="font-serif text-xl/[1.2] text-gold">{i + 1}</span>
                <span className="mt-1 block text-sm font-medium text-white">{step.title}</span>
                <span className="mt-1 block text-xs/[1.5] text-ink-soft">{step.text}</span>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {pricing ? (
        <section>
          <h4 className={label}>What it costs</h4>
          <p className="mt-2 max-w-[52ch] text-sm text-ink-soft">{pricing}</p>
        </section>
      ) : null}

      {closing ? (
        <p className="max-w-[42ch] font-serif text-lg/[1.45] italic text-gold">{closing}</p>
      ) : null}
    </div>
  );
}
