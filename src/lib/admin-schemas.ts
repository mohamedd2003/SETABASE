import { z } from "zod";
import { flexUnits, offerCategories, relocationStages } from "@/lib/catalog";
import { requestServices, requestStatuses } from "@/lib/request-types";

/** Shared by the admin forms and the /api/admin routes so both validate identically. */

const slug = z
  .string()
  .trim()
  .min(2, "Enter a slug.")
  .max(80, "Keep the slug under 80 characters.")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lowercase letters, numbers and hyphens only.");

const money = z.number().min(0, "Can't be negative.").optional();

export const offerItemSchema = z.object({
  name: z.string().trim().min(1, "Name the item.").max(120),
  frequency: z.string().trim().max(40).optional().or(z.literal("")),
  group: z.string().trim().max(60).optional().or(z.literal("")),
  price: money,
  unit: z.enum(flexUnits).optional(),
});

export const offerInputSchema = z.object({
  title: z.string().trim().min(2, "Enter a title.").max(120),
  slug,
  category: z.enum(offerCategories, { error: "Choose a category." }),
  shortDescription: z.string().trim().min(2, "Write a short description.").max(300),
  description: z.string().trim().max(3000).optional().or(z.literal("")),
  items: z.array(offerItemSchema).max(100),
  costPrice: money,
  clientPrice: money,
  pricePerEmployee: money,
  priceOnRequest: z.boolean(),
  isActive: z.boolean(),
  sortOrder: z.number().int().min(0).max(9999),
});

export type OfferInput = z.infer<typeof offerInputSchema>;

export const relocationPackageInputSchema = z.object({
  title: z.string().trim().min(2, "Enter a title.").max(120),
  slug,
  stage: z.enum(relocationStages, { error: "Choose a stage." }),
  when: z.string().trim().max(80).optional().or(z.literal("")),
  shortDescription: z.string().trim().min(2, "Write a short description.").max(300),
  description: z.string().trim().max(3000).optional().or(z.literal("")),
  features: z.array(z.string().trim().min(1, "Write the feature.").max(200)).max(60),
  price: money,
  priceOnRequest: z.boolean(),
  isActive: z.boolean(),
  sortOrder: z.number().int().min(0).max(9999),
});

export type RelocationPackageInput = z.infer<typeof relocationPackageInputSchema>;

export const requestPatchSchema = z
  .object({
    status: z.enum(requestStatuses).optional(),
    adminNotes: z.string().trim().max(5000, "Keep notes under 5000 characters.").optional(),
  })
  .refine((patch) => patch.status !== undefined || patch.adminNotes !== undefined, {
    message: "Nothing to update.",
  });

export const requestsQuerySchema = z.object({
  service: z.enum(requestServices).optional(),
  status: z.enum(requestStatuses).optional(),
  search: z.string().trim().max(120).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type RequestsQuery = z.infer<typeof requestsQuerySchema>;

const memberName = z.string().trim().max(80, "Keep the name under 80 characters.").optional().or(z.literal(""));
const memberEmail = z.email("Enter a valid email address.").transform((value) => value.trim().toLowerCase());
const memberPassword = z.string().min(8, "At least 8 characters.").max(200, "Keep it under 200 characters.");

export const teamMemberCreateSchema = z.object({
  name: memberName,
  email: memberEmail,
  password: memberPassword,
  isActive: z.boolean().default(true),
});

export type TeamMemberCreateInput = z.input<typeof teamMemberCreateSchema>;

/** Any subset; an empty password means "leave it as it is". */
export const teamMemberPatchSchema = z
  .object({
    name: memberName,
    email: memberEmail.optional(),
    password: memberPassword.optional().or(z.literal("")),
    isActive: z.boolean().optional(),
  })
  .refine((patch) => Object.values(patch).some((value) => value !== undefined), {
    message: "Nothing to update.",
  });

export type TeamMemberPatchInput = z.input<typeof teamMemberPatchSchema>;

/** The add/edit form: a password is required for a new member, optional when editing. */
export const teamMemberFormSchema = (mode: "create" | "edit") =>
  z.object({
    name: memberName,
    email: memberEmail,
    password: mode === "create" ? memberPassword : memberPassword.or(z.literal("")),
    isActive: z.boolean(),
  });

export type TeamMemberFormValues = z.input<ReturnType<typeof teamMemberFormSchema>>;

export const loginSchema = z.object({
  email: z.email("Enter your email address."),
  password: z.string().min(1, "Enter your password."),
});

/** Mongo ObjectIds are 24 hex characters. */
export const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "Not a valid id.");
