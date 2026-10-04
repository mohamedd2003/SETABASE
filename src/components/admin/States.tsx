import type { ReactNode } from "react";
import { AlertTriangleIcon, InboxIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

/** Page header: serif title, one line of help, actions on the end side. */
export function PageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 @xl:flex-row @xl:items-end @xl:justify-between">
      <div>
        <h1 className="font-serif text-2xl font-medium text-foreground">{title}</h1>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {children ? <div className="flex shrink-0 flex-wrap items-center gap-2">{children}</div> : null}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
      <span className="flex size-11 items-center justify-center rounded-full bg-accent text-gold-dark">
        <InboxIcon className="size-5" aria-hidden="true" />
      </span>
      <p className="mt-4 font-serif text-lg font-medium text-foreground">{title}</p>
      {description ? <p className="mt-1 max-w-[40ch] text-sm text-muted-foreground">{description}</p> : null}
      {children ? <div className="mt-5">{children}</div> : null}
    </div>
  );
}

export function ErrorState({ title = "Couldn't load this page", message }: { title?: string; message: string }) {
  return (
    <div role="alert" className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
      <div className="flex items-start gap-3">
        <AlertTriangleIcon className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden="true" />
        <div className="min-w-0">
          <p className="font-medium text-foreground">{title}</p>
          {/* Driver errors carry long host names with no spaces; let them break anywhere. */}
          <p className="mt-1 text-sm wrap-anywhere text-muted-foreground">{message}</p>
          <p className="mt-3 text-sm text-muted-foreground">
            Check that <code className="rounded bg-muted px-1 py-0.5 text-xs">MONGODB_URI</code> is set and the
            database is reachable, then reload.
          </p>
        </div>
      </div>
    </div>
  );
}

/** The message shown when a server read fails — never the raw stack. */
export function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error.";
}

export function TableSkeleton({ rows = 6, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <Skeleton className="h-4 w-40" />
      </div>
      <ul className="divide-y divide-border">
        {Array.from({ length: rows }).map((_, i) => (
          <li key={i} className="grid gap-4 px-4 py-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
            {Array.from({ length: columns }).map((_, j) => (
              <Skeleton key={j} className="h-4" style={{ width: `${55 + ((i + j) % 4) * 12}%` }} />
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function StatsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 @3xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-border bg-card p-4">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="mt-3 h-7 w-12" />
        </div>
      ))}
    </div>
  );
}
