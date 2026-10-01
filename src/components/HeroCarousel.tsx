"use client";

import {
  createContext,
  use,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import Image from "next/image";
import { PauseIcon, PlayIcon } from "lucide-react";
import type { AudiencePage } from "@/content/types";

type Photo = NonNullable<AudiencePage["hero"]["photos"]>[number];

/** How long each photo holds, in ms. Keep in step with `.slide-progress` in globals.css. */
const HOLD = 7000;

type CarouselState = {
  photos: Photo[];
  index: number;
  show: (index: number) => void;
  running: boolean;
  paused: boolean;
  togglePaused: () => void;
  setInView: (inView: boolean) => void;
};

const CarouselContext = createContext<CarouselState | null>(null);

function useCarousel() {
  const state = use(CarouselContext);
  if (!state) throw new Error("HeroCarousel parts must sit inside <HeroCarousel>.");
  return state;
}

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const media = window.matchMedia(reducedMotionQuery);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function subscribeVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

/**
 * Holds the slideshow state so the photo layer and its controls can live in different
 * parts of the hero. It only advances while the hero is on screen, the tab is visible,
 * the visitor hasn't paused it and doesn't ask for reduced motion.
 */
export function HeroCarousel({ photos, children }: { photos: Photo[]; children: ReactNode }) {
  const [index, setIndex] = useState(0);
  const [toggled, setToggled] = useState(false);
  const [inView, setInView] = useState(true);

  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(reducedMotionQuery).matches,
    () => false,
  );
  const tabVisible = useSyncExternalStore(
    subscribeVisibility,
    () => document.visibilityState === "visible",
    () => true,
  );

  // Reduced motion starts paused; the button flips whichever default applies.
  const paused = toggled !== reducedMotion;
  const running = !paused && inView && tabVisible && photos.length > 1;

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => setIndex((i) => (i + 1) % photos.length), HOLD);
    return () => window.clearTimeout(timer);
  }, [running, index, photos.length]);

  return (
    <CarouselContext
      value={{
        photos,
        index,
        show: setIndex,
        running,
        paused,
        togglePaused: () => setToggled((t) => !t),
        setInView,
      }}
    >
      {children}
    </CarouselContext>
  );
}

/** The photo layer: every photo stacked full-bleed, the current one faded in. */
export function HeroCarouselSlides() {
  const { photos, index, setInView } = useCarousel();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, [setInView]);

  return (
    <div ref={ref} className="hero-photo absolute inset-0">
      {photos.map((photo, i) => (
        <div
          key={photo.source}
          aria-hidden={i !== index}
          data-active={i === index ? "" : undefined}
          className="hero-slide absolute inset-0"
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            preload={i === 0}
            loading={i === 0 ? undefined : "eager"}
            placeholder="blur"
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: photo.position }}
          />
        </div>
      ))}
    </div>
  );
}

/** Pause/play plus one progress bar per photo, each of which jumps to its photo. */
export function HeroCarouselControls() {
  const { photos, index, show, running, paused, togglePaused } = useCarousel();
  if (photos.length < 2) return null;

  return (
    <div role="group" aria-label="Background photos" className="flex items-center">
      <button
        type="button"
        onClick={togglePaused}
        aria-label={paused ? "Play background photos" : "Pause background photos"}
        className="flex size-11 items-center justify-center rounded-full text-white/80 transition-colors hover:text-gold"
      >
        {paused ? <PlayIcon className="size-4" /> : <PauseIcon className="size-4" />}
      </button>
      {photos.map((photo, i) => (
        <button
          key={photo.source}
          type="button"
          onClick={() => show(i)}
          aria-label={`Show photo ${i + 1} of ${photos.length}`}
          aria-current={i === index ? "true" : undefined}
          className="group/dot flex h-11 w-9 items-center justify-center"
        >
          <span className="relative h-[3px] w-6 overflow-hidden rounded-full bg-white/30 transition-colors group-hover/dot:bg-white/55">
            {i === index ? (
              <span
                // Restart the fill in step with the timer: on each new photo and on resume.
                key={`${index}-${running}`}
                className="slide-progress absolute inset-0 origin-left rounded-full bg-gold rtl:origin-right"
                data-static={running ? undefined : ""}
              />
            ) : null}
          </span>
        </button>
      ))}
    </div>
  );
}
