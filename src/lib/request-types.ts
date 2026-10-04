/** Request enums and labels. Plain values, safe for client components — no Mongoose here. */

export const requestServices = ["special-services", "relocation"] as const;
export type RequestService = (typeof requestServices)[number];

export const requestStatuses = ["new", "contacted", "in-progress", "closed", "rejected"] as const;
export type RequestStatus = (typeof requestStatuses)[number];

export const requestStatusLabels: Record<RequestStatus, string> = {
  new: "New",
  contacted: "Contacted",
  "in-progress": "In progress",
  closed: "Closed",
  rejected: "Rejected",
};

export const requestServiceLabels: Record<RequestService, string> = {
  "special-services": "Special Services",
  relocation: "Corporate Relocation",
};
