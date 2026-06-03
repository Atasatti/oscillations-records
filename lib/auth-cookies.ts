import type { NextResponse } from "next/server";
import { sessionTokenCookieName } from "@/lib/auth-session";

const useSecureCookies =
  process.env.NEXTAUTH_URL?.startsWith("https://") ?? !!process.env.VERCEL;

const AUTH_COOKIE_BASE_NAMES = [
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
  "next-auth.callback-url",
  "__Secure-next-auth.callback-url",
  "next-auth.csrf-token",
  "__Host-next-auth.csrf-token",
  "next-auth.pkce.code_verifier",
  "__Secure-next-auth.pkce.code_verifier",
  "next-auth.state",
  "__Secure-next-auth.state",
  "next-auth.nonce",
  "__Secure-next-auth.nonce",
];

function expireOptions(domain?: string) {
  return {
    expires: new Date(0),
    maxAge: 0,
    path: "/",
    httpOnly: true,
    secure: useSecureCookies,
    sameSite: "lax" as const,
    ...(domain ? { domain } : {}),
  };
}

/** Domains that may have been used by older auth configs (host-only + shared domain). */
function domainsToClear(): (string | undefined)[] {
  const fromEnv = process.env.NEXTAUTH_COOKIE_DOMAIN?.trim();
  const seen = new Set<string | undefined>();
  const list: (string | undefined)[] = [undefined];
  for (const d of [fromEnv, ".oscillationrecords.com"]) {
    if (d && !seen.has(d)) {
      seen.add(d);
      list.push(d);
    }
  }
  return list;
}

/** Clears NextAuth session cookies (including chunked and legacy domain-scoped cookies). */
export function clearAuthCookiesOnResponse(res: NextResponse): void {
  const activeSessionName = sessionTokenCookieName();
  const names = new Set([...AUTH_COOKIE_BASE_NAMES, activeSessionName]);

  for (const domain of domainsToClear()) {
    for (const name of names) {
      res.cookies.set(name, "", expireOptions(domain));
      for (let i = 0; i < 8; i++) {
        res.cookies.set(`${name}.${i}`, "", expireOptions(domain));
      }
    }
  }
}
