import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't need authentication
  const publicRoutes = ["/login", "/signup"];
  const isPublicRoute = publicRoutes.includes(pathname);

  // Protected routes that require authentication
  const protectedRoutes = ["/", "/about", "/releases", "/contact", "/artists"];
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // Admin routes that require specific user access
  const isAdminRoute = pathname.startsWith("/admin");

  // Get the session token
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });

  // If user is not authenticated and trying to access protected route, redirect to login
  if (!token && isProtectedRoute) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If user is not authenticated and trying to access admin route, redirect to login
  if (!token && isAdminRoute) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If user is authenticated but not the admin user trying to access admin route, redirect to home
  if (token && isAdminRoute && token.email !== "oscillationrecordz@gmail.com") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Temporarily allow authenticated users to access login/signup pages
  // This allows proper sign-out functionality
  // if (token && isPublicRoute && !request.nextUrl.searchParams.get("force")) {
  //   return NextResponse.redirect(new URL("/", request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Protected routes that need authentication
    "/",
    "/about",
    "/contact",
    "/artists/:path*",
    "/releases/:path*",
    // Admin routes that need specific user access
    "/admin/:path*",
    // Auth routes for redirection
    "/login",
    "/signup"
  ]
};