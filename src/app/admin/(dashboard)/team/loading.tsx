import { PageHeader, TableSkeleton } from "@/components/admin/States";
import { Skeleton } from "@/components/ui/skeleton";

export default function TeamLoading() {
  return (
    <div className="grid grid-cols-1 gap-6" aria-busy="true" aria-label="Loading the team">
      <PageHeader title="Team" description="Everyone who can sign in to this dashboard.">
        <Skeleton className="h-8 w-32" />
      </PageHeader>
      <TableSkeleton columns={4} rows={4} />
    </div>
  );
}
