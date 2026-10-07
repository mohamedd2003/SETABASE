import type { StaticImageData } from "next/image";

export type ServiceId =
  | "property-management"
  | "facility-management"
  | "relocation"
  | "special-services"
  | "real-estate";

export type SummaryRow = {
  /** The service card this row jumps to. */
  id: ServiceId;
  label: string;
  audience: string;
};

export type ServiceGroup = {
  title: string;
  /** The one-line message of this group, e.g. who it is for. */
  lead?: string;
  items: string[];
};

export type ServiceStep = {
  title: string;
  text: string;
};

/**
 * The depth under a department's description: what the service is, what's included,
 * how it works, what it costs and what happens after contact. Every part is optional,
 * so a department shows only what it has.
 */
export type ServiceDetail = {
  /** What the service means and what we take off the visitor's shoulders, before any list. */
  intro?: string;
  /** What's included. Two groups sit side by side. */
  groups?: ServiceGroup[];
  /** How it works, in order. */
  steps?: ServiceStep[];
  /** How pricing is determined. */
  pricing?: string;
  /** The closing line before the buttons. */
  closing?: string;
};

export type Department = {
  id: ServiceId;
  eyebrow: string;
  title: string;
  description: string;
  /** Optional one-line fact under the description, e.g. a starting price. */
  note?: string;
  /** A page of its own with the department's packages, linked from the card. */
  packagesHref?: string;
  /** The deeper layer under the description. */
  detail?: ServiceDetail;
};

export type ExplainerColumn = {
  title: string;
  summary: string;
  example: string;
};

export type Explainer = {
  title: string;
  intro: string;
  columns: [ExplainerColumn, ExplainerColumn];
  closing: string;
};

export type AudiencePage = {
  slug: "private" | "business";
  meta: {
    title: string;
    description: string;
  };
  /** The link to the other audience page, shown in the header. */
  switchLink: {
    label: string;
    href: "/private" | "/business";
  };
  hero: {
    title: string;
    paragraph: string;
    cta: string;
    /** The drawing that stands on the summary panel — matches the landing half. */
    art: "villa" | "towers";
    /**
     * Optional full-bleed photo hero. When present it replaces the panel layout: the
     * photos crossfade in a loop and the summary rows move into a strip along the bottom.
     */
    photos?: {
      src: StaticImageData;
      alt: string;
      /**
       * CSS object-position keeping the subject in frame. On a portrait phone only a
       * narrow slice of a landscape photo shows, so the x value matters most.
       */
      position: string;
      /** Where the photo came from, for the licence record. */
      source: string;
    }[];
    /** Second button in the photo hero, linking to the services section. */
    secondaryCta?: string;
    /** Short serif line at the start of the photo hero's bottom strip. */
    strapline?: string;
    summary: {
      eyebrow: string;
      rows: SummaryRow[];
    };
  };
  services: {
    title: string;
    subtitle: string;
    departments: Department[];
  };
  explainer: Explainer;
  contact: {
    title: string;
    intro: string;
    interests: { value: ServiceId; label: string }[];
    submit: string;
    helper: string;
  };
};
