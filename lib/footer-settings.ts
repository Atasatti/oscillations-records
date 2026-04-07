import { prisma } from "@/lib/prisma";

export type FooterSocialLinks = {
  xLink: string | null;
  tiktokLink: string | null;
  youtubeLink: string | null;
  instagramLink: string | null;
  facebookLink: string | null;
  spotifyLink: string | null;
  soundcloudLink: string | null;
};

export async function getFooterSocialLinks(): Promise<FooterSocialLinks> {
  const row = await prisma.siteSettings.findUnique({
    where: { id: "site" },
    select: {
      footerXLink: true,
      footerTiktokLink: true,
      footerYoutubeLink: true,
      footerInstagramLink: true,
      footerFacebookLink: true,
      footerSpotifyLink: true,
      footerSoundcloudLink: true,
    },
  });
  if (!row) {
    return {
      xLink: null,
      tiktokLink: null,
      youtubeLink: null,
      instagramLink: null,
      facebookLink: null,
      spotifyLink: null,
      soundcloudLink: null,
    };
  }
  return {
    xLink: row.footerXLink ?? null,
    tiktokLink: row.footerTiktokLink ?? null,
    youtubeLink: row.footerYoutubeLink ?? null,
    instagramLink: row.footerInstagramLink ?? null,
    facebookLink: row.footerFacebookLink ?? null,
    spotifyLink: row.footerSpotifyLink ?? null,
    soundcloudLink: row.footerSoundcloudLink ?? null,
  };
}

export function normalizeFooterUrl(v: unknown): string | null {
  if (v === undefined || v === null) return null;
  const s = String(v).trim();
  return s === "" ? null : s;
}
