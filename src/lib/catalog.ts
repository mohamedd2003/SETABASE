/**
 * The catalog: what the admin manages and the public package pages sell.
 * Plain types only — safe to import from client components. Loading from the database
 * lives in catalog-data.ts; the shapes the planners consume are built here.
 */

export const offerCategories = ["delivery", "services", "flexible", "event"] as const;
export type OfferCategory = (typeof offerCategories)[number];

export const offerCategoryLabels: Record<OfferCategory, string> = {
  delivery: "Delivery",
  services: "Services",
  flexible: "Flexible Pack",
  event: "Event Pack",
};

export const flexUnits = ["employee", "office", "kit", "workshop", "session"] as const;
export type FlexUnit = (typeof flexUnits)[number];

export const flexUnitLabels: Record<FlexUnit, string> = {
  employee: "per employee",
  office: "per office",
  kit: "per new hire",
  workshop: "per workshop",
  session: "per session",
};

export type OfferItem = {
  name: string;
  /** Weekly, Monthly, Semi-annual, Upon hiring… free text. */
  frequency?: string;
  /** Event Pack only: the heading the idea sits under, e.g. "Team building". */
  group?: string;
  /** Flexible and Event packs: client price of one unit, in EGP. */
  price?: number;
  unit?: FlexUnit;
};

export type SpecialOffer = {
  id: string;
  title: string;
  slug: string;
  category: OfferCategory;
  shortDescription: string;
  description?: string;
  items: OfferItem[];
  /** For a 20-employee office, in EGP per month. */
  costPrice?: number;
  clientPrice?: number;
  pricePerEmployee?: number;
  priceOnRequest: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
};

export const relocationStages = ["before-moving", "moving", "final-step", "options"] as const;
export type RelocationStageKey = (typeof relocationStages)[number];

export const relocationStageLabels: Record<RelocationStageKey, string> = {
  "before-moving": "Before moving",
  moving: "Moving",
  "final-step": "Final step",
  options: "Options",
};

export type RelocationPackage = {
  id: string;
  title: string;
  slug: string;
  stage: RelocationStageKey;
  /** When in the move it happens, e.g. "From the day the job is confirmed". */
  when?: string;
  shortDescription: string;
  description?: string;
  /** "Label — detail" splits into a label and a smaller detail line on the site. */
  features: string[];
  price?: number;
  priceOnRequest: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
};

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/* ---------------------------------------------------------------------------
   Planner shapes — what the public Special Services page works with.
--------------------------------------------------------------------------- */

export type FlexItem = {
  id: string;
  label: string;
  frequency: string;
  price: number;
  unit: FlexUnit;
};

export type FixedPackage = {
  id: string;
  title: string;
  kicker: string;
  summary: string;
  perEmployee: number;
  items: { name: string; frequency?: string; flexId?: string }[];
};

export type EventIdea = { id: string; label: string; price: number };
export type EventGroup = { id: string; title: string; ideas: EventIdea[] };

export type SpecialServicesCatalog = {
  fixedPackages: FixedPackage[];
  flexItems: FlexItem[];
  eventGroups: EventGroup[];
  /** The Flexible Pack on its own needs at least this many items. */
  flexMinItems: number;
};

/** The Flexible Pack on its own needs at least this many items. */
export const FLEX_MIN_ITEMS = 5;

const key = (name: string) => slugify(name);

/** Turns the active offers into the lists the planner shows and prices. */
export function toSpecialServicesCatalog(offers: SpecialOffer[]): SpecialServicesCatalog {
  const active = offers.filter((o) => o.isActive).sort((a, b) => a.sortOrder - b.sortOrder);

  const flexItems: FlexItem[] = active
    .filter((o) => o.category === "flexible")
    .flatMap((o) => o.items)
    .filter((item) => typeof item.price === "number" && item.unit)
    .map((item) => ({
      id: key(item.name),
      label: item.name,
      frequency: item.frequency ?? "",
      price: item.price!,
      unit: item.unit!,
    }));
  const flexIds = new Set(flexItems.map((f) => f.id));

  const fixedPackages: FixedPackage[] = active
    .filter((o) => (o.category === "delivery" || o.category === "services") && !o.priceOnRequest)
    .map((o) => ({
      id: o.slug,
      title: o.title,
      kicker: `${offerCategoryLabels[o.category]} package`,
      summary: o.shortDescription,
      perEmployee: o.pricePerEmployee ?? 0,
      items: o.items.map((item) => {
        const flexId = key(item.name);
        return { name: item.name, frequency: item.frequency, flexId: flexIds.has(flexId) ? flexId : undefined };
      }),
    }));

  const groups = new Map<string, EventGroup>();
  active
    .filter((o) => o.category === "event")
    .flatMap((o) => o.items)
    .forEach((item) => {
      const title = item.group?.trim() || "Events";
      const group = groups.get(title) ?? { id: key(title), title, ideas: [] };
      group.ideas.push({ id: key(item.name), label: item.name, price: item.price ?? 0 });
      groups.set(title, group);
    });

  return { fixedPackages, flexItems, eventGroups: [...groups.values()], flexMinItems: FLEX_MIN_ITEMS };
}

/* ---------------------------------------------------------------------------
   Relocation shapes — what the public Corporate Relocation page works with.
--------------------------------------------------------------------------- */

export type RelocationStage = {
  id: string;
  /** Which part of the model this stage builds. */
  key: Exclude<RelocationStageKey, "options">;
  title: string;
  when: string;
  summary: string;
  items: { label: string; detail?: string }[];
};

export type RelocationCatalog = {
  stages: RelocationStage[];
  options: { id: string; label: string }[];
};

export function splitFeature(feature: string) {
  const [label, ...rest] = feature.split(" — ");
  return { label: label.trim(), detail: rest.length ? rest.join(" — ").trim() : undefined };
}

export function toRelocationCatalog(packages: RelocationPackage[]): RelocationCatalog {
  const active = packages.filter((p) => p.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  return {
    stages: active
      .filter((p): p is RelocationPackage & { stage: RelocationStage["key"] } => p.stage !== "options")
      .map((p) => ({
        id: p.slug,
        key: p.stage,
        title: p.title,
        when: p.when ?? "",
        summary: p.shortDescription,
        items: p.features.map(splitFeature),
      })),
    options: active
      .filter((p) => p.stage === "options")
      .flatMap((p) => p.features)
      .map((feature) => {
        const { label } = splitFeature(feature);
        return { id: key(label), label };
      }),
  };
}
