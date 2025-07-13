"use client";
import React, { useRef } from "react";
import IconButton from "../local-ui/IconButton";
import MusicCard from "../local-ui/MusicCard";

interface Song {
  id: number;
  title: string;
  artist: string;
  duration: string;
  backgroundImage: string;
  avatar: string;
}

const songs: Song[] = [
  {
    id: 1,
    title: "Best Song Ever",
    artist: "John Doe",
    duration: "1:03",
    backgroundImage: "/new-music-img1.svg",
    avatar: "/artist-avatar.svg?height=40&width=40",
  },
  {
    id: 2,
    title: "I am in Space",
    artist: "John Doe",
    duration: "1:09",
    backgroundImage: "/new-music-img2.svg",
    avatar: "/artist-avatar.svg?height=40&width=40",
  },
  {
    id: 3,
    title: "Best Song Ever",
    artist: "John Doe",
    duration: "1:03",
    backgroundImage: "/new-music-img3.svg",
    avatar: "/artist-avatar.svg?height=40&width=40",
  },
  {
    id: 4,
    title: "Ocean Waves",
    artist: "John Doe",
    duration: "2:15",
    backgroundImage: "/new-music-img4.svg",
    avatar: "/artist-avatar.svg?height=40&width=40",
  },
  {
    id: 5,
    title: "Red Mask",
    artist: "John Doe",
    duration: "1:45",
    backgroundImage: "/new-music-img4.svg",
    avatar: "/artist-avatar.svg?height=40&width=40",
  },
];


const NewMusicSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
        {/* Scrollable Cards */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth mt-10"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {songs.map((song) => (
            <MusicCard key={song.id} song={song} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewMusicSection;
