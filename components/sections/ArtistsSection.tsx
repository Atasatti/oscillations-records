"use client";
import React, { useState } from "react";
import ArtistCard from "../local-ui/ArtistCard";

const dateFilters = ["All", "2024", "2025", "2023", "2022"];

interface Artist {
  id: number;
  artist: string;
  description: string;
  backgroundImage?: string;
}

const mockArtists: Artist[] = [
  {
    id: 1,
    artist: "John Doe",
    description: "With a passion for music that transcends boundaries, we are dedicated to ...",
  },
 {
    id: 2,
    artist: "John Doe",
    description: "With a passion for music that transcends boundaries, we are dedicated to ...",
  },
 {
    id: 3,
    artist: "John Doe",
    description: "With a passion for music that transcends boundaries, we are dedicated to ...",
  },
{
    id: 4,
    artist: "John Doe",
    description: "With a passion for music that transcends boundaries, we are dedicated to ...",
  },
{
    id: 5,
    artist: "John Doe",
    description: "With a passion for music that transcends boundaries, we are dedicated to ...",
  },
{
    id: 6,
    artist: "John Doe",
    description: "With a passion for music that transcends boundaries, we are dedicated to ...",
  },
{
    id: 7,
    artist: "John Doe",
    description: "With a passion for music that transcends boundaries, we are dedicated to ...",
  },
{
    id: 8,
    artist: "John Doe",
    description: "With a passion for music that transcends boundaries, we are dedicated to ...",
  },
{
    id: 9,
    artist: "John Doe",
    description: "With a passion for music that transcends boundaries, we are dedicated to ...",
  },
{
    id: 10,
    artist: "John Doe",
    description: "With a passion for music that transcends boundaries, we are dedicated to ...",
  },]
const ArtistsSection = () => {
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
              selectedFilter === filter && "text-primary"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="flex gap-5 items-center flex-wrap mt-14">
        {mockArtists.map((artist) => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </div>
    </div>
  );
};

export default ArtistsSection;
