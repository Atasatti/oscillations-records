"use client";
import React, { useRef, useState, useEffect } from "react";
import IconButton from "../local-ui/IconButton";
import MusicCard from "../local-ui/MusicCard";

interface Song {
  id: string;
  title: string;
  artist: string;
  duration: string;
  backgroundImage: string;
  avatar?: string;
  audio?: string | null;
}

interface Single {
  id: string;
  name: string;
  image: string | null;
  audioFile: string;
  duration: number;
  artist: {
    id: string;
    name: string;
    profilePicture: string | null;
  };
}

const NewMusicSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLatestSongs();
  }, []);

  const fetchLatestSongs = async () => {
    try {
      const response = await fetch("/api/songs/latest?limit=8");
      if (response.ok) {
        const data: Single[] = await response.json();
        const formattedSongs: Song[] = data.map((single) => ({
          id: single.id,
          title: single.name,
          artist: single.artist.name,
          duration: formatDuration(single.duration),
          backgroundImage: single.image || "/new-music-img1.svg",
          avatar: single.artist.profilePicture || undefined,
          audio: single.audioFile || null,
        }));
        setSongs(formattedSongs);
      }
    } catch (error) {
      console.error("Error fetching latest songs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="px-[10%] w-full mx-auto py-28">
      <p className="text-8xl tracking-tighter ">New Music, No Compromise.</p>
      <p className="mt-5 text-muted-foreground text-xl">
        From underground hits to future anthems, our releases are about pushing
        boundaries and setting trends.
      </p>
      <div className="flex justify-end mt-4">
        <IconButton text="Listen Now" />
      </div>
      <div className="relative">
        {isLoading ? (
          <div className="flex justify-center items-center mt-10 py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : songs.length === 0 ? (
          <p className="text-center text-muted-foreground mt-10">No songs available yet.</p>
        ) : (
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth mt-10"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {songs.map((song) => (
              <MusicCard key={song.id} song={song} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewMusicSection;
