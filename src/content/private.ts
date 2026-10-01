import heroVilla from "../../public/heroBackgroundImage/naomi-ellsworth-EMPLSuvDuhQ-unsplash.jpg";
import heroTownhouse from "../../public/heroBackgroundImage/salman-saqib-GHlwOXqb8SU-unsplash.jpg";
import heroPalms from "../../public/heroBackgroundImage/tim-schmidbauer-_tEBCVrEnyo-unsplash.jpg";
import { explainer } from "./explainer";
import type { AudiencePage } from "./types";

export const privatePage: AudiencePage = {
  slug: "private",
  meta: {
    title: "Private",
    description:
      "Property management, facility management, relocation and real estate for individual owners, tenants, buyers and people moving to Egypt — one partner in New Cairo.",
  },
  switchLink: { label: "Business? →", href: "/business" },
  hero: {
    title: "Everything your property needs, all in one place.",
    paragraph:
      "SETABASE manages rental properties, relocations and real estate for individual owners, tenants and people moving to Egypt — one partner in New Cairo instead of five.",
    cta: "Request a quote",
    art: "villa",
    // Unsplash licence: free for commercial use, no attribution required.
    // TODO(photography): replace with SETABASE's own New Cairo property photography.
    photos: [
      {
        src: heroVilla,
        alt: "A contemporary two-storey home with deep overhanging roofs, floor-to-ceiling glass and a landscaped front garden",
        position: "42% 50%",
        source: "https://unsplash.com/photos/EMPLSuvDuhQ",
      },
      {
        src: heroTownhouse,
        alt: "A two-storey villa with a cream façade, dark stone pillars and a pergola-shaded balcony",
        position: "48% 50%",
        source: "https://unsplash.com/photos/GHlwOXqb8SU",
      },
      {
        src: heroPalms,
        alt: "A white modernist villa with timber-screened terraces, framed by palm trees",
        position: "66% 50%",
        source: "https://unsplash.com/photos/_tEBCVrEnyo",
      },
    ],
    secondaryCta: "Explore services",
    strapline: "Four services, one point of contact.",
    summary: {
      eyebrow: "For individuals",
      rows: [
        { id: "property-management", label: "Property Management", audience: "Owners & tenants" },
        { id: "facility-management", label: "Facility Management", audience: "Villas & multi-unit owners" },
        { id: "relocation", label: "Relocation", audience: "People moving to Egypt" },
        { id: "real-estate", label: "Real Estate", audience: "Sell, rent & invest" },
      ],
    },
  },
  services: {
    title: "What we do",
    subtitle: "Four services, tailored to individual owners and residents.",
    departments: [
      {
        id: "property-management",
        eyebrow: "For owners & tenants",
        title: "Property Management",
        description:
          "Tenant relations, rent collection and billing, deposits, yearly accounting and the paperwork that comes with owning or renting a home.",
      },
      {
        id: "facility-management",
        eyebrow: "For villas & multi-unit owners",
        title: "Facility Management",
        description:
          "Security, cleaning and day-to-day upkeep for a villa or a portfolio of apartments — the hands-on side of owning property.",
        note: "Now in New Cairo and Hurghada, expanding to other Egyptian cities.",
      },
      {
        id: "relocation",
        eyebrow: "For people moving to Egypt",
        title: "Relocation",
        description:
          "Home finding, viewings, temporary accommodation and settling-in support for individuals, students, families and retirees moving to Egypt.",
        note: "Before the move, during, and after arrival — in three steps.",
      },
      {
        id: "real-estate",
        eyebrow: "For buyers & sellers",
        title: "Real Estate",
        description:
          "Buying, selling and investing in property across Egypt — with strong opportunities in New Cairo, Cairo, Sahel, and the Red Sea.",
        note: "Through Palmayya, our real estate sales company.",
      },
    ],
  },
  explainer,
  contact: {
    title: "Tell us what you need",
    intro:
      "Share a few details and we'll come back with a tailored quote — usually within one business day.",
    interests: [
      { value: "property-management", label: "Property Management" },
      { value: "facility-management", label: "Facility Management" },
      { value: "relocation", label: "Relocation" },
      { value: "real-estate", label: "Real Estate" },
    ],
    submit: "Send request",
    helper: "We'll reply within one business day.",
  },
};
