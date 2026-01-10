"use client";
import React from "react";
import { Play } from "lucide-react";
import { useMusic } from "@/contexts/music-context";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Song {
  id: number | string;
  name: string;
  thumbnail?: string | null;
  audio?: string | null;
  artist?: string;
  songCount?: number;
}

const MusicCardSm: React.FC<{ song: Song }> = ({ song }) => {
  const { playSong } = useMusic();
  const { data: session, status } = useSession();
  const router = useRouter();

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Check if user is authenticated
    if (status === "unauthenticated" || !session) {
      // Redirect to login with callback URL
      const currentPath = window.location.pathname;
      router.push(`/login?callbackUrl=${encodeURIComponent(currentPath)}`);
      return;
    }

    if (song.audio) {
      playSong({
        id: String(song.id),
        title: song.name,
        artist: song.artist || "Unknown Artist",
        image: song.thumbnail || null,
        audio: song.audio,
      });
    }
  };

  return (
    <div
      className="relative rounded-2xl overflow-hidden group cursor-pointer w-full h-full"
      title={song.name}
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
        style={{
          backgroundImage: `url(${song.thumbnail || "/new-music-img1.svg"})`,
        }}
      />

      {/* Transparent overlay on hover - no color */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Play button - appears on hover */}
      {song.audio && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button
            onClick={handlePlay}
            className="h-16 w-16 rounded-full bg-[#dc2626] hover:bg-[#ef4444] active:bg-[#991b1b] flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] active:scale-95"
            aria-label="Play song"
          >
            <Play className="w-6 h-6 text-white fill-white ml-1" />
          </button>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute inset-0 p-4 flex flex-col justify-end z-0">
        <div className="text-white">
          <h3 className="text-lg font-medium mb-1 line-clamp-2 mt-1">
            {song.name}
          </h3>
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            {song.songCount !== undefined ? (
              <span>
                {song.songCount} {song.songCount === 1 ? "Song" : "Songs"}
              </span>
            ) : (
              !song.audio && <span>No audio found</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicCardSm;
