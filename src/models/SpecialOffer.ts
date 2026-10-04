import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { flexUnits, offerCategories } from "@/lib/catalog";

const ItemSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    frequency: { type: String, trim: true },
    group: { type: String, trim: true },
    price: { type: Number, min: 0 },
    unit: { type: String, enum: flexUnits },
  },
  { _id: false },
);

const SpecialOfferSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    category: { type: String, enum: offerCategories, required: true },
    shortDescription: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    items: { type: [ItemSchema], default: [] },
    costPrice: { type: Number, min: 0 },
    clientPrice: { type: Number, min: 0 },
    pricePerEmployee: { type: Number, min: 0 },
    priceOnRequest: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export type SpecialOfferDoc = InferSchemaType<typeof SpecialOfferSchema>;

export const SpecialOfferModel =
  (mongoose.models.SpecialOffer as Model<SpecialOfferDoc> | undefined) ??
  mongoose.model<SpecialOfferDoc>("SpecialOffer", SpecialOfferSchema);
