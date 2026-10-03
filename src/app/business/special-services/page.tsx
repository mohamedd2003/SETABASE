import type { Metadata } from "next";
import { MotionLayer } from "@/components/MotionLayer";
import { PackageHero } from "@/components/packages/PackageHero";
import { SpecialServicesPlanner } from "@/components/packages/SpecialServicesPlanner";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const description =
  "Office supplies, wellness and team events for companies in Egypt, as monthly packages priced per employee. Choose yours and get a quote within a business day.";

export const metadata: Metadata = {
  title: "Special Services packages",
  description,
  alternates: { canonical: "/business/special-services" },
  openGraph: {
    title: "Special Services packages — SETABASE",
    description,
    url: "/business/special-services",
    images: [{ url: "/opengraph-image.jpg", width: 1200, height: 630, alt: "SETABASE Services" }],
  },
};

export default function SpecialServicesPage() {
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
          service="special-services"
          audience="Special Services, for workplaces"
          title="An office that looks after the people in it."
          paragraph="Supplies restocked, fruit on the table, a coach on Tuesdays and an iftar in Ramadan — chosen as monthly packages and run by one team."
          facts={[
            "From 615 EGP per employee a month",
            "Start with a one-month trial",
            "10% off when you take two or more packages",
          ]}
          cta="Choose your packages"
        />
        <SpecialServicesPlanner />
      </main>
      <SiteFooter />
    </MotionLayer>
  );
}
