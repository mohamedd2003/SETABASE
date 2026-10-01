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
  },
};

export default function BusinessPage() {
  return <AudiencePageView page={businessPage} />;
}
