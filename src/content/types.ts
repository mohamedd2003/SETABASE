export type ServiceId =
  | "property-management"
  | "facility-management"
  | "relocation"
  | "special-services"
  | "real-estate";

export type SummaryRow = {
  label: string;
  audience: string;
};

export type Department = {
  id: ServiceId;
  eyebrow: string;
  title: string;
  description: string;
  /** Optional one-line fact under the description, e.g. a starting price. */
  note?: string;
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
