import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE, verifySession } from "@/lib/auth";

/**
 * Keeps /admin behind the login. An optimistic check only — it verifies the token's
 * signature; the dashboard layout and every /api/admin route also confirm the account
 * still exists.
 */
export async function proxy(request: NextRequest) {
  const { pathname, search, searchParams } = request.nextUrl;
  const session = await verifySession(request.cookies.get(AUTH_COOKIE)?.value);

  if (pathname === "/admin/login") {
    // Sent here by the dashboard when the account behind a valid token is gone or was
    // signed out: drop the cookie and show the form, rather than bouncing back.
    if (searchParams.has("reason")) {
      const response = NextResponse.next();
      response.cookies.delete(AUTH_COOKIE);
      return response;
    }
    return session ? NextResponse.redirect(new URL("/admin/requests", request.url)) : NextResponse.next();
  }

  if (!session) {
    const login = new URL("/admin/login", request.url);
    login.searchParams.set("next", pathname + search);
    const response = NextResponse.redirect(login);
    // A stale or forged cookie is dropped so the login page starts clean.
    response.cookies.delete(AUTH_COOKIE);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
