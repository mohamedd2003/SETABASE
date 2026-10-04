import { cookies } from "next/headers";
import { ok } from "@/lib/api";
import { AUTH_COOKIE } from "@/lib/auth";

export async function POST() {
  (await cookies()).delete(AUTH_COOKIE);
  return ok({ signedOut: true });
}
