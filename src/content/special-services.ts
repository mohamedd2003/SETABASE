/**
 * Special Services — subscription packages for workplaces.
 * Source of truth: src/docs/Company_Departments_Overview_First_4_Departments.pdf, section 4.
 *
 * Every price here is the client price (cost + 50% margin) per month. Fixed packages are
 * quoted per employee; Flexible Pack items carry their own unit. Semi-annual items are
 * spread over six months, the way the PDF's per-employee package totals were built.
 */

export type FixedPackageId =
  | "essential-delivery"
  | "premium-delivery"
  | "essential-services"
  | "premium-services";

export type FlexUnit = "employee" | "office" | "kit" | "workshop" | "session";

export type FlexItem = {
  id: string;
  label: string;
  frequency: "Weekly" | "Monthly" | "Semi-annual" | "Upon hiring";
  /** Client price for one unit. */
  price: number;
  unit: FlexUnit;
};

export type FixedPackage = {
  id: FixedPackageId;
  title: string;
  kind: "Delivery" | "Services";
  tier: "Essential" | "Premium";
  summary: string;
  /** Client price per employee per month. */
  perEmployee: number;
  /** Flexible Pack items this package already contains. */
  items: string[];
};

export type EventIdea = {
  id: string;
  label: string;
  /** Client price for a group of 20 employees. */
  price: number;
};

export type EventGroup = {
  id: string;
  title: string;
  ideas: EventIdea[];
};

export const flexItems: FlexItem[] = [
  { id: "toilet-paper", label: "Toilet paper, hand towels, soap", frequency: "Weekly", price: 150, unit: "employee" },
  { id: "water-coffee-tea", label: "Water, coffee, tea", frequency: "Weekly", price: 280, unit: "employee" },
  { id: "fruit-basket", label: "Fresh fruit basket", frequency: "Weekly", price: 225, unit: "employee" },
  { id: "flowers", label: "Fresh flowers", frequency: "Weekly", price: 2400, unit: "office" },
  { id: "healthy-snacks", label: "Healthy snacks", frequency: "Weekly", price: 195, unit: "employee" },
  { id: "office-supplies", label: "Office supplies", frequency: "Monthly", price: 85, unit: "employee" },
  { id: "hygiene", label: "Hand sanitizer, hygiene products", frequency: "Monthly", price: 60, unit: "employee" },
  { id: "smoothies", label: "Smoothies and fresh juices", frequency: "Weekly", price: 330, unit: "employee" },
  { id: "detox-tea", label: "Detox tea and infusion dispensers", frequency: "Weekly", price: 115, unit: "employee" },
  { id: "sweets", label: "Chocolates and sweets", frequency: "Weekly", price: 105, unit: "employee" },
  { id: "thursday-breakfast", label: "Thursday breakfast", frequency: "Weekly", price: 390, unit: "employee" },
  { id: "organic-basket", label: "Local and organic product basket", frequency: "Monthly", price: 3000, unit: "office" },
  { id: "scent-diffusers", label: "Ambient scent diffusers", frequency: "Monthly", price: 1200, unit: "office" },
  { id: "air-purifiers", label: "Air purifiers", frequency: "Monthly", price: 2100, unit: "office" },
  { id: "welcome-kits", label: "New employee welcome kits", frequency: "Upon hiring", price: 340, unit: "kit" },
  { id: "health-check", label: "Quick health check-up", frequency: "Monthly", price: 300, unit: "employee" },
  { id: "monthly-training", label: "Monthly training on company topics", frequency: "Monthly", price: 4500, unit: "office" },
  { id: "payslip-workshop", label: "Payslip and benefits workshop", frequency: "Semi-annual", price: 4500, unit: "workshop" },
  { id: "financial-advisor", label: "Financial advisor", frequency: "Semi-annual", price: 6000, unit: "session" },
  { id: "fitness-coach", label: "Fitness coach", frequency: "Weekly", price: 7950, unit: "office" },
  { id: "wellness-coach", label: "Mental wellness coach", frequency: "Monthly", price: 6750, unit: "office" },
  { id: "yoga", label: "Yoga and meditation classes", frequency: "Monthly", price: 5250, unit: "office" },
  { id: "nutritionist", label: "Nutritionist consultation", frequency: "Monthly", price: 4200, unit: "office" },
];

export const fixedPackages: FixedPackage[] = [
  {
    id: "essential-delivery",
    title: "Essential Delivery",
    kind: "Delivery",
    tier: "Essential",
    summary: "The basics, restocked before anyone notices they're running low.",
    perEmployee: 1110,
    items: ["toilet-paper", "water-coffee-tea", "fruit-basket", "flowers", "healthy-snacks", "office-supplies", "hygiene"],
  },
  {
    id: "premium-delivery",
    title: "Premium Delivery",
    kind: "Delivery",
    tier: "Premium",
    summary: "Fresh juice, a Thursday breakfast and a welcome kit for every new hire.",
    perEmployee: 1290,
    items: ["smoothies", "detox-tea", "sweets", "thursday-breakfast", "organic-basket", "scent-diffusers", "air-purifiers", "welcome-kits"],
  },
  {
    id: "essential-services",
    title: "Essential Services",
    kind: "Services",
    tier: "Essential",
    summary: "Monthly health checks and training, plus money advice twice a year.",
    perEmployee: 615,
    items: ["health-check", "monthly-training", "payslip-workshop", "financial-advisor"],
  },
  {
    id: "premium-services",
    title: "Premium Services",
    kind: "Services",
    tier: "Premium",
    summary: "A fitness coach every week, and mental wellness, yoga and nutrition every month.",
    perEmployee: 1210,
    items: ["fitness-coach", "wellness-coach", "yoga", "nutritionist"],
  },
];

/** The Flexible Pack on its own needs at least this many items. */
export const FLEX_MIN_ITEMS = 5;

export const eventGroups: EventGroup[] = [
  {
    id: "team-building",
    title: "Team building",
    ideas: [
      { id: "felucca", label: "Felucca trip on the Nile with lunch", price: 6000 },
      { id: "cooking", label: "Egyptian cooking workshop (koshari, molokheya)", price: 7500 },
      { id: "desert-safari", label: "Desert safari and Bedouin evening", price: 19500 },
      { id: "tournament", label: "Football or padel tournament", price: 6000 },
    ],
  },
  {
    id: "afterwork",
    title: "Afterwork",
    ideas: [
      { id: "shisha", label: "Shisha evening and card games", price: 3750 },
      { id: "karkade", label: "Tea and karkadé tasting", price: 1950 },
      { id: "happy-hour", label: "Happy hour", price: 6000 },
      { id: "cinema", label: "Outdoor cinema night", price: 4500 },
    ],
  },
  {
    id: "seasonal",
    title: "Ramadan, Eid, Christmas and New Year",
    ideas: [
      { id: "iftar", label: "Group iftar", price: 9750 },
      { id: "fanous", label: "Decoration with fanous lanterns", price: 3300 },
      { id: "kahk", label: "Kahk cookies for Eid", price: 3000 },
      { id: "gifts", label: "Christmas and New Year gifts", price: 6750 },
    ],
  },
  {
    id: "anniversaries",
    title: "Company anniversaries",
    ideas: [
      { id: "cake", label: "Cake and a small ceremony", price: 4050 },
      { id: "catering", label: "Egyptian or international catering", price: 8250 },
      { id: "local-gift", label: "Local gift (crafts, oriental perfumes)", price: 4500 },
    ],
  },
  {
    id: "launches",
    title: "Product launches",
    ideas: [
      { id: "buffet", label: "Oriental or international buffet", price: 6000 },
      { id: "launch-decor", label: "Event decoration and logistics", price: 4500 },
    ],
  },
  {
    id: "milestones",
    title: "Milestone celebrations",
    ideas: [
      { id: "team-lunch", label: "Team lunch at a local restaurant", price: 8250 },
      { id: "coffee-gift", label: "Egyptian coffee and a recognition gift", price: 3450 },
    ],
  },
];

export const eventIdeas = eventGroups.flatMap((group) => group.ideas);

export const contractLengths = [
  { value: "6-months", label: "6 months" },
  { value: "1-year", label: "1 year" },
  { value: "2-years", label: "2 years" },
  { value: "3-years", label: "3 years" },
  { value: "5-years", label: "5 years" },
] as const;

export const volumeDiscounts = [
  { from: 500, rate: 0.2 },
  { from: 200, rate: 0.15 },
  { from: 100, rate: 0.125 },
  { from: 50, rate: 0.1 },
] as const;

/** Two or more packages together take this off. */
export const BUNDLE_DISCOUNT = 0.1;

/** What happens after the request is sent, in order. */
export const specialServicesSteps = [
  { title: "Send your selection", text: "Packages, items or events, with the size of your team." },
  { title: "We confirm the price", text: "Usually within one business day, with your one-month trial set up." },
  { title: "One team runs it", text: "Deliveries, coaches and events on schedule, with one point of contact." },
];

export const specialServicesTerms = [
  "Start with a one-month trial, then a six-month minimum.",
  "Contracts run 6 months, or 1, 2, 3 or 5 years.",
  "Cancel a yearly contract with three months' notice.",
  "Take two or more packages and save 10%.",
  "Bigger teams pay less: 10% off from 50 employees, 12.5% from 100, 15% from 200, 20% from 500.",
];
