import { NextResponse } from "next/server";
import { sessionTokenCookieName } from "@/lib/auth-session";

// Force dynamic rendering - prevent static generation
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const useSecureCookies =
  process.env.NEXTAUTH_URL?.startsWith("https://") ?? !!process.env.VERCEL;

export async function POST() {
  try {
    const response = NextResponse.json({ success: true });
    const cookieOptions = {
      expires: new Date(0),
      path: "/",
      httpOnly: true,
      secure: useSecureCookies,
      sameSite: "lax" as const,
    };

    response.cookies.set(sessionTokenCookieName(), "", cookieOptions);

    // Clear legacy non-prefixed cookie if production previously set the wrong name
    if (useSecureCookies) {
      response.cookies.set("next-auth.session-token", "", cookieOptions);
    }

    const csrfName = useSecureCookies
      ? "__Host-next-auth.csrf-token"
      : "next-auth.csrf-token";
    response.cookies.set(csrfName, "", cookieOptions);
    if (useSecureCookies) {
      response.cookies.set("next-auth.csrf-token", "", cookieOptions);
    }

    return response;
  } catch (error) {
    console.error("Error signing out:", error);
    return NextResponse.json(
      { error: "Failed to sign out" },
      { status: 500 }
    );
  }
}

