import { ContactForm } from "@/components/ContactForm";
import { site } from "@/content/site";
import type { AudiencePage } from "@/content/types";

type ContactSectionProps = {
  contact: AudiencePage["contact"];
};

export function ContactSection({ contact }: ContactSectionProps) {
  return (
    <section id="contact" className="scroll-mt-16 bg-navy-deep">
      <div className="container-site grid gap-12 py-16 nav:grid-cols-12 nav:gap-16 nav:py-24">
        <div className="nav:col-span-5">
          <h2 className="font-serif text-[1.75rem]/[1.2] font-medium text-gold-gradient sm:text-2xl">
            {contact.title}
          </h2>

          <dl className="mt-10 divide-y divide-line-gold-soft border-y border-line-gold-soft">
            <div className="py-4">
              <dt className="text-sm text-ink-soft">Office</dt>
              <dd className="mt-1 text-ink">
                {site.office.short}
                <span className="block text-sm text-ink-soft">{site.office.full}</span>
              </dd>
            </div>
            <div className="py-4">
              <dt className="text-sm text-ink-soft">Email</dt>
              <dd className="mt-1">
                <a href={`mailto:${site.email}`} className="text-ink transition-colors hover:text-gold">
                  {site.email}
                </a>
              </dd>
            </div>
            <div className="py-4">
              <dt className="text-sm text-ink-soft">Phone</dt>
              <dd className="mt-1">
                <a
                  href={`tel:${site.phone.replace(/\s/g, "")}`}
                  className="text-ink transition-colors hover:text-gold"
                >
                  {site.phone}
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <div className="nav:col-span-7">
          <p className="max-w-[52ch] text-ink-soft">{contact.intro}</p>
          <ContactForm
            interests={contact.interests}
            submitLabel={contact.submit}
            helperText={contact.helper}
          />
        </div>
      </div>
    </section>
  );
}
