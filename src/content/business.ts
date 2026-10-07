import heroTowerNight from "../../public/heroBackgroundImage/business/tower-night.jpg";
import heroTowersDusk from "../../public/heroBackgroundImage/business/towers-dusk.jpg";
import heroOfficeBlock from "../../public/heroBackgroundImage/business/office-block.jpg";
import { explainer } from "./explainer";
import { site } from "./site";
import type { AudiencePage } from "./types";

export const businessPage: AudiencePage = {
  slug: "business",
  meta: {
    title: "Business",
    description:
      "Property management, facility management, corporate relocation, special services and real estate for HOAs, developers and employers in New Cairo — one partner instead of five.",
  },
  switchLink: { label: "Private? →", href: "/private" },
  hero: {
    title: "Everything your property and your workplace need, all in one place.",
    paragraph:
      "SETABASE runs the administrative and technical side of buildings, teams, workplaces and relocations in New Cairo — so owners, HOAs and companies deal with one partner instead of five.",
    cta: "Request a quote",
    art: "towers",
    // Supplied by SETABASE; resized to 2560px wide from the originals.
    // TODO(photography): swap in the team's own New Cairo buildings when they're shot.
    photos: [
      {
        src: heroTowerNight,
        alt: "A curved glass office tower at night, one floor lit warm against blue windows",
        position: "50% 50%",
        source: "client-supplied/tower-night.jpg",
      },
      {
        src: heroTowersDusk,
        alt: "Glass office buildings and a pale tower in low evening sun, with trees along the street",
        position: "60% 50%",
        source: "client-supplied/towers-dusk.jpg",
      },
      {
        src: heroOfficeBlock,
        alt: "A tall office block with a deep overhanging roof and vertical fins, beside curved residential towers",
        position: "56% 50%",
        source: "client-supplied/office-block.jpg",
      },
    ],
    summary: {
      eyebrow: "Five departments, one team",
      rows: [
        { id: "property-management", label: "Property Management", audience: "Communities & companies" },
        { id: "facility-management", label: "Facility Management", audience: "Buildings & companies" },
        { id: "relocation", label: "Corporate Relocation", audience: "Employees moving to Egypt" },
        { id: "special-services", label: "Special Services", audience: "Workplace wellbeing" },
        { id: "real-estate", label: "Real Estate", audience: "Sell, rent & invest" },
      ],
    },
  },
  services: {
    title: "What we do",
    subtitle: "Five services, each one a full team on its own.",
    departments: [
      {
        id: "property-management",
        eyebrow: "For owners, communities & companies",
        title: "Property Management",
        description:
          "Full management of a property, a building or a portfolio — the money, the contracts, the suppliers and the paperwork — so the owner deals with one partner instead of five.",
        detail: {
          intro:
            "Property Management is not just administration. SETABASE becomes your trusted local partner and looks after the property as a whole: the accounts, the invoices, the contractors, the legal side and whatever comes up inside the building. For homeowners' associations and company-owned buildings, the same team also runs the owners' meetings, common charges and building-wide administration.",
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
        eyebrow: "For buildings & companies",
        title: "Facility Management",
        description:
          "Security, cleaning, maintenance and the day-to-day running of a building or office, handled by our team.",
        note: site.locations,
        detail: {
          intro:
            "It goes beyond the common areas. Facility Management can reach into individual apartments, houses and offices, and take the small everyday things off your plate too.",
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
              title: "A walk through the building",
              text: "We visit, see what the building or office needs and agree the scope with you.",
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
        eyebrow: "For employers",
        title: "Corporate Relocation",
        description:
          "For companies and employers relocating employees and their families to Egypt — housing, paperwork and settling in, handled personally.",
        packagesHref: "/business/relocation",
        detail: {
          intro:
            "Relocating to another country is a big, personal decision. We understand how significant the move is for your employee and their family — and we guide them through it personally, step by step.",
          steps: [
            {
              title: "It starts with a conversation",
              text: "A no-obligation phone or video call to get to know the employee and what they actually need.",
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
            "Every relocation is quoted on its own — once we understand the move, we come back quickly with a personalised offer.",
          closing: "We're not selling a package — we're becoming your employee's trusted partner on the ground.",
        },
      },
      {
        id: "special-services",
        eyebrow: "For workplaces",
        title: "Special Services",
        description:
          "Subscription packages that take care of the office — supplies, wellness, and team events, priced per employee.",
        note: "Packages from 615 EGP per employee per month.",
        packagesHref: "/business/special-services#packages",
        detail: {
          steps: [
            {
              title: "Choose your packages",
              text: "Ready packages, single items or events — the price shows as you pick.",
            },
            {
              title: "A one-month trial",
              text: "We confirm the price for your office and start with a trial month.",
            },
            {
              title: "One team runs it",
              text: "Deliveries, coaches and events on schedule, with one point of contact.",
            },
          ],
          pricing:
            "Fixed prices per employee per month, shown on the packages page — with 10% off for two or more packages and volume discounts from 50 employees.",
        },
      },
      {
        id: "real-estate",
        eyebrow: "For investors & developers",
        title: "Real Estate",
        description:
          "Sourcing, developing and investing in property across Egypt — with strong opportunities in New Cairo, Cairo, Sahel, and the Red Sea.",
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
      { value: "relocation", label: "Corporate Relocation" },
      { value: "special-services", label: "Special Services" },
      { value: "real-estate", label: "Real Estate" },
    ],
    submit: "Send request",
    helper: "We'll reply within one business day.",
  },
};
