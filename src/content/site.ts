/**
 * Company-wide details shared by every page.
 * TODO(contact): phone and email are placeholders from the brief — confirm before launch.
 * TODO(url): set NEXT_PUBLIC_SITE_URL in the hosting environment.
 */
export const site = {
  name: "SETABASE",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://setabase.com",
  description:
    "SETABASE manages properties, buildings, relocations and real estate in New Cairo — one partner for owners, tenants, HOAs and companies instead of five.",
  departmentsLine: "Property · Facility · Relocation · Special Services",
  keywords: [
    "property management New Cairo",
    "facility management Egypt",
    "relocation to Egypt",
    "corporate relocation Cairo",
    "real estate New Cairo",
    "HOA management Egypt",
    "office wellness packages Cairo",
    "SETABASE",
    "Palmayya",
  ],
  office: {
    short: "New Cairo, Egypt",
    full: "Building 6, Floor 3, Unit 9 · EDNC, New Cairo, Egypt",
    /** The same address broken for a stacked layout, e.g. the footer. */
    lines: ["Building 6, Floor 3, Unit 9", "EDNC, New Cairo, Egypt"],
  },
  email: "hello@setabase.com", // TODO(contact): placeholder
  phone: "+20 000 000 0000", // TODO(contact): placeholder
  /** TODO(app): point at the real app once it is live. */
  appUrl: "#",
} as const;
