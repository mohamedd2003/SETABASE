import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { relocationStages } from "@/lib/catalog";

const RelocationPackageSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    stage: { type: String, enum: relocationStages, required: true },
    when: { type: String, trim: true },
    shortDescription: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    features: { type: [String], default: [] },
    price: { type: Number, min: 0 },
    priceOnRequest: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export type RelocationPackageDoc = InferSchemaType<typeof RelocationPackageSchema>;

export const RelocationPackageModel =
  (mongoose.models.RelocationPackage as Model<RelocationPackageDoc> | undefined) ??
  mongoose.model<RelocationPackageDoc>("RelocationPackage", RelocationPackageSchema);
