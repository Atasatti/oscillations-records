import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin routes that require specific user access (including benert-remix admin)
  const isAdminRoute = pathname.startsWith("/admin") || pathname.startsWith("/benert-remix/admin");

  // Only protect admin routes - all other pages are public
  if (isAdminRoute) {
    // Get the session token
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });

    // If user is not authenticated and trying to access admin route, redirect to login
    if (!token) {
      const redirectUrl = new URL("/login", request.url);
      redirectUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // If user is authenticated but not the admin user trying to access admin route, redirect to home
    if (token.email !== "oscillationrecordz@gmail.com") {
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