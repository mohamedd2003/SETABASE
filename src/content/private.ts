import heroVilla from "../../public/heroBackgroundImage/naomi-ellsworth-EMPLSuvDuhQ-unsplash.jpg";
import heroTownhouse from "../../public/heroBackgroundImage/salman-saqib-GHlwOXqb8SU-unsplash.jpg";
import heroPalms from "../../public/heroBackgroundImage/tim-schmidbauer-_tEBCVrEnyo-unsplash.jpg";
import { explainer } from "./explainer";
import { site } from "./site";
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
          "We manage your property for you: tenants, rent, accounting, bills, maintenance and all the administration that comes with owning it.",
        detail: {
          intro:
            "Property Management is not just paperwork. SETABASE becomes your trusted local partner and looks after the property as a whole: the accounts, the invoices, the contractors, the legal side and whatever comes up inside the home — whether you live in it or someone else does.",
          groups: [
            {
              title: "You live in your property",
              lead: "You own and enjoy your property. We take care of the management around it.",
              items: [
                "Bookkeeping and accounting",
                "Managing invoices and payments",
                "Maintenance and repairs",
                "Coordinating contractors",
                "Handling problems inside the property",
                "Managing issues with elevators, electricity and utilities",
                "Legal and administrative matters",
                "Common charges",
                "Building and compound administration",
                "Owner requirements and requests",
                "Annual cost reporting",
              ],
            },
            {
              title: "You rent out your property",
              lead: "For owners and investors with an apartment, house, compound unit or investment property to let: the full management package.",
              items: [
                "Finding and screening new tenants",
                "Preparing rental contracts",
                "Tenant communication",
                "Rent collection and payment follow-up",
                "Issuing invoices",
                "Managing maintenance and repairs",
                "Coordinating service providers",
                "Accounting and bookkeeping",
                "Annual reporting of property costs and expenses",
                "Support with administrative and legal matters",
              ],
            },
          ],
          steps: [
            {
              title: "Tell us about the property",
              text: "A short call or message: what you own, where it is and what you'd like taken off your hands.",
            },
            {
              title: "A personalised proposal",
              text: "We come back with what we'd take care of and what it costs — usually within one business day.",
            },
            {
              title: "We take over",
              text: "One handover, then one point of contact for everything to do with the property.",
            },
          ],
          pricing: site.pricingOnRequest,
          closing: "Whether you live in it or rent it out, SETABASE looks after your property as if it were our own.",
        },
      },
      {
        id: "facility-management",
        eyebrow: "For villas & multi-unit owners",
        title: "Facility Management",
        description:
          "Security, cleaning, maintenance and the day-to-day running of your home or building, handled by our team.",
        note: site.locations,
        detail: {
          intro:
            "It goes beyond the common areas. Facility Management can reach into the villa, the apartment or the office itself, and take the small everyday things off your plate too.",
          groups: [
            {
              title: "What we take care of",
              items: [
                "Cleaning of individual apartments, houses and offices",
                "Regular cleaning services",
                "Maintenance and repairs",
                "Security",
                "Day-to-day building operations",
                "Concierge-type services",
                "Receiving or coordinating larger deliveries and packages when required",
              ],
            },
          ],
          steps: [
            {
              title: "A walk through the property",
              text: "We visit, see what the home or building needs and agree the scope with you.",
            },
            {
              title: "A plan and a proposal",
              text: "Schedules, staffing and a monthly price — usually within one business day of the visit.",
            },
            {
              title: "Our team takes over",
              text: "Day-to-day operations, with one person at SETABASE answering to you.",
            },
          ],
          pricing: site.pricingOnRequest,
          closing:
            "Facility Management with SETABASE is about making your everyday life easier — not just keeping the building running.",
        },
      },
      {
        id: "relocation",
        eyebrow: "For people moving to Egypt",
        title: "Relocation",
        description:
          "Home finding, viewings, temporary accommodation and settling-in support for individuals, students, families and retirees moving to Egypt.",
        detail: {
          intro:
            "Relocating to another country is a big, personal decision. You may be leaving home, moving your family and starting again in a place you don't yet know. We understand how significant this move is — and we will personally guide you through every step.",
          steps: [
            {
              title: "It starts with a conversation",
              text: "A no-obligation phone or video call to get to know you and what you actually need.",
            },
            {
              title: "Before moving",
              text: "The district, the home, and school or work for the rest of the family.",
            },
            {
              title: "Moving",
              text: "Door to door, with three moving offers to compare.",
            },
            {
              title: "Settling in",
              text: "The contract signed, the utilities on and the home furnished.",
            },
          ],
          pricing:
            "Every move is quoted on its own — once we understand yours, we come back quickly with a personalised offer. The first conversation commits you to nothing.",
          closing: "We're not selling a package — we're becoming your trusted partner on the ground.",
        },
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
