import React from "react";

interface Song {
  id: number;
  title: string;
  artist: string;
  duration: string;
  backgroundImage: string;
  avatar?: string;
}

const MusicCardSm: React.FC<{ song: Song }> = ({ song }) => {
  return (
    <div className="relative flex-shrink-0 w-72 h-84 rounded-2xl overflow-hidden group cursor-pointer">
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
        style={{ backgroundImage: `url(${song.backgroundImage})` }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute inset-0 p-4 flex flex-col justify-end">
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

export default MusicCardSm;
