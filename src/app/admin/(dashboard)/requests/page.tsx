import type { Metadata } from "next";
import { RequestsView } from "@/components/admin/requests/RequestsView";
import { ErrorState, errorMessage } from "@/components/admin/States";
import { requestsQuerySchema } from "@/lib/admin-schemas";
import { listRequests } from "@/lib/requests-data";

export const metadata: Metadata = { title: "Requests" };

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function RequestsPage({ searchParams }: Props) {
  const raw = await searchParams;
  const single = Object.fromEntries(
    Object.entries(raw).flatMap(([key, value]) => {
      const first = Array.isArray(value) ? value[0] : value;
      return first ? [[key, first]] : [];
    }),
  );
  // Anything odd in the URL falls back to the default view rather than an error.
  const parsed = requestsQuerySchema.safeParse(single);
  const query = parsed.success ? parsed.data : requestsQuerySchema.parse({});

  let data: Awaited<ReturnType<typeof listRequests>> | null = null;
  let failure: string | null = null;
  try {
    data = await listRequests(query);
  } catch (error) {
    failure = errorMessage(error);
  }

  if (!data) return <ErrorState title="Couldn't load requests" message={failure ?? "Unknown error."} />;
  return <RequestsView data={data} query={query} />;
}
