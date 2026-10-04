import { PageHeader, TableSkeleton } from "@/components/admin/States";
import { Skeleton } from "@/components/ui/skeleton";

export default function CorporateRelocationLoading() {
  return (
    <div className="grid grid-cols-1 gap-6" aria-busy="true" aria-label="Loading packages">
      <PageHeader
        title="Corporate Relocation"
        description="The stages and extras on the Corporate Relocation page. Changes go live when saved."
      >
        <Skeleton className="h-8 w-32" />
      </PageHeader>
      <Skeleton className="h-8 w-96 max-w-full" />
      <TableSkeleton columns={6} />
    </div>
  );
}
