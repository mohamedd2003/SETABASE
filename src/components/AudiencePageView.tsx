import { ContactSection } from "@/components/ContactSection";
import { Explainer } from "@/components/Explainer";
import { Hero } from "@/components/Hero";
import { MotionLayer } from "@/components/MotionLayer";
import { PhotoHero } from "@/components/PhotoHero";
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
        {page.hero.photos?.length ? (
          <PhotoHero hero={{ ...page.hero, photos: page.hero.photos }} />
        ) : (
          <Hero hero={page.hero} />
        )}
        <ServicesGrid services={page.services} />
        <Explainer explainer={page.explainer} />
        <ContactSection contact={page.contact} />
      </main>
      <SiteFooter />
    </MotionLayer>
  );
}
