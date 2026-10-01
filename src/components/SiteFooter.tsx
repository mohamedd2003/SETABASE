import { Logo } from "@/components/Logo";
import { site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-line-gold-soft">
      <div className="container-site flex flex-col gap-6 py-10 nav:flex-row nav:items-end nav:justify-between">
        <div className="flex flex-col gap-3">
          <Logo size="sm" />
          <p className="text-sm text-ink-soft">{site.departmentsLine}</p>
        </div>
        <div className="flex flex-col gap-1 text-sm text-ink-soft nav:text-end">
          <p>{site.office.full}</p>
          <p>
            © {new Date().getFullYear()} {site.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
