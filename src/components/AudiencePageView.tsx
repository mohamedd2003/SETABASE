import { ContactSection } from "@/components/ContactSection";
import { Explainer } from "@/components/Explainer";
import { Hero } from "@/components/Hero";
import { PhotoHero } from "@/components/PhotoHero";
import { RevealObserver } from "@/components/RevealObserver";
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
    <>
      <SiteHeader switchLink={page.switchLink} />
      <main className="flex-1">
        {page.hero.photo ? (
          <PhotoHero hero={{ ...page.hero, photo: page.hero.photo }} />
        ) : (
          <Hero hero={page.hero} />
        )}
        <ServicesGrid services={page.services} />
        <Explainer explainer={page.explainer} />
        <ContactSection contact={page.contact} />
      </main>
      <SiteFooter />
      <RevealObserver />
    </>
  );
}
