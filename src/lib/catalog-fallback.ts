import { eventGroups, fixedPackages, flexItems } from "@/content/special-services";
import { relocationOptions, relocationStages } from "@/content/relocation";
import type { RelocationPackage, SpecialOffer } from "@/lib/catalog";

/**
 * The built-in catalog: the packages from the departments PDF, as the content files hold
 * them. The public pages show these when no database is configured or reachable, so the
 * site never loses its packages. Once the database is up, it is the source of truth and
 * these are not consulted.
 */

/** Monthly cost for a 20-employee office, from the PDF (client price = cost + 50%). */
const costPrices: Record<string, number> = {
  "essential-delivery": 14_800,
  "premium-delivery": 17_150,
  "essential-services": 8_150,
  "premium-services": 16_100,
};

const flexById = new Map(flexItems.map((item) => [item.id, item]));

/** The slug stands in for the id, since these rows never came from the database. */
export const fallbackSpecialOffers: SpecialOffer[] = [
  ...fixedPackages.map<SpecialOffer>((pkg, i) => ({
    id: pkg.id,
    title: `${pkg.title} Pack`,
    slug: pkg.id,
    category: pkg.kind === "Delivery" ? "delivery" : "services",
    shortDescription: pkg.summary,
    items: pkg.items.map((id) => {
      const item = flexById.get(id)!;
      return { name: item.label, frequency: item.frequency };
    }),
    costPrice: costPrices[pkg.id],
    clientPrice: pkg.perEmployee * 20,
    pricePerEmployee: pkg.perEmployee,
    priceOnRequest: false,
    isActive: true,
    sortOrder: i,
  })),
  {
    id: "flexible-pack",
    title: "Flexible Pack",
    slug: "flexible-pack",
    category: "flexible",
    shortDescription:
      "Build your own from 5 items or more, or add single items on top of any package, priced à la carte.",
    items: flexItems.map((item) => ({
      name: item.label,
      frequency: item.frequency,
      price: item.price,
      unit: item.unit,
    })),
    priceOnRequest: false,
    isActive: true,
    sortOrder: fixedPackages.length,
  },
  {
    id: "event-pack",
    title: "Event Pack",
    slug: "event-pack",
    category: "event",
    shortDescription:
      "Team building, afterwork, seasonal celebrations and launches — priced on request for your team and calendar.",
    items: eventGroups.flatMap((group) =>
      group.ideas.map((idea) => ({ name: idea.label, group: group.title, price: idea.price })),
    ),
    priceOnRequest: true,
    isActive: true,
    sortOrder: fixedPackages.length + 1,
  },
];

export const fallbackRelocationPackages: RelocationPackage[] = [
  ...relocationStages.map<RelocationPackage>((stage, i) => ({
    id: stage.id,
    title: stage.title,
    slug: stage.id,
    stage: stage.id,
    when: stage.when,
    shortDescription: stage.summary,
    features: stage.items.map((item) => (item.detail ? `${item.label} — ${item.detail}` : item.label)),
    priceOnRequest: true,
    isActive: true,
    sortOrder: i,
  })),
  {
    id: "options",
    title: "Options",
    slug: "options",
    stage: "options",
    when: "Any time",
    shortDescription: "Add any of these to the move, or on their own once the family has arrived.",
    features: relocationOptions.map((option) => option.label),
    priceOnRequest: true,
    isActive: true,
    sortOrder: relocationStages.length,
  },
];
