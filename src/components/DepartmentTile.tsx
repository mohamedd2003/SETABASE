import Link from "next/link";
import { Eyebrow } from "@/components/Eyebrow";
import type { Department } from "@/content/types";

type DepartmentTileProps = {
  department: Department;
};

/**
 * Department tile — navy-deep fill, 1px gold border shared with its neighbours in the grid.
 * The whole tile links to the contact form.
 * TODO(pages): point at a dedicated department page once one exists.
 */
export function DepartmentTile({ department }: DepartmentTileProps) {
  return (
    <Link
      href="#contact"
      className="group flex flex-col gap-3 border-e border-b border-line-gold-soft bg-navy-deep p-7 transition-colors hover:bg-[color-mix(in_srgb,var(--navy-deep)_85%,var(--navy-medium))] focus-visible:outline-offset-[-2px]"
    >
      <Eyebrow>{department.eyebrow}</Eyebrow>
      <h3 className="font-serif text-[1.375rem]/[1.3] font-medium text-white sm:text-xl">
        {department.title}
      </h3>
      <p className="text-sm text-ink-soft">{department.description}</p>
      {department.note ? (
        <p className="font-serif text-base italic text-gold">{department.note}</p>
      ) : null}
      <span className="mt-auto pt-4 text-sm text-gold transition-colors group-hover:text-white">
        Take me there →
      </span>
    </Link>
  );
}
