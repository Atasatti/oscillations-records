"use client";
import React from "react";
import { Play } from "lucide-react";
import { useMusic } from "@/contexts/music-context";

interface Song {
  id: string | number;
  title: string;
  artist: string;
  duration: string;
  backgroundImage: string;
  avatar?: string;
  audio?: string | null;
}

const MusicCard: React.FC<{ song: Song }> = ({ song }) => {
  const { playSong } = useMusic();

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (song.audio) {
      playSong({
        id: String(song.id),
        title: song.title,
        artist: song.artist,
        image: song.backgroundImage,
        audio: song.audio,
      });
    }
  };

  return (
    <div className="relative flex-shrink-0 w-84 h-100 rounded-2xl overflow-hidden group cursor-pointer">
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
        style={{ backgroundImage: `url(${song.backgroundImage})` }}
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
          <img
            src={song.avatar || "/placeholder.svg"}
            alt={song.artist}
            className="w-8 h-8 rounded-md"
          />
          <h3 className="text-lg font-medium mb-1 line-clamp-2 mt-1">
            {song.title}
          </h3>
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <span>{song.artist}</span>
            <span>{song.duration}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicCard;
