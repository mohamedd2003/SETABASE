import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { offerCategoryLabels, relocationStageLabels, type OfferCategory, type RelocationStageKey } from "@/lib/catalog";
import {
  requestServiceLabels,
  requestStatusLabels,
  type RequestService,
  type RequestStatus,
} from "@/lib/request-types";

/** Each status has one colour, used everywhere it appears. Readable on cream. */
const statusClass: Record<RequestStatus, string> = {
  new: "bg-gold/20 text-[#7a5a12]",
  contacted: "bg-[#dbe7f6] text-[#1f4a86]",
  "in-progress": "bg-[#fbe9c8] text-[#8a5a00]",
  closed: "bg-[#dcefe0] text-[#1f6b3a]",
  rejected: "bg-muted text-muted-foreground",
};

export function StatusBadge({ status, className }: { status: RequestStatus; className?: string }) {
  return (
    <Badge variant="secondary" className={cn("border-transparent", statusClass[status], className)}>
      {requestStatusLabels[status]}
    </Badge>
  );
}

export function ServiceBadge({ service }: { service: RequestService }) {
  return (
    <Badge variant="outline" className="border-border text-foreground">
      {requestServiceLabels[service]}
    </Badge>
  );
}

const categoryClass: Record<OfferCategory, string> = {
  delivery: "bg-[#dbe7f6] text-[#1f4a86]",
  services: "bg-[#dcefe0] text-[#1f6b3a]",
  flexible: "bg-gold/20 text-[#7a5a12]",
  event: "bg-[#f3ddf0] text-[#7a2d6e]",
};

export function CategoryBadge({ category }: { category: OfferCategory }) {
  return (
    <Badge variant="secondary" className={cn("border-transparent", categoryClass[category])}>
      {offerCategoryLabels[category]}
    </Badge>
  );
}

const stageClass: Record<RelocationStageKey, string> = {
  "before-moving": "bg-[#dbe7f6] text-[#1f4a86]",
  moving: "bg-[#fbe9c8] text-[#8a5a00]",
  "final-step": "bg-[#dcefe0] text-[#1f6b3a]",
  options: "bg-gold/20 text-[#7a5a12]",
};

export function StageBadge({ stage }: { stage: RelocationStageKey }) {
  return (
    <Badge variant="secondary" className={cn("border-transparent", stageClass[stage])}>
      {relocationStageLabels[stage]}
    </Badge>
  );
}

/** Dates in Cairo time on both server and client, so the markup matches on hydration. */
const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Africa/Cairo",
});
const timeFormat = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Africa/Cairo",
});

export function formatDate(iso: string) {
  return dateFormat.format(new Date(iso));
}

export function formatDateTime(iso: string) {
  const date = new Date(iso);
  return `${dateFormat.format(date)}, ${timeFormat.format(date)}`;
}
