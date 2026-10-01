import { z } from "zod";

/** Shared by the client form and the /api/contact route so both validate identically. */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name."),
  company: z.string().trim().max(120, "Keep the company name under 120 characters.").optional().or(z.literal("")),
  email: z.email("Enter a valid email address."),
  interest: z.enum(
    ["property-management", "facility-management", "relocation", "special-services", "real-estate"],
    { error: "Choose what you're interested in." },
  ),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a little more — at least 10 characters.")
    .max(2000, "Keep the message under 2000 characters."),
  /** Honeypot — real visitors never fill this in. Any value is accepted here; the route drops the request. */
  website: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
