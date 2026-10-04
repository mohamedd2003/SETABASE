import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { requestServices, requestStatuses } from "@/lib/request-types";

export type { RequestService, RequestStatus } from "@/lib/request-types";

const EstimateSchema = new Schema(
  {
    subtotal: Number,
    bundleDiscount: Number,
    volumeDiscount: Number,
    volumeRate: Number,
    monthly: Number,
    perHire: Number,
  },
  { _id: false },
);

/**
 * A package request from the website. The ids point at the catalog as it was when the
 * request came in; `selection` keeps the labels so the dashboard still reads well after a
 * package is renamed or removed.
 */
const RequestSchema = new Schema(
  {
    service: { type: String, enum: requestServices, required: true },
    status: { type: String, enum: requestStatuses, default: "new" },
    contact: {
      type: new Schema(
        {
          name: { type: String, required: true, trim: true },
          company: { type: String, trim: true },
          email: { type: String, required: true, trim: true, lowercase: true },
          phone: { type: String, trim: true },
          message: { type: String, trim: true },
        },
        { _id: false },
      ),
      required: true,
    },
    /** Employees at the office, or people relocating. */
    employees: { type: Number, min: 1 },
    packages: { type: [String], default: [] },
    flexItems: { type: [String], default: [] },
    eventIdeas: { type: [String], default: [] },
    contractLength: { type: String },
    stages: { type: [String], default: [] },
    options: { type: [String], default: [] },
    movingFrom: { type: String, trim: true },
    destination: { type: String, trim: true },
    arrival: { type: String, trim: true },
    selection: {
      type: [{ label: { type: String, required: true }, detail: String, _id: false }],
      default: [],
    },
    estimate: { type: EstimateSchema },
    adminNotes: { type: String, trim: true },
  },
  { timestamps: true },
);

RequestSchema.index({ createdAt: -1 });
RequestSchema.index({ service: 1, status: 1 });

export type RequestDoc = InferSchemaType<typeof RequestSchema>;

export const RequestModel =
  (mongoose.models.Request as Model<RequestDoc> | undefined) ??
  mongoose.model<RequestDoc>("Request", RequestSchema);
