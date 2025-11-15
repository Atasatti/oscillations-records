import type { Metadata } from "next";
import { Inter, Lato } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { MusicProvider } from "@/contexts/music-context";
import { MusicPlayer } from "@/components/local-ui/MusicPlayer";
import UserDemographicsCollector from "@/components/user/UserDemographicsCollector";

// Load all weights by omitting `weight`
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"], // All available weights
  display: "swap",
});

export const metadata: Metadata = {
  title: "Oscillation Records",
  description: "A Record Label That Puts Artists First",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${lato.variable} antialiased dark`}>
        <SessionProvider>
          <MusicProvider>
            {children}
            <MusicPlayer />
            <UserDemographicsCollector />
          </MusicProvider>
        </SessionProvider>
      </body>
    </html>
  );
}