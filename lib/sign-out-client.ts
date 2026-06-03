import { signOut as nextAuthSignOut } from "next-auth/react";

/**
 * Full sign-out: NextAuth handler clears the session, then we remove any legacy
 * cookies that older configs may have left behind.
 */
export async function signOutCompletely(callbackUrl = "/"): Promise<void> {
  await nextAuthSignOut({ callbackUrl, redirect: false });

  try {
    await fetch("/api/auth/clear-session", {
      method: "POST",
      credentials: "include",
    });
  } catch (e) {
    console.error("Failed to clear legacy auth cookies", e);
  }

  window.location.href = callbackUrl;
}
