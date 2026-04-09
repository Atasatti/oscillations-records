"use client";
import React from "react";
import { Play } from "lucide-react";
import { useMusic } from "@/contexts/music-context";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import StreamingLinks from "./StreamingLinks";
import ExplicitBadge from "./ExplicitBadge";

/** Playable track card (former MusicCard) — use for songs/tracks only, not release covers. */
export interface TrackCardTrack {
  id: string | number;
  title: string;
  artist: string;
  primaryArtistName?: string;
  featureArtistNames?: string[];
  duration: string;
  backgroundImage: string;
  avatar?: string;
  audio?: string | null;
  spotifyLink?: string | null;
  appleMusicLink?: string | null;
  tidalLink?: string | null;
  amazonMusicLink?: string | null;
  youtubeLink?: string | null;
  soundcloudLink?: string | null;
  /** Parental advisory — show "E" beside title */
  isrcExplicit?: boolean;
  releaseType?: string;
}

const TrackCard: React.FC<{ track: TrackCardTrack }> = ({ track }) => {
  const { playSong } = useMusic();
  const { data: session, status } = useSession();
  const router = useRouter();

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (status === "unauthenticated" || !session) {
      const currentPath = window.location.pathname;
      router.push(`/login?callbackUrl=${encodeURIComponent(currentPath)}`);
      return;
    }

    if (track.audio) {
      playSong({
        id: String(track.id),
        title: track.title,
        artist:
          track.artist ||
          (track.primaryArtistName
            ? track.featureArtistNames?.length
              ? `${track.primaryArtistName} ft ${track.featureArtistNames.join(", ")}`
              : track.primaryArtistName
            : "Unknown Artist"),
        image: track.backgroundImage,
        audio: track.audio,
        isExplicit: Boolean(track.isrcExplicit),
        releaseType: track.releaseType,
      });
    }
  };

  return (
    <div className="relative flex-shrink-0 w-84 h-100 rounded-2xl overflow-hidden group cursor-pointer">
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
        style={{ backgroundImage: `url(${track.backgroundImage})` }}
      />

      <div className="absolute left-0 right-0 top-0 bottom-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {track.audio && (
        <div className="absolute left-0 right-0 top-0 bottom-16 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button
            onClick={handlePlay}
            className="h-16 w-16 rounded-full bg-[#dc2626] hover:bg-[#ef4444] active:bg-[#991b1b] flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] active:scale-95"
            aria-label="Play track"
          >
            <Play className="w-6 h-6 text-white fill-white ml-1" />
          </button>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute inset-0 p-4 flex flex-col justify-end z-0">
        <div className="text-white">
          <img
            src={track.avatar || "/placeholder.svg"}
            alt={track.artist}
            className="w-8 h-8 rounded-md"
          />
          <h3 className="text-lg font-medium mb-1 mt-1 flex items-center gap-2 flex-wrap">
            <span className="line-clamp-2 min-w-0 flex-1">{track.title}</span>
            {track.isrcExplicit ? <ExplicitBadge size="sm" /> : null}
          </h3>
          {track.primaryArtistName ? (
            <>
              <p className="text-xs text-white/90 line-clamp-2">
                {track.primaryArtistName}
              </p>
              {track.featureArtistNames && track.featureArtistNames.length > 0 ? (
                <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                  ft {track.featureArtistNames.join(", ")}
                </p>
              ) : null}
            </>
          ) : (
            <p className="text-xs text-muted-foreground line-clamp-2">{track.artist}</p>
          )}
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <span>{track.duration}</span>
          </div>
          <StreamingLinks
            spotifyLink={track.spotifyLink}
            appleMusicLink={track.appleMusicLink}
            tidalLink={track.tidalLink}
            amazonMusicLink={track.amazonMusicLink}
            youtubeLink={track.youtubeLink}
            soundcloudLink={track.soundcloudLink}
            className="mt-2"
          />
        </div>
      </div>
    </div>
  );
};

export default TrackCard;
