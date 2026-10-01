"use client";

import { useRef, useState } from "react";
import Link from "next/link";
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

/**
 * Landing page: a site model of both audiences on one base, and a two-step guide beside
 * it — who we're looking after, then what they need first. On arrival the model unfolds
 * from a flat site plan into 3D while the buildings rise; choosing an audience turns the
 * model to face its building.
 */
export function Onboarding() {
  const root = useRef<HTMLElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const settled = useRef(false);

  const [chosen, setChosen] = useState<AudienceKey | null>(null);
  const [preview, setPreview] = useState<AudienceKey | null>(null);
  // The arrival entrance plays once; coming back to step one uses the step transition.
  const [arrived, setArrived] = useState(false);
  const enter = (ms: number) =>
    arrived ? {} : { className: "anim-rise", style: { animationDelay: `${ms}ms` } };
  const focus = preview ?? chosen;
  const audience = landing.audiences.find((a) => a.key === chosen);

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

  // Turn the model to whatever is chosen or being considered.
  useGSAP(
    () => {
      if (!settled.current) return;
      const view = VIEWS[focus ?? "none"];
      gsap.to(".model-table", {
        "--turn": view.turn,
        "--pan": view.pan,
        duration: reduced() ? 0 : 1.1,
        ease: "power3.inOut",
        overwrite: "auto",
      });
    },
    { scope: root, dependencies: [focus] },
  );

  // Each step's content rises in; focus follows to its heading.
  useGSAP(
    () => {
      // Nothing to transition until a choice has been made (the arrival covers the first
      // view). Explicit end values: the CSS entrance may still hold items at opacity 0.
      if (!arrived) return;
      heading.current?.focus({ preventScroll: true });
      if (reduced()) return;
      gsap.fromTo(
        "[data-step-item]",
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.05, clearProps: "all" },
      );
    },
    { scope: root, dependencies: [chosen] },
  );

  const choose = (key: AudienceKey | null) => {
    setPreview(null);
    setArrived(true);
    setChosen(key);
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
            {/* Returning visitors skip the questions; hovering previews the building. */}
            <div
              role="group"
              aria-label={landing.skipLabel}
              className="flex items-center rounded-full bg-white/[0.05] p-1 ring-1 ring-white/10"
            >
              <span className="hidden px-2.5 text-xs text-ink-soft md:inline">
                {landing.skipLabel}
              </span>
              {landing.audiences.map((a) => (
                <Link
                  key={a.key}
                  href={a.href}
                  onPointerEnter={() => setPreview(a.key)}
                  onPointerLeave={() => setPreview(null)}
                  data-lit={focus === a.key ? "" : undefined}
                  className="rounded-full px-3 py-2.5 text-[0.8125rem] text-ink-soft transition-colors duration-300 hover:bg-gold hover:text-navy-deep data-[lit]:bg-gold/15 data-[lit]:text-gold hover:data-[lit]:bg-gold hover:data-[lit]:text-navy-deep sm:px-4 sm:py-1.5 sm:text-sm"
                >
                  {a.answer}
                </Link>
              ))}
            </div>
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
        <SiteModel focus={focus} onPick={choose} onPreview={setPreview} />

        <section aria-labelledby="guide-title" className="relative max-w-[30rem]">
          <div data-step-item className="anim-rise flex items-center gap-3" style={at(900)}>
            <span className="text-sm text-ink-soft">Step {chosen ? 2 : 1} of 2</span>
            <span aria-hidden="true" className="flex gap-1.5">
              <span className="h-[3px] w-6 rounded-full bg-gold" />
              <span
                className={`h-[3px] w-6 rounded-full transition-colors duration-500 ${chosen ? "bg-gold" : "bg-white/20"}`}
              />
            </span>
          </div>

          {audience ? (
            <>
              <h1
                id="guide-title"
                ref={heading}
                tabIndex={-1}
                data-step-item
                className="mt-3 font-serif text-[1.75rem]/[1.15] font-medium text-white outline-none sm:text-3xl"
              >
                {landing.steps.what.title}
              </h1>
              <p data-step-item className="mt-2.5 text-sm text-ink-soft sm:text-base">
                {audience.servicesIntro}
              </p>

              <ul className="mt-7 grid gap-2 sm:grid-cols-2">
                {audience.services.map((service) => (
                  <li key={service.id} data-step-item>
                    <Link
                      href={`${audience.href}#${service.id}`}
                      className="group flex h-full flex-col rounded-2xl border border-line-gold-soft bg-navy/40 px-4 py-3 transition-colors duration-300 hover:border-gold hover:bg-navy/70"
                    >
                      <span className="text-sm font-medium text-white transition-colors group-hover:text-gold">
                        {service.label}
                      </span>
                      <span className="mt-0.5 text-xs text-ink-soft">{service.audience}</span>
                    </Link>
                  </li>
                ))}
              </ul>

              <div data-step-item className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Link
                  href={audience.href}
                  className="rounded-full bg-gold px-6 py-3 text-sm font-medium text-navy-deep transition-colors hover:bg-[color-mix(in_srgb,var(--gold)_85%,white)]"
                >
                  {audience.allServices}
                </Link>
                <button
                  type="button"
                  onClick={() => choose(null)}
                  className="rounded-full px-2 py-3 text-sm text-ink-soft transition-colors hover:text-white"
                >
                  {landing.back}
                </button>
              </div>
            </>
          ) : (
            <>
              <h1
                id="guide-title"
                ref={heading}
                tabIndex={-1}
                data-step-item
                style={enter(1000).style}
                className={`${enter(1000).className ?? ""} mt-3 font-serif text-[1.75rem]/[1.15] font-medium text-balance text-white outline-none sm:text-[2.25rem] nav:text-4xl`}
              >
                {landing.steps.who.title}
              </h1>
              <p
                data-step-item
                style={enter(1100).style}
                className={`${enter(1100).className ?? ""} mt-2.5 text-sm text-ink-soft sm:text-base`}
              >
                {landing.steps.who.intro}
              </p>

              <div className="mt-6 grid gap-2.5 sm:mt-7 sm:gap-3">
                {landing.audiences.map((a, i) => {
                  const Icon = a.key === "private" ? HouseIcon : Building2Icon;
                  return (
                    <button
                      key={a.key}
                      type="button"
                      data-step-item
                      onClick={() => choose(a.key)}
                      onPointerEnter={() => setPreview(a.key)}
                      onPointerLeave={() => setPreview(null)}
                      onFocus={() => setPreview(a.key)}
                      onBlur={() => setPreview(null)}
                      data-lit={focus === a.key ? "" : undefined}
                      style={enter(1200 + i * 90).style}
                      className={`${enter(1200 + i * 90).className ?? ""} group flex items-center gap-3.5 rounded-2xl border border-line-gold-soft bg-navy/40 p-3.5 text-start sm:gap-4 sm:p-4 transition-colors duration-300 hover:border-gold data-[lit]:border-gold data-[lit]:bg-navy/70`}
                    >
                      <span className="flex size-10 shrink-0 items-center sm:size-11 justify-center rounded-xl border border-line-gold-soft text-gold transition-colors group-data-[lit]:bg-gold group-data-[lit]:text-navy-deep">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <span className="flex flex-col">
                        <span className="font-serif text-lg/[1.2] font-medium text-white sm:text-xl">
                          {a.answer}
                        </span>
                        <span className="mt-0.5 text-xs/[1.45] text-ink-soft sm:mt-1 sm:text-sm">{a.detail}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

/** Load-sequence delay, in ms, for the CSS `anim-rise` entrance. */
function at(ms: number) {
  return { animationDelay: `${ms}ms` };
}
