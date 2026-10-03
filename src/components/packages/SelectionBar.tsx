"use client";

import { useEffect, useState } from "react";

type SelectionBarProps = {
  count: number;
  /** Second line, e.g. the monthly estimate. */
  detail?: string;
};

/**
 * Phones only: once something is chosen, a bar at the foot of the screen keeps the
 * selection in view and leads to the request form. It steps aside when the form is on screen.
 */
export function SelectionBar({ count, detail }: SelectionBarProps) {
  const [formInView, setFormInView] = useState(false);

  useEffect(() => {
    const target = document.getElementById("request");
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => setFormInView(entry.isIntersecting), {
      rootMargin: "0px 0px -30% 0px",
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  if (count === 0 || formInView) return null;

  return (
    <div className="anim-rise fixed inset-x-3 bottom-3 z-30 nav:hidden" style={{ animationDuration: "320ms" }}>
      <div className="flex items-center justify-between gap-4 rounded-full border border-line-gold bg-navy-deep/95 py-2 ps-5 pe-2 shadow-[0_16px_40px_-12px_rgb(3_10_22/0.9)] backdrop-blur-md">
        <p className="min-w-0 text-sm leading-tight">
          <span className="block text-white" aria-live="polite">
            {count} chosen
          </span>
          {detail ? <span className="block truncate text-xs text-ink-soft">{detail}</span> : null}
        </p>
        <a
          href="#request"
          className="inline-flex h-11 shrink-0 items-center rounded-full bg-gold px-5 text-sm font-medium text-navy-deep"
        >
          Continue
        </a>
      </div>
    </div>
  );
}
