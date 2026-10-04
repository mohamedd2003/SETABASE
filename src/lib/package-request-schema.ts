import { z } from "zod";
import { contractLengths } from "@/content/special-services";
import { relocationDestinations } from "@/content/relocation";

const idList = z.array(z.string().trim().min(1).max(80)).max(60);

/** Who's asking — the same on both package pages. */
export const requesterSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name.").max(120),
  company: z.string().trim().min(2, "Enter your company's name.").max(120, "Keep the company name under 120 characters."),
  email: z.email("Enter a valid email address."),
  phone: z
    .string()
    .trim()
    .max(30, "Keep the phone number under 30 characters.")
    .regex(/^[+\d\s()-]*$/, "Use digits, spaces and + only.")
    .optional()
    .or(z.literal("")),
  message: z.string().trim().max(2000, "Keep the message under 2000 characters.").optional().or(z.literal("")),
  /** Honeypot — real visitors never fill this in. */
  website: z.string().optional(),
});

export type RequesterInput = z.infer<typeof requesterSchema>;

/**
 * Package ids are plain strings here; the API checks them against the live catalog, so a
 * package the admin removed can't be requested.
 */
export const specialServicesRequestSchema = z.object({
  service: z.literal("special-services"),
  employees: z
    .number({ error: "Enter how many employees work at the office." })
    .int("Use a whole number.")
    .min(1, "At least one employee.")
    .max(100000, "That's more employees than we can quote online — call us."),
  packages: idList,
  flexItems: idList,
  eventIdeas: idList,
  contractLength: z.enum(contractLengths.map((c) => c.value) as [string, ...string[]]).optional(),
  requester: requesterSchema,
});

export const relocationRequestSchema = z.object({
  service: z.literal("relocation"),
  stages: idList,
  options: idList,
  employees: z
    .number({ error: "Enter how many people are relocating." })
    .int("Use a whole number.")
    .min(1, "At least one person.")
    .max(5000, "For moves this size, call us directly."),
  movingFrom: z.string().trim().min(2, "Enter the country they're moving from.").max(80),
  destination: z.enum(relocationDestinations, { error: "Choose where they're moving to." }),
  arrival: z
    .string()
    .regex(/^\d{4}-\d{2}$/, "Choose a month.")
    .optional()
    .or(z.literal("")),
  requester: requesterSchema,
});

export const packageRequestSchema = z
  .discriminatedUnion("service", [specialServicesRequestSchema, relocationRequestSchema])
  .superRefine((request, ctx) => {
    const chosen =
      request.service === "special-services"
        ? request.packages.length + request.flexItems.length + request.eventIdeas.length
        : request.stages.length + request.options.length;
    if (chosen === 0) {
      ctx.addIssue({ code: "custom", path: ["packages"], message: "Choose at least one package." });
    }
  });

export type PackageRequest = z.infer<typeof packageRequestSchema>;
export type SpecialServicesRequest = z.infer<typeof specialServicesRequestSchema>;
export type RelocationRequest = z.infer<typeof relocationRequestSchema>;
