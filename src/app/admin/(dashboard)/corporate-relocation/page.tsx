import type { Metadata } from "next";
import { RelocationView } from "@/components/admin/relocation/RelocationView";
import { ErrorState, errorMessage } from "@/components/admin/States";
import { loadRelocationPackages } from "@/lib/catalog-data";

export const metadata: Metadata = { title: "Corporate Relocation" };

export default async function CorporateRelocationPage() {
  let packages: Awaited<ReturnType<typeof loadRelocationPackages>> | null = null;
  let failure: string | null = null;
  try {
    packages = await loadRelocationPackages();
  } catch (error) {
    failure = errorMessage(error);
  }

  if (!packages) return <ErrorState title="Couldn't load packages" message={failure ?? "Unknown error."} />;
  return <RelocationView packages={packages} />;
}
