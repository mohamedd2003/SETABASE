import type { Metadata } from "next";
import { AudiencePageView } from "@/components/AudiencePageView";
import { businessPage } from "@/content/business";

export const metadata: Metadata = {
  title: businessPage.meta.title,
  description: businessPage.meta.description,
  alternates: { canonical: "/business" },
  openGraph: {
    title: businessPage.hero.title,
    description: businessPage.meta.description,
    url: "/business",
    images: [{ url: "/opengraph-image.jpg", width: 1200, height: 630, alt: "SETABASE Services" }],
  },
};

export default function BusinessPage() {
  return <AudiencePageView page={businessPage} />;
}
