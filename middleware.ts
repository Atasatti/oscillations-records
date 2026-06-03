import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_EMAIL, getAuthToken } from "@/lib/auth-session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin routes that require specific user access (including benert-remix admin)
  const isAdminRoute = pathname.startsWith("/admin") || pathname.startsWith("/benert-remix/admin");

  // Only protect admin routes - all other pages are public
  if (isAdminRoute) {
    const token = await getAuthToken(request);

    // If user is not authenticated and trying to access admin route, redirect to login
    if (!token) {
      const redirectUrl = new URL("/login", request.url);
      redirectUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // If user is authenticated but not the admin user trying to access admin route, redirect to home
    if (token.email !== ADMIN_EMAIL) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Admin routes that need specific user access
    "/admin/:path*",
    "/benert-remix/admin/:path*"
  ]
};