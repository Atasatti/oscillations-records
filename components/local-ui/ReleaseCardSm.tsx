"use client";
import React from "react";
import StreamingLinks from "./StreamingLinks";
import ExplicitBadge from "./ExplicitBadge";

/** Public / admin grid card for a release (Single, EP, or Album) — not for individual tracks. */
export interface ReleaseCardSmRelease {
  id: number | string;
  name: string;
  thumbnail?: string | null;
  /** Optional preview audio (e.g. first track); often null for multi-track releases */
  audio?: string | null;
  primaryArtistName?: string;
  featureArtistNames?: string[];
  artist?: string;
  songCount?: number;
  /** Display label */
  kindLabel?: string;
  spotifyLink?: string | null;
  appleMusicLink?: string | null;
  tidalLink?: string | null;
  amazonMusicLink?: string | null;
  youtubeLink?: string | null;
  soundcloudLink?: string | null;
  isrcExplicit?: boolean;
}

const ReleaseCardSm: React.FC<{ release: ReleaseCardSmRelease }> = ({
  release,
}) => {
  return (
    <div
      className="relative rounded-2xl overflow-hidden group cursor-pointer w-full h-full"
      title={release.name}
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
        style={{
          backgroundImage: `url(${release.thumbnail || "/new-music-img1.svg"})`,
        }}
      />

      <div className="absolute left-3 top-3 z-20 rounded-full bg-black/60 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
        {release.kindLabel ?? "Release"}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute inset-0 p-4 flex flex-col justify-end z-0">
        <div className="text-white">
          <h3 className="text-lg font-medium mb-1 mt-1 flex items-center gap-2 flex-wrap">
            <span className="line-clamp-2 min-w-0 flex-1">{release.name}</span>
            {release.isrcExplicit ? <ExplicitBadge size="sm" /> : null}
          </h3>
          {release.primaryArtistName != null && release.primaryArtistName !== "" ? (
            <>
              <p className="text-xs text-white/90 line-clamp-2">
                {release.primaryArtistName}
              </p>
              {release.featureArtistNames && release.featureArtistNames.length > 0 ? (
                <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                  ft {release.featureArtistNames.join(", ")}
                </p>
              ) : null}
            </>
          ) : release.artist ? (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {release.artist}
            </p>
          ) : null}
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            {release.songCount !== undefined ? (
              <span>
                {release.songCount}{" "}
                {release.songCount === 1 ? "Track" : "Tracks"}
              </span>
            ) : null}
          </div>
          <StreamingLinks
            spotifyLink={release.spotifyLink}
            appleMusicLink={release.appleMusicLink}
            tidalLink={release.tidalLink}
            amazonMusicLink={release.amazonMusicLink}
            youtubeLink={release.youtubeLink}
            soundcloudLink={release.soundcloudLink}
            className="mt-2"
          />
        </div>
      </div>
    </div>
  );
};

export default ReleaseCardSm;
