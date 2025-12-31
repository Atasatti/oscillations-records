import NextAuth, { AuthOptions, Session, JWT } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

interface ExtendedToken extends JWT {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  error?: string;
  [key: string]: unknown;
}

async function refreshGoogleAccessToken(token: ExtendedToken): Promise<JWT> {
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
      return { ...token, error: "RefreshAccessTokenError" } as JWT;
    }

    const refreshed = await response.json();

    return {
      ...token,
      accessToken: refreshed.access_token,
      expiresAt: Date.now() + refreshed.expires_in * 1000,
      refreshToken: refreshed.refresh_token ?? token.refreshToken,
    } as JWT;
  } catch (e) {
    console.error("Error refreshing access token:", e);
    return { ...token, error: "RefreshAccessTokenError" } as JWT;
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
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
  },
  debug: process.env.NODE_ENV === "development",
  useSecureCookies: process.env.NEXTAUTH_URL?.startsWith("https://") ?? false,
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NEXTAUTH_URL?.startsWith("https://") ?? false,
      },
    },
  },
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, account }): Promise<any> {
      const extendedToken = token as ExtendedToken;
      // On initial sign in
      if (account) {
        extendedToken.accessToken = account.access_token;
        extendedToken.refreshToken = account.refresh_token ?? extendedToken.refreshToken;
        // account.expires_at is in seconds; normalize to ms
        extendedToken.expiresAt = account.expires_at ? account.expires_at * 1000 : Date.now() + 60 * 60 * 1000;
        return token;
      }

      // If token is near expiry (< 60s), try to refresh
      if (extendedToken.expiresAt && Date.now() > extendedToken.expiresAt - 60 * 1000) {
        return await refreshGoogleAccessToken(extendedToken);
      }

      return token;
    },
    async session({ session, token }) {
        const extendedToken = token as ExtendedToken;
        if (session.user) {
          session.user.id = extendedToken.sub as string;
        }
      
        (session as Session & { accessToken?: string; refreshToken?: string; expiresAt?: number }).accessToken = extendedToken.accessToken;
        (session as Session & { accessToken?: string; refreshToken?: string; expiresAt?: number }).refreshToken = extendedToken.refreshToken;
        (session as Session & { accessToken?: string; refreshToken?: string; expiresAt?: number }).expiresAt = extendedToken.expiresAt;
      
        return session;
      }
      
  },
};

export default NextAuth(authOptions);
