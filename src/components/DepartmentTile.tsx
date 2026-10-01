import Link from "next/link";
import { DepartmentIcon } from "@/components/DepartmentIcon";
import { Eyebrow } from "@/components/Eyebrow";
import type { Department } from "@/content/types";

type DepartmentTileProps = {
  department: Department;
};

/**
 * Department tile — navy-deep fill; the grid cell around it draws the shared gold lines.
 * On hover a gold line sweeps along the top edge and the arrow nudges forward.
 * TODO(pages): point at a dedicated department page once one exists.
 */
export function DepartmentTile({ department }: DepartmentTileProps) {
  return (
    <Link
      href="#contact"
      className="tile-body group relative flex h-full flex-col gap-3 bg-navy-deep p-7 transition-colors duration-500 hover:bg-[color-mix(in_srgb,var(--navy-deep)_82%,var(--navy-medium))] focus-visible:outline-offset-[-2px] nav:p-8"
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gold transition-transform duration-500 ease-out group-hover:scale-x-100 rtl:origin-right"
      />
      <DepartmentIcon
        id={department.id}
        className="mb-3 size-10 text-gold transition-transform duration-500 group-hover:-translate-y-1"
      />
      <Eyebrow>{department.eyebrow}</Eyebrow>
      <h3 className="font-serif text-[1.375rem]/[1.3] font-medium text-white sm:text-xl">
        {department.title}
      </h3>
      <p className="max-w-[48ch] text-sm text-ink-soft">{department.description}</p>
      {department.note ? (
        <p className="font-serif text-base italic text-gold">{department.note}</p>
      ) : null}
      <span className="mt-auto inline-flex items-center gap-2 pt-4 text-sm text-gold">
        Take me there
        <span
          aria-hidden="true"
          className="transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
        >
          →
        </span>
      </span>
    </Link>
  );
}
