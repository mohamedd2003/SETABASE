"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Building2Icon, HouseIcon } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { SiteModel } from "@/components/SiteModel";
import { landing, type AudienceKey } from "@/content/landing";
import { site } from "@/content/site";

gsap.registerPlugin(useGSAP);

/** Where the turntable settles for each choice: turn (deg) and sideways pan (px). */
const VIEWS = {
  none: { turn: -34, pan: 0 },
  private: { turn: -18, pan: 70 },
  business: { turn: -50, pan: -70 },
} as const;
const TILT = 56;

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Load-sequence delay, in ms, for the CSS `anim-rise` entrance. */
const at = (ms: number) => ({ animationDelay: `${ms}ms` });

/**
 * Landing page: a site model of both audiences on one base, and the one question beside
 * it — which best describes you? On arrival the model unfolds from a flat site plan into
 * 3D while the buildings rise; considering an answer turns the model to face its building,
 * and choosing one (or clicking its building) goes straight to that audience's page.
 */
export function Onboarding() {
  const root = useRef<HTMLElement>(null);
  const settled = useRef(false);
  const router = useRouter();
  const [preview, setPreview] = useState<AudienceKey | null>(null);

  // Arrival: plan → model. The stage stays hidden by CSS until its start state is set.
  useGSAP(
    () => {
      const table = root.current!.querySelector<HTMLElement>(".model-table")!;
      const stage = root.current!.querySelector<HTMLElement>(".model-stage")!;
      const end = { "--tilt": TILT, "--turn": VIEWS.none.turn, "--pan": 0, "--rise": 1 };

      if (reduced()) {
        gsap.set(table, end);
        stage.dataset.ready = "";
        settled.current = true;
        return;
      }

      gsap.set(table, { "--tilt": 0, "--turn": 0, "--pan": 0 });
      gsap.set(".model-rise", { "--rise": 0 });
      stage.dataset.ready = "";

      gsap
        .timeline({ delay: 0.25, onComplete: () => void (settled.current = true) })
        .fromTo(stage, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power1.out" })
        .to(
          table,
          { "--tilt": TILT, "--turn": VIEWS.none.turn, duration: 2, ease: "power3.inOut" },
          0.2,
        )
        .to(".model-rise", { "--rise": 1, duration: 1.3, ease: "power2.out", stagger: 0.28 }, 1.0);

      // The model leans a little towards the pointer, on devices that have one.
      if (window.matchMedia("(hover: hover)").matches) {
        const turnTo = gsap.quickTo(table, "--turn-o", { duration: 0.8, ease: "power3.out" });
        const tiltTo = gsap.quickTo(table, "--tilt-o", { duration: 0.8, ease: "power3.out" });
        const onMove = (e: PointerEvent) => {
          turnTo((e.clientX / window.innerWidth - 0.5) * 14);
          tiltTo((e.clientY / window.innerHeight - 0.5) * -8);
        };
        window.addEventListener("pointermove", onMove);
        return () => window.removeEventListener("pointermove", onMove);
      }
    },
    { scope: root },
  );

  // Turn the model to whichever answer is being considered.
  useGSAP(
    () => {
      if (!settled.current) return;
      const view = VIEWS[preview ?? "none"];
      gsap.to(".model-table", {
        "--turn": view.turn,
        "--pan": view.pan,
        duration: reduced() ? 0 : 1.1,
        ease: "power3.inOut",
        overwrite: "auto",
      });
    },
    { scope: root, dependencies: [preview] },
  );

  // Clicking a building goes where its answer goes.
  const pick = (key: AudienceKey) => {
    const audience = landing.audiences.find((a) => a.key === key);
    if (audience) router.push(audience.href);
  };

  return (
    <main
      ref={root}
      className="relative isolate flex flex-1 flex-col overflow-hidden bg-navy-deep text-ink"
    >
      {/* Dusk over the site: a sky that warms towards the horizon, faint city lights, and
          a blueprint ground plane running back to the horizon in perspective. */}
      <span aria-hidden="true" className="landing-sky pointer-events-none absolute inset-0">
        <span className="landing-lights" />
        <span className="landing-glow" />
        <span className="landing-floor" />
      </span>

      <header className="container-site relative z-20 pt-3 sm:pt-4">
        <nav
          aria-label="Main"
          className="flex h-14 items-center justify-between gap-2 rounded-full border border-white/10 bg-navy-deep/45 ps-3 pe-1.5 shadow-[0_12px_40px_-16px_rgb(2_8_20/0.9),inset_0_1px_0_rgb(255_255_255/0.06)] backdrop-blur-xl sm:ps-4 sm:pe-2"
        >
          <Logo size="sm" className="py-1.5 sm:py-0 [&_img]:h-8 sm:[&_img]:h-10" />

          <div className="flex items-center gap-2">
            {/* TODO(app): wire to the real app URL in content/site.ts */}
            <Button
              variant="brand"
              size="pill-sm"
              nativeButton={false}
              className="hidden sm:inline-flex"
              render={<Link href={site.appUrl} />}
            >
              Get the app
            </Button>
          </div>
        </nav>
      </header>

      <div className="container-site relative grid flex-1 grid-cols-[minmax(0,1fr)] content-center gap-2 pb-10 nav:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] nav:items-center nav:gap-12 nav:pb-16">
        <SiteModel focus={preview} onPick={pick} onPreview={setPreview} />

        <section aria-labelledby="guide-title" className="relative max-w-[30rem]">
          <h1
            id="guide-title"
            style={at(1000)}
            className="anim-rise font-serif text-[1.75rem]/[1.15] font-medium text-balance text-white sm:text-[2.25rem] nav:text-4xl"
          >
            {landing.title}
          </h1>
          <p style={at(1100)} className="anim-rise mt-2.5 text-sm text-ink-soft sm:text-base">
            {landing.intro}
          </p>

          <ul className="mt-6 grid gap-2.5 sm:mt-7 sm:gap-3">
            {landing.audiences.map((a, i) => {
              const Icon = a.key === "private" ? HouseIcon : Building2Icon;
              return (
                <li key={a.key} style={at(1200 + i * 90)} className="anim-rise">
                  <Link
                    href={a.href}
                    onPointerEnter={() => setPreview(a.key)}
                    onPointerLeave={() => setPreview(null)}
                    onFocus={() => setPreview(a.key)}
                    onBlur={() => setPreview(null)}
                    data-lit={preview === a.key ? "" : undefined}
                    className="group flex items-center gap-3.5 rounded-2xl border border-line-gold-soft bg-navy/40 p-3.5 text-start transition-colors duration-300 hover:border-gold data-[lit]:border-gold data-[lit]:bg-navy/70 sm:gap-4 sm:p-4"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-line-gold-soft text-gold transition-colors group-data-[lit]:bg-gold group-data-[lit]:text-navy-deep sm:size-11">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="flex flex-col">
                      <span className="font-serif text-lg/[1.2] font-medium text-white sm:text-xl">
                        {a.answer}
                      </span>
                      <span className="mt-0.5 text-xs/[1.45] text-ink-soft sm:mt-1 sm:text-sm">
                        {a.detail}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </main>
  );
}
