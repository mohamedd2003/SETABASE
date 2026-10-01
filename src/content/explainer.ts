import type { Explainer } from "./types";

/** Shared by both audience pages — from the SETABASE Property vs Facility explainer. */
export const explainer: Explainer = {
  title: "Property vs Facility Management — what's the difference?",
  intro:
    "People often mix them up, but they answer two different needs. Take a pipe leaking in an apartment:",
  columns: [
    {
      title: "Property Management",
      summary:
        "Takes care of the money and the contracts of a property — it protects the owner's value and income.",
      example:
        "The property manager reports the leak, informs the owner and follows the case.",
    },
    {
      title: "Facility Management",
      summary:
        "Takes care of how the building actually works — it keeps it safe, clean and running.",
      example:
        "The facility manager sends the plumber and checks that the repair is done properly.",
    },
  ],
  closing: "One team, one point of contact.",
};
