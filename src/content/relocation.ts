/**
 * Corporate Relocation — packages for employers moving staff to Egypt.
 * Source of truth: src/docs/Company_Departments_Overview_First_4_Departments.pdf, section 3.
 * No prices in the source: every relocation is quoted on request.
 */

export type RelocationStageId = "before-moving" | "moving" | "final-step";

/** The relocation page's opening: spoken to the person moving, not only to the employer. */
export const relocationOpening = {
  title: "A move to Egypt, with a partner on the ground.",
  paragraph:
    "Relocating to another country is a big, personal decision. You may be leaving home, moving your family and starting a new job in a place you don't yet know. We understand how significant this move is — and we will personally guide you through every step.",
  facts: [
    "One point of contact, from the first call to the last box",
    "A free, no-obligation first conversation",
    "Three moving offers to compare",
  ],
};

/** Before any stage of the move: the first conversation, with no obligation attached. */
export const relocationConversation = {
  when: "Before anything else",
  title: "It starts with a conversation.",
  summary:
    "We begin with a phone or video call to get to know you, understand your situation and identify what you actually need.",
  questionsLead: "What we explore together",
  questions: [
    "Who is relocating — an individual, a couple or a family?",
    "Where will you work?",
    "What kind of home and lifestyle are you looking for?",
    "Do you need schools or childcare?",
    "What support will you need before and after arrival?",
    "What are your biggest concerns about the move?",
  ],
  noObligation:
    "Your first conversation with us is simply an opportunity to get to know each other, understand your needs and discuss how we can support your move. There is no obligation to book a service.",
};

/** After the stages: what follows the first conversation. */
export const relocationNext = {
  title: "What happens next",
  text: "Only once we understand your needs do we propose the right services, next steps and a personalised offer. We're not selling a package — we're becoming your trusted partner on the ground.",
};

export type RelocationStage = {
  id: RelocationStageId;
  title: string;
  /** When in the move this package happens. */
  when: string;
  summary: string;
  items: { label: string; detail?: string }[];
};

export const relocationStages: RelocationStage[] = [
  {
    id: "before-moving",
    title: "Before moving",
    when: "From the day the job is confirmed",
    summary: "We find the right district and home, and line up school or work for the family.",
    items: [
      {
        label: "Where to live",
        detail: "A district chosen around culture, religion, family size, age and the commute to the office.",
      },
      { label: "Short-term rental, long-term rental or buying", detail: "Buying through Palmayya, our real estate company." },
      { label: "Viewings arranged and attended with the employee" },
      { label: "School, university or work for the rest of the family" },
      { label: "Orientation: how things work here, doctors, banks and a language course" },
    ],
  },
  {
    id: "moving",
    title: "Moving",
    when: "The move itself",
    summary: "Door-to-door movement management, with three offers to choose from.",
    items: [
      { label: "Three offers from moving companies", detail: "Compared on deadline, container for the household and air freight for small things." },
      { label: "Packing, shipment tracking, and the customs and tax paperwork" },
      { label: "What can and can't be shipped, explained up front" },
      { label: "Storage in the home country or with the moving company" },
    ],
  },
  {
    id: "final-step",
    title: "Settling in",
    when: "The first weeks in Egypt",
    summary: "The rental contract signed, the utilities on, and the home furnished.",
    items: [
      { label: "Temporary accommodation while the home is prepared" },
      { label: "Rental contract and paperwork, short or long term" },
      { label: "Bank account, phone, internet, water and electricity set up" },
      { label: "Home staging and furniture, from IKEA, ARIKA and others" },
    ],
  },
];

export const relocationOptions = [
  { id: "residence-visa", label: "Residence and visa" },
  { id: "lawyer", label: "Lawyer services" },
  { id: "language-teacher", label: "Language teacher" },
  { id: "culture-teacher", label: "Culture teacher" },
  { id: "car-rental", label: "Car rental" },
  { id: "drivers", label: "Drivers" },
  { id: "cleaning", label: "Cleaning" },
  { id: "security", label: "Security" },
  { id: "events", label: "Events" },
  { id: "concierge", label: "Concierge" },
  { id: "villa-management", label: "Property and facility management for the home" },
] as const;

export type RelocationOptionId = (typeof relocationOptions)[number]["id"];

export const relocationDestinations = [
  "New Cairo",
  "Cairo",
  "New Capital",
  "Hurghada",
  "Galala City or Sokhna",
  "Sahel",
  "Not decided yet",
] as const;

/** What we don't take on, said plainly so nobody plans around it. */
export const relocationExclusions = "We don't ship pets or cars — the regulations and taxes make it impractical.";
