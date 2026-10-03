import {
  BUNDLE_DISCOUNT,
  FLEX_MIN_ITEMS,
  fixedPackages,
  flexItems,
  volumeDiscounts,
  type FixedPackageId,
  type FlexItem,
} from "@/content/special-services";

export type SpecialServicesSelection = {
  employees: number;
  packages: FixedPackageId[];
  flexItems: string[];
};

export type SpecialServicesEstimate = {
  /** Fixed packages plus Flexible Pack items, before discounts, per month. */
  subtotal: number;
  bundleDiscount: number;
  volumeDiscount: number;
  volumeRate: number;
  /** What the client pays per month, in EGP, rounded to the pound. */
  monthly: number;
  /** Welcome kits are billed per new hire, outside the monthly total. */
  perHire: number;
  /** How many packages count towards the bundle discount. */
  packageCount: number;
  /** Flexible items chosen without any fixed package, below the minimum. */
  flexShortBy: number;
};

/** Monthly price of one Flexible Pack item for a team of this size. */
export function flexItemMonthly(item: FlexItem, employees: number) {
  switch (item.unit) {
    case "employee":
      return item.price * employees;
    case "office":
      return item.price;
    case "workshop":
    case "session":
      // Twice a year, spread over six months.
      return item.price / 6;
    case "kit":
      return 0;
  }
}

/** Items already inside a chosen package can't be added again on top. */
export function includedItems(packages: FixedPackageId[]) {
  return new Set(fixedPackages.filter((p) => packages.includes(p.id)).flatMap((p) => p.items));
}

/**
 * The live estimate shown beside the picker and recomputed by the API, so the request
 * that reaches the dashboard carries a price the client can't edit.
 * Discounts stack: the bundle discount first, then the volume discount on what remains.
 */
export function estimateSpecialServices(selection: SpecialServicesSelection): SpecialServicesEstimate {
  const employees = Math.max(1, Math.floor(selection.employees) || 1);
  const included = includedItems(selection.packages);
  const chosenFlex = flexItems.filter(
    (item) => selection.flexItems.includes(item.id) && !included.has(item.id),
  );

  const packageTotal = fixedPackages
    .filter((p) => selection.packages.includes(p.id))
    .reduce((sum, p) => sum + p.perEmployee * employees, 0);
  const flexTotal = chosenFlex.reduce((sum, item) => sum + flexItemMonthly(item, employees), 0);
  const perHire = chosenFlex
    .filter((item) => item.unit === "kit")
    .reduce((sum, item) => sum + item.price, 0);

  // On its own, the Flexible Pack counts as a package once it reaches the minimum.
  const flexStandalone = selection.packages.length === 0 && chosenFlex.length >= FLEX_MIN_ITEMS;
  const packageCount = selection.packages.length + (flexStandalone ? 1 : 0);
  const flexShortBy =
    selection.packages.length === 0 && chosenFlex.length > 0
      ? Math.max(0, FLEX_MIN_ITEMS - chosenFlex.length)
      : 0;

  const subtotal = packageTotal + flexTotal;
  const bundleDiscount = packageCount >= 2 ? subtotal * BUNDLE_DISCOUNT : 0;
  const volumeRate = volumeDiscounts.find((tier) => employees >= tier.from)?.rate ?? 0;
  const volumeDiscount = (subtotal - bundleDiscount) * volumeRate;

  return {
    subtotal: Math.round(subtotal),
    bundleDiscount: Math.round(bundleDiscount),
    volumeDiscount: Math.round(volumeDiscount),
    volumeRate,
    monthly: Math.round(subtotal - bundleDiscount - volumeDiscount),
    perHire,
    packageCount,
    flexShortBy,
  };
}

const egp = new Intl.NumberFormat("en-EG", { maximumFractionDigits: 0 });

export function formatEgp(value: number) {
  return `${egp.format(value)} EGP`;
}
