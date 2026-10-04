import { ok } from "@/lib/api";
import { getPublicRelocationPackages } from "@/lib/catalog-data";

/** The active Corporate Relocation packages, in display order. Public. */
export async function GET() {
  return ok(await getPublicRelocationPackages());
}
