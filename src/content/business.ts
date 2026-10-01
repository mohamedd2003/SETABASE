import { explainer } from "./explainer";
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
        eyebrow: "For communities & companies",
        title: "Property Management",
        description:
          "Owners' meetings, common charges, legal aspects and building-wide administration — full management for homeowners' associations and company-owned buildings.",
      },
      {
        id: "facility-management",
        eyebrow: "For buildings & companies",
        title: "Facility Management",
        description:
          "Security, cleaning, maintenance and the day-to-day running of a building or office, handled by our team.",
        note: "Now in New Cairo and Hurghada, expanding to other Egyptian cities.",
      },
      {
        id: "relocation",
        eyebrow: "For employers",
        title: "Corporate Relocation",
        description:
          "Housing, paperwork and settling-in support for companies relocating employees to Egypt — fast turnaround, one point of contact.",
      },
      {
        id: "special-services",
        eyebrow: "For workplaces",
        title: "Special Services",
        description:
          "Subscription packages that take care of the office — supplies, wellness, and team events, priced per employee.",
        note: "Packages from 615 EGP per employee per month.",
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
