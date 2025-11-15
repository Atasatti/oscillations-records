import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

async function refreshGoogleAccessToken(token: any) {
  try {
    if (!token.refreshToken) return token;

    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      grant_type: "refresh_token",
      refresh_token: token.refreshToken as string,
    });

    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to refresh Google access token:", response.status, errorText);
      return { ...token, error: "RefreshAccessTokenError" };
    }

    const refreshed = await response.json();

    return {
      ...token,
      accessToken: refreshed.access_token,
      expiresAt: Date.now() + refreshed.expires_in * 1000,
      refreshToken: refreshed.refresh_token ?? token.refreshToken,
    };
  } catch (e) {
    console.error("Error refreshing access token:", e);
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

export const authOptions: AuthOptions = {
  // adapter: PrismaAdapter(prisma), // Temporarily disabled to fix session issues
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile",
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  debug: process.env.NODE_ENV === "development",
  callbacks: {
    async jwt({ token, account }) {
      // On initial sign in
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token ?? token.refreshToken;
        // account.expires_at is in seconds; normalize to ms
        token.expiresAt = account.expires_at ? account.expires_at * 1000 : Date.now() + 60 * 60 * 1000;
        return token;
      }

      // If token is near expiry (< 60s), try to refresh
      if (token.expiresAt && Date.now() > (token.expiresAt as number) - 60 * 1000) {
        return await refreshGoogleAccessToken(token);
      }

      return token;
    },
    async session({ session, token }) {
        if (session.user) {
          session.user.id = token.sub as string;
        }
      
        (session as any).accessToken = token.accessToken;
        (session as any).refreshToken = token.refreshToken;
        (session as any).expiresAt = token.expiresAt;
      
        return session;
      }
      
  },
};

export default NextAuth(authOptions);
