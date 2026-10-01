import type { ServiceId } from "@/content/types";

/*
 * Hairline department icons, drawn after the four badges in the SETABASE logo
 * (house + key, building + gear, house + pin, hand + star) plus a sale sign for Real Estate.
 * Colour comes from `currentColor`.
 */

const paths: Record<ServiceId | "leak", React.ReactNode> = {
  "property-management": (
    <>
      <path d="M5 15 16 6l11 9" />
      <path d="M8 13v13h16V13" />
      <circle cx="16" cy="18.5" r="2.5" />
      <path d="M16 21v4M16 23.5h2" />
    </>
  ),
  "facility-management": (
    <>
      <path d="M6 27V7h12v20" />
      <path d="M9.5 11h5M9.5 15h5M9.5 19h5" />
      <circle cx="23" cy="22" r="3" />
      <path d="M23 16.5v2M23 25.5v2M17.5 22h2M26.5 22h2M19.1 18.1l1.4 1.4M25.5 24.5l1.4 1.4M19.1 25.9l1.4-1.4M25.5 19.5l1.4-1.4" />
      <path d="M3 27h14" />
    </>
  ),
  relocation: (
    <>
      <path d="M4 17l8-7 8 7" />
      <path d="M6 15.5V26h12V15.5" />
      <path d="M24 20s-5-5.2-5-9a5 5 0 0 1 10 0c0 3.8-5 9-5 9z" />
      <circle cx="24" cy="11" r="1.6" />
      <path d="M3 27h26" />
    </>
  ),
  "special-services": (
    <>
      <path d="m16 4 2.6 5.3 5.9.9-4.3 4.1 1 5.8L16 17.4l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" />
      <path d="M4 26c3-2 6-2.4 9-1.4l5 1.6c1.5.4 3 .1 4.4-.9L28 22" />
    </>
  ),
  "real-estate": (
    <>
      <path d="M8 4v24M4 28h8" />
      <path d="M8 8h18v10H8" />
      <path d="M12 13h10" />
    </>
  ),
  leak: <path d="M16 4s7 7.6 7 12.8a7 7 0 0 1-14 0C9 11.6 16 4 16 4z" />,
};

type DepartmentIconProps = {
  id: ServiceId | "leak";
  className?: string;
};

export function DepartmentIcon({ id, className }: DepartmentIconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {paths[id]}
    </svg>
  );
}
