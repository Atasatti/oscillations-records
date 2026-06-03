import type { NextRequest } from "next/server";
import { getToken, type JWT } from "next-auth/jwt";

export const ADMIN_EMAIL = "oscillationrecordz@gmail.com";

/** Must match NextAuth default session cookie names (see next-auth/core/lib/cookie). */
export function sessionTokenCookieName(): string {
  const useSecureCookies =
    process.env.NEXTAUTH_URL?.startsWith("https://") ?? !!process.env.VERCEL;
  return useSecureCookies
    ? "__Secure-next-auth.session-token"
    : "next-auth.session-token";
}

export async function getAuthToken(
  req: NextRequest
): Promise<JWT | null> {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    console.error("NEXTAUTH_SECRET is not configured");
    return null;
  }

  return getToken({
    req,
    secret,
    cookieName: sessionTokenCookieName(),
  });
}
