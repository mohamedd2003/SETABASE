import { ok } from "@/lib/api";
import { getPublicSpecialOffers } from "@/lib/catalog-data";

/** The active Special Services offers, in display order. Public. */
export async function GET() {
  return ok(await getPublicSpecialOffers());
}
