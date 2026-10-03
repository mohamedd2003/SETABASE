import type { Metadata } from "next";
import { MotionLayer } from "@/components/MotionLayer";
import { PackageHero } from "@/components/packages/PackageHero";
import { RelocationPlanner } from "@/components/packages/RelocationPlanner";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const description =
  "Corporate relocation to Egypt: housing, the move itself and settling in, handled by one team. Choose the stages you need and get a quote.";

export const metadata: Metadata = {
  title: "Corporate Relocation packages",
  description,
  alternates: { canonical: "/business/relocation" },
  openGraph: {
    title: "Corporate Relocation packages — SETABASE",
    description,
    url: "/business/relocation",
    images: [{ url: "/opengraph-image.jpg", width: 1200, height: 630, alt: "SETABASE Services" }],
  },
};

export default function RelocationPage() {
  return (
    <MotionLayer>
      <SiteHeader
        switchLink={{ label: "All business services", href: "/business" }}
        navLinks={[
          { label: "Packages", href: "#packages" },
          { label: "Request", href: "#request" },
        ]}
      />
      <main className="flex-1">
        <PackageHero
          service="relocation"
          audience="Corporate Relocation, for employers"
          title="Your new hire lands in Egypt with a home to go to."
          paragraph="We find the district and the house, move the household door to door, and get the bank, phone and utilities running — so your employee starts work, not paperwork."
          facts={[
            "One point of contact for the whole move",
            "Three moving offers to compare",
            "Rent short term, long term, or buy",
          ]}
          cta="Choose your stages"
        />
        <RelocationPlanner />
      </main>
      <SiteFooter />
    </MotionLayer>
  );
}
