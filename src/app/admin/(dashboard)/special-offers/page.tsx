import type { Metadata } from "next";
import { OffersView } from "@/components/admin/offers/OffersView";
import { ErrorState, errorMessage } from "@/components/admin/States";
import { loadSpecialOffers } from "@/lib/catalog-data";

export const metadata: Metadata = { title: "Special Offers" };

export default async function SpecialOffersPage() {
  let offers: Awaited<ReturnType<typeof loadSpecialOffers>> | null = null;
  let failure: string | null = null;
  try {
    offers = await loadSpecialOffers();
  } catch (error) {
    failure = errorMessage(error);
  }

  if (!offers) return <ErrorState title="Couldn't load offers" message={failure ?? "Unknown error."} />;
  return <OffersView offers={offers} />;
}
