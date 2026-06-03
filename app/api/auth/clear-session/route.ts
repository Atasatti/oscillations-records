import { NextResponse } from "next/server";
import { clearAuthCookiesOnResponse } from "@/lib/auth-cookies";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Clears leftover auth cookies (e.g. after legacy sign-out or domain-scoped cookies). */
export async function POST() {
  const response = NextResponse.json({ ok: true });
  clearAuthCookiesOnResponse(response);
  return response;
}
