import type { Metadata } from "next";
import { SplitChoice } from "@/components/SplitChoice";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: `${site.name} — Property, facility, relocation and real estate in New Cairo`,
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${site.name} — Property, facility, relocation and real estate in New Cairo`,
    description: site.description,
    url: "/",
    images: [{ url: "/opengraph-image.jpg", width: 1200, height: 630, alt: `${site.name} Services` }],
  },
};

export default function LandingPage() {
  return <SplitChoice />;
}
