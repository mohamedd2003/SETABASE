import { AudienceHero } from "@/components/AudienceHero";
import { ContactSection } from "@/components/ContactSection";
import { Explainer } from "@/components/Explainer";
import { MotionLayer } from "@/components/MotionLayer";
import { ServicesGrid } from "@/components/ServicesGrid";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import type { AudiencePage } from "@/content/types";

type AudiencePageViewProps = {
  page: AudiencePage;
};

/** Both audience pages render from their content object through the same components. */
export function AudiencePageView({ page }: AudiencePageViewProps) {
  return (
    <MotionLayer>
      <SiteHeader switchLink={page.switchLink} />
      <main className="flex-1">
        <AudienceHero hero={page.hero} />
        <ServicesGrid services={page.services} />
        <Explainer explainer={page.explainer} />
        <ContactSection contact={page.contact} />
      </main>
      <SiteFooter />
    </MotionLayer>
  );
}
