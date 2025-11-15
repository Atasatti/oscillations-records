"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import MusicCardSm from "../local-ui/MusicCardSm";

interface Release {
  id: string;
  name: string;
  thumbnail?: string | null;
  audio?: string | null;
  type: 'album' | 'ep';
  artist: string;
  artistId: string;
  releaseDate: string | null;
  createdAt: string;
  year: string;
  songCount: number;
}

const ReleasesSection = () => {
  const router = useRouter();
  const [releases, setReleases] = useState<Release[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("All");

  const handleReleaseClick = (release: Release) => {
    router.push(`/releases/${release.id}`);
  };

  useEffect(() => {
    fetchReleases();
  }, []);

  const fetchReleases = async () => {
    try {
      const response = await fetch("/api/releases");
      if (response.ok) {
        const data = await response.json();
        setReleases(data);
      }
    } catch (error) {
      console.error("Error fetching releases:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get unique years from releases and sort them
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    releases.forEach(release => {
      if (release.year) {
        years.add(release.year);
      }
    });
    return Array.from(years).sort((a, b) => parseInt(b) - parseInt(a));
  }, [releases]);

  // Filter releases by selected year
  const filteredReleases = useMemo(() => {
    if (selectedFilter === "All") {
      return releases;
    }
    return releases.filter(release => release.year === selectedFilter);
  }, [releases, selectedFilter]);

  // Combine "All" with available years for filters
  const dateFilters = ["All", ...availableYears];

  if (isLoading) {
    return (
      <div className="px-[10%] w-full mx-auto py-14">
        <p className="text-xs uppercase tracking-wider text-center text-muted-foreground">
          All releases
        </p>
        <div className="flex justify-center items-center mt-10 py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-[10%] w-full mx-auto py-14">
      <p className="text-xs uppercase tracking-wider text-center text-muted-foreground">
        All releases
      </p>
      <p className="font-light text-5xl text-center tracking-tighter mt-3">
        {filteredReleases.length} {filteredReleases.length === 1 ? 'Release' : 'Releases'}
      </p>
      <div className="flex gap-6 md:gap-8 mt-8 justify-center flex-wrap">
        {dateFilters.map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={`text-sm font-medium transition-colors duration-200 cursor-pointer ${
              selectedFilter === filter 
                ? "text-white" 
                : "text-muted-foreground hover:text-white"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {filteredReleases.length === 0 ? (
        <p className="text-center text-muted-foreground mt-14">No releases found for the selected year.</p>
      ) : (
        <div className="flex gap-5 items-center flex-wrap mt-14">
          {filteredReleases.map((release) => (
            <div
              key={release.id}
              onClick={() => handleReleaseClick(release)}
              className="cursor-pointer relative group w-72 h-84"
            >

              <MusicCardSm 
                song={{
                  id: release.id,
                  name: release.name,
                  thumbnail: release.thumbnail,
                  audio: release.audio,
                  artist: release.artist,
                  songCount: release.songCount,
                }} 
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReleasesSection;
