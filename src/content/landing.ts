import { businessPage } from "./business";
import { privatePage } from "./private";
import type { SummaryRow } from "./types";

export type AudienceKey = "private" | "business";

export type LandingAudience = {
  key: AudienceKey;
  href: "/private" | "/business";
  /** The answer to "Who are we looking after?" */
  answer: string;
  detail: string;
  /** Step two's intro once this audience is chosen. */
  servicesIntro: string;
  allServices: string;
  services: SummaryRow[];
};

/** The landing page's two-step guide: who it's for, then what they need first. */
export const landing = {
  skipLabel: "Skip to",
  steps: {
    who: {
      title: "Who are we looking after?",
      intro: "Pick one and we'll show you the services that fit.",
    },
    what: {
      title: "What do you need first?",
    },
  },
  back: "Back",
  audiences: [
    {
      key: "private",
      href: "/private",
      answer: "Private",
      detail: "I own, rent or buy a home, or I'm moving to Egypt.",
      servicesIntro: "Pick a service to go straight to it.",
      allServices: "See all private services",
      services: privatePage.hero.summary.rows,
    },
    {
      key: "business",
      href: "/business",
      answer: "Business",
      detail: "An HOA, a developer, or an employer with staff to move or a workplace to run.",
      servicesIntro: "Pick a department to go straight to it.",
      allServices: "See all business services",
      services: businessPage.hero.summary.rows,
    },
  ] satisfies LandingAudience[],
};
