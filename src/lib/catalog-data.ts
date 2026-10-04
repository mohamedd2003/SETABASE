import type { Types } from "mongoose";
import { connectDb, hasDb } from "@/lib/db";
import {
  toRelocationCatalog,
  toSpecialServicesCatalog,
  type RelocationPackage,
  type SpecialOffer,
} from "@/lib/catalog";
import { fallbackRelocationPackages, fallbackSpecialOffers } from "@/lib/catalog-fallback";
import { RelocationPackageModel, type RelocationPackageDoc } from "@/models/RelocationPackage";
import { SpecialOfferModel, type SpecialOfferDoc } from "@/models/SpecialOffer";

/** Server only: reads the catalog from MongoDB and hands back plain objects. */

export type Lean<T> = T & { _id: Types.ObjectId; createdAt?: Date; updatedAt?: Date };

const iso = (date?: Date) => date?.toISOString();

export function serializeOffer(doc: Lean<SpecialOfferDoc>): SpecialOffer {
  return {
    id: String(doc._id),
    title: doc.title,
    slug: doc.slug,
    category: doc.category,
    shortDescription: doc.shortDescription,
    description: doc.description ?? undefined,
    items: doc.items.map((item) => ({
      name: item.name,
      frequency: item.frequency ?? undefined,
      group: item.group ?? undefined,
      price: item.price ?? undefined,
      unit: item.unit ?? undefined,
    })),
    costPrice: doc.costPrice ?? undefined,
    clientPrice: doc.clientPrice ?? undefined,
    pricePerEmployee: doc.pricePerEmployee ?? undefined,
    priceOnRequest: doc.priceOnRequest ?? false,
    isActive: doc.isActive ?? true,
    sortOrder: doc.sortOrder ?? 0,
    createdAt: iso(doc.createdAt),
    updatedAt: iso(doc.updatedAt),
  };
}

export function serializeRelocationPackage(doc: Lean<RelocationPackageDoc>): RelocationPackage {
  return {
    id: String(doc._id),
    title: doc.title,
    slug: doc.slug,
    stage: doc.stage,
    when: doc.when ?? undefined,
    shortDescription: doc.shortDescription,
    description: doc.description ?? undefined,
    features: [...doc.features],
    price: doc.price ?? undefined,
    priceOnRequest: doc.priceOnRequest ?? true,
    isActive: doc.isActive ?? true,
    sortOrder: doc.sortOrder ?? 0,
    createdAt: iso(doc.createdAt),
    updatedAt: iso(doc.updatedAt),
  };
}

/** Every offer, for the admin. Throws when the database is unavailable. */
export async function loadSpecialOffers(activeOnly = false): Promise<SpecialOffer[]> {
  await connectDb();
  const docs = await SpecialOfferModel.find(activeOnly ? { isActive: true } : {})
    .sort({ sortOrder: 1, createdAt: 1 })
    .lean<Lean<SpecialOfferDoc>[]>();
  return docs.map(serializeOffer);
}

export async function loadRelocationPackages(activeOnly = false): Promise<RelocationPackage[]> {
  await connectDb();
  const docs = await RelocationPackageModel.find(activeOnly ? { isActive: true } : {})
    .sort({ sortOrder: 1, createdAt: 1 })
    .lean<Lean<RelocationPackageDoc>[]>();
  return docs.map(serializeRelocationPackage);
}

/**
 * The active catalog for the public site. Without a database, or when it can't be
 * reached, the pages show the built-in catalog rather than an error.
 */
export async function getPublicSpecialOffers(): Promise<SpecialOffer[]> {
  if (!hasDb()) return fallbackSpecialOffers.filter((o) => o.isActive);
  try {
    return await loadSpecialOffers(true);
  } catch (error) {
    console.error("[catalog] falling back to the built-in offers:", error);
    return fallbackSpecialOffers.filter((o) => o.isActive);
  }
}

export async function getPublicRelocationPackages(): Promise<RelocationPackage[]> {
  if (!hasDb()) return fallbackRelocationPackages.filter((p) => p.isActive);
  try {
    return await loadRelocationPackages(true);
  } catch (error) {
    console.error("[catalog] falling back to the built-in relocation packages:", error);
    return fallbackRelocationPackages.filter((p) => p.isActive);
  }
}

export const getSpecialServicesCatalog = async () => toSpecialServicesCatalog(await getPublicSpecialOffers());
export const getRelocationCatalog = async () => toRelocationCatalog(await getPublicRelocationPackages());
