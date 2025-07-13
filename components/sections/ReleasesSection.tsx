"use client";
import React, { useState } from "react";
import MusicCardSm from "../local-ui/MusicCardSm";

interface Song {
  id: number;
  title: string;
  artist: string;
  duration: string;
  avatar?: string;
  backgroundImage: string;
}

const mockSongs: Song[] = [
  {
    id: 1,
    title: "Best Song Ever",
    artist: "John Doe",
    duration: "1:03",
    avatar: "/artist-avatar.svg?height=40&width=40",
    backgroundImage: "/new-music-img1.svg",
  },
  {
    id: 2,
    title: "Best Song Ever",
    artist: "John Doe",
    duration: "1:03",
    avatar: "/artist-avatar.svg?height=40&width=40",
    backgroundImage: "/new-music-img3.svg",
  },
  {
    id: 3,
    title: "Best Song Ever",
    artist: "John Doe",
    duration: "1:03",
    avatar: "/artist-avatar.svg?height=40&width=40",
    backgroundImage: "/new-music-img2.svg",
  },
  {
    id: 4,
    title: "Best Song Ever",
    artist: "John Doe",
    duration: "1:03",
    avatar: "/artist-avatar.svg?height=40&width=40",
    backgroundImage: "/new-music-img4.svg",
  },
  {
    id: 5,
    title: "Best Song Ever",
    artist: "John Doe",
    duration: "1:03",
    avatar: "/artist-avatar.svg?height=40&width=40",
    backgroundImage: "/new-music-img1.svg",
  },
  {
    id: 6,
    title: "Best Song Ever",
    artist: "John Doe",
    duration: "1:03",
    avatar: "/artist-avatar.svg?height=40&width=40",
    backgroundImage: "/new-music-img2.svg",
  },
  {
    id: 7,
    title: "Best Song Ever",
    artist: "John Doe",
    duration: "1:03",
    avatar: "/artist-avatar.svg?height=40&width=40",
    backgroundImage: "/new-music-img3.svg",
  },
  {
    id: 8,
    title: "Best Song Ever",
    artist: "John Doe",
    duration: "1:03",
    avatar: "/artist-avatar.svg?height=40&width=40",
    backgroundImage: "/new-music-img4.svg",
  },
];

const dateFilters = ["All", "2024", "2025", "2023", "2022"];
const ReleasesSection = () => {
  const [selectedFilter, setSelectedFilter] = useState("All");

  return (
    <div className=" px-[10%] w-full mx-auto py-14">
      <p className="text-xs uppercase tracking-wider text-center text-muted-foreground">
        All releases
      </p>
      <p className="font-light text-5xl text-center tracking-tighter mt-3">
        987 Releases
      </p>

        <div className="flex gap-6 md:gap-8 mt-8">
          {dateFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`text-sm font-medium transition-colors duration-200 text-muted-foreground cursor-pointer ${
                selectedFilter === filter
                 && "text-primary"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      <div className="flex gap-5 items-center flex-wrap mt-14">
        {mockSongs.map((song) => (
          <MusicCardSm key={song.id} song={song} />
        ))}
      </div>
    </div>
  );
};

export default ReleasesSection;
