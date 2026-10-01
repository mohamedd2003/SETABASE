"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const EASE = "power3.out";

/**
 * Scroll motion for the audience pages, declared in markup so sections stay server
 * components:
 *
 * - `data-reveal` — rises in the first time it enters; neighbours entering together stagger.
 * - `data-parallax="15"` — drifts down by that many percent of its height while its section
 *   scrolls out, so it moves slower than the page.
 * - `data-scroll-fade` — lifts and fades while its section scrolls out.
 * - `data-scale-in` — grows from slightly smaller to full size as it arrives.
 * - `data-draw` — a line that draws downward once it enters.
 * - `data-autohide` — the header: tucks away on scroll down, returns on scroll up.
 *
 * Content is hidden ahead of the reveal only by CSS behind `(scripting: enabled)` and
 * `(prefers-reduced-motion: no-preference)`; with reduced motion everything is just there.
 */
export function MotionLayer({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(scope);
      const markRevealed = (els: Element[]) =>
        els.forEach((el) => ((el as HTMLElement).dataset.revealed = ""));

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => markRevealed(q("[data-reveal]")));

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Top to bottom, so ScrollTrigger refreshes in page order.
        q("[data-parallax]").forEach((el: HTMLElement) => {
          gsap.to(el, {
            yPercent: Number(el.dataset.parallax) || 15,
            ease: "none",
            scrollTrigger: {
              trigger: el.closest("section") ?? el,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
        });

        q("[data-scroll-fade]").forEach((el: HTMLElement) => {
          gsap.to(el, {
            y: -80,
            opacity: 0,
            ease: "none",
            scrollTrigger: {
              trigger: el.closest("section") ?? el,
              start: "top top",
              end: "bottom 15%",
              scrub: true,
            },
          });
        });

        q("[data-scale-in]").forEach((el: HTMLElement) => {
          gsap.fromTo(
            el,
            { scale: 0.94, transformOrigin: "50% 0%" },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top bottom", end: "top 55%", scrub: 0.6 },
            },
          );
        });

        q("[data-draw]").forEach((el: HTMLElement) => {
          gsap.fromTo(
            el,
            { scaleY: 0, transformOrigin: "50% 0%" },
            {
              scaleY: 1,
              duration: 1.4,
              ease: "power2.inOut",
              scrollTrigger: { trigger: el, start: "top 80%", once: true },
            },
          );
        });

        ScrollTrigger.batch(q("[data-reveal]:not([data-revealed])"), {
          start: "top 88%",
          once: true,
          onEnter: (batch) =>
            gsap.fromTo(
              batch,
              { opacity: 0, y: 32 },
              {
                opacity: 1,
                y: 0,
                duration: 0.9,
                ease: EASE,
                stagger: 0.12,
                overwrite: true,
                onComplete: () => {
                  markRevealed(batch);
                  gsap.set(batch, { clearProps: "opacity,transform" });
                },
              },
            ),
        });

        const header = q("[data-autohide]")[0] as HTMLElement | undefined;
        let removeFocusListener = () => {};
        if (header) {
          const hidden = { value: false };
          const show = (visible: boolean) => {
            if (hidden.value === !visible) return;
            hidden.value = !visible;
            gsap.to(header, { yPercent: visible ? 0 : -130, duration: 0.45, ease: EASE });
          };
          // Never tuck away while the mobile menu is open or focus is inside the header.
          const pinned = () =>
            header.contains(document.activeElement) ||
            header.querySelector('[aria-expanded="true"]') !== null;

          ScrollTrigger.create({
            start: 0,
            end: "max",
            onUpdate: (self) => {
              if (self.scroll() < 240 || self.direction < 0 || pinned()) show(true);
              else show(false);
            },
          });
          const onFocus = () => show(true);
          header.addEventListener("focusin", onFocus);
          removeFocusListener = () => header.removeEventListener("focusin", onFocus);
        }

        // Web fonts shift line breaks, and with them every trigger below the fold.
        document.fonts?.ready.then(() => ScrollTrigger.refresh());

        return removeFocusListener;
      });
    },
    { scope },
  );

  // `contents` keeps the page's flex layout as if this wrapper weren't there.
  return (
    <div ref={scope} className="contents">
      {children}
    </div>
  );
}
