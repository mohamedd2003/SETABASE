import { PageHeader, TableSkeleton } from "@/components/admin/States";
import { Skeleton } from "@/components/ui/skeleton";

export default function SpecialOffersLoading() {
  return (
    <div className="grid grid-cols-1 gap-6" aria-busy="true" aria-label="Loading offers">
      <PageHeader title="Special Offers" description="The packages on the Special Services page. Changes go live when saved.">
        <Skeleton className="h-8 w-28" />
      </PageHeader>
      <TableSkeleton columns={6} />
    </div>
  );
}
