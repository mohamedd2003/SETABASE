import { PageHeader, StatsSkeleton, TableSkeleton } from "@/components/admin/States";
import { Skeleton } from "@/components/ui/skeleton";

export default function RequestsLoading() {
  return (
    <div className="grid gap-6" aria-busy="true" aria-label="Loading requests">
      <PageHeader title="Requests" description="Package requests from the website, newest first." />
      <StatsSkeleton />
      <Skeleton className="h-8 w-80 max-w-full" />
      <Skeleton className="h-11 w-full" />
      <TableSkeleton columns={7} />
    </div>
  );
}
