export type AudienceKey = "private" | "business";

export type LandingAudience = {
  key: AudienceKey;
  href: "/private" | "/business";
  /** The answer to "Which best describes you?" */
  answer: string;
  detail: string;
};

/** The landing page's one question: who they are. Each answer opens its audience page. */
export const landing = {
  title: "Which best describes you?",
  intro: "Pick one and we'll show you the services that fit.",
  audiences: [
    {
      key: "private",
      href: "/private",
      answer: "Private",
      detail: "I own, rent or buy a home, or I'm moving to Egypt.",
    },
    {
      key: "business",
      href: "/business",
      answer: "Business",
      detail: "An HOA, a developer, or an employer with staff to move or a workplace to run.",
    },
  ] satisfies LandingAudience[],
};
