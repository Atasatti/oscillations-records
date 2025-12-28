import { NextResponse } from "next/server";

// Force dynamic rendering - prevent static generation
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST() {
  try {
    // Clear the session by setting a cookie with an expired date
    const response = NextResponse.json({ success: true });
    
    // Clear the NextAuth session cookie
    response.cookies.set("next-auth.session-token", "", {
      expires: new Date(0),
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    // Also clear the callback cookie
    response.cookies.set("next-auth.csrf-token", "", {
      expires: new Date(0),
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Error signing out:", error);
    return NextResponse.json(
      { error: "Failed to sign out" },
      { status: 500 }
    );
  }
}

