import type { Metadata } from "next";
import { AudiencePageView } from "@/components/AudiencePageView";
import { privatePage } from "@/content/private";

export const metadata: Metadata = {
  title: privatePage.meta.title,
  description: privatePage.meta.description,
  alternates: { canonical: "/private" },
  openGraph: {
    title: privatePage.hero.title,
    description: privatePage.meta.description,
    url: "/private",
  },
};

export default function PrivatePage() {
  return <AudiencePageView page={privatePage} />;
}
