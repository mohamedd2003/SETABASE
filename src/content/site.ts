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
    /** EDNC – SODIC, where the office is. Shown in the footer's location plan. */
    place: "EDNC, New Cairo",    /** The embed carries its own "open in Maps" link, so the footer adds directions instead. */
    mapEmbed:
      "https://maps.google.com/maps?q=EDNC%20-%20SODIC%2C%20New%20Cairo&ll=30.0148299%2C31.5146165&z=15&output=embed",
    directions: "https://www.google.com/maps/dir/?api=1&destination=30.0148299%2C31.5146165",
  },
  email: "hello@setabase.com", // TODO(contact): placeholder
  phone: "+20 000 000 0000", // TODO(contact): placeholder
  /** TODO(app): point at the real app once it is live. */
  appUrl: "#",
  /** Where the services run today. One sentence, used wherever the locations are named. */
  locations:
    "Currently serving the New Cairo region and Hurghada (Red Sea region), with expansion into other Egyptian cities.",
  /** Beside every contact button: the first step costs nothing and commits to nothing. */
  reassurance: "Your first enquiry is free of charge and without obligation.",
  /** How pricing works for the services without a price list. */
  pricingOnRequest:
    "There's no fixed price list — once we understand your requirements, we come back quickly with a personalised proposal based on your needs.",
} as const;
