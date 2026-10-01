"use client";

import { useEffect } from "react";

/**
 * Marks every `[data-reveal]` element with `data-revealed` the first time it enters the
 * viewport. The hiding itself lives in CSS behind `(scripting: enabled)` and
 * `(prefers-reduced-motion: no-preference)`, so content is never hidden without a way back.
 * Stagger an element with the `--reveal-delay` custom property.
 */
export function RevealObserver() {
  useEffect(() => {
    const pending = document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed])");

    if (!("IntersectionObserver" in window)) {
      pending.forEach((el) => (el.dataset.revealed = ""));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.revealed = "";
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    pending.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
