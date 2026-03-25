"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  spotifyLink?: string | null;
  appleMusicLink?: string | null;
  tidalLink?: string | null;
  amazonMusicLink?: string | null;
  youtubeLink?: string | null;
  soundcloudLink?: string | null;
}

interface Single {
  id: string;
  name: string;
  image: string | null;
  audioFile: string;
  duration: number;
  spotifyLink?: string | null;
  appleMusicLink?: string | null;
  tidalLink?: string | null;
  amazonMusicLink?: string | null;
  youtubeLink?: string | null;
  soundcloudLink?: string | null;
  artist: {
    id: string;
    name: string;
    profilePicture: string | null;
  } | null;
}

const SCROLL_GAP_PX = 16; // matches gap-4

const NewMusicSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollArrows = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const epsilon = 2;
    setCanScrollLeft(scrollLeft > epsilon);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - epsilon);
  }, []);

  const scrollByCard = (direction: "prev" | "next") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    if (!first) return;
    const delta = first.offsetWidth + SCROLL_GAP_PX;
    el.scrollBy({
      left: direction === "next" ? delta : -delta,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el || songs.length === 0) return;

    updateScrollArrows();

    el.addEventListener("scroll", updateScrollArrows, { passive: true });
    const ro = new ResizeObserver(() => updateScrollArrows());
    ro.observe(el);

    const id = requestAnimationFrame(() => updateScrollArrows());

    return () => {
      cancelAnimationFrame(id);
      el.removeEventListener("scroll", updateScrollArrows);
      ro.disconnect();
    };
  }, [songs, updateScrollArrows]);

  useEffect(() => {
    fetchLatestSongs();
  }, []);

  const fetchLatestSongs = async () => {
    try {
      const response = await fetch("/api/songs/latest?limit=8");
      if (response.ok) {
        const data: Single[] = await response.json();
        const formattedSongs: Song[] = data
          .filter((single) => single.artist !== null) // Filter out songs without artists
          .map((single) => ({
            id: single.id,
            title: single.name,
            artist: single.artist!.name,
            duration: formatDuration(single.duration),
            backgroundImage: single.image || "/new-music-img1.svg",
            avatar: single.artist!.profilePicture || undefined,
            audio: single.audioFile || null,
            spotifyLink: single.spotifyLink || null,
            appleMusicLink: single.appleMusicLink || null,
            tidalLink: single.tidalLink || null,
            amazonMusicLink: single.amazonMusicLink || null,
            youtubeLink: single.youtubeLink || null,
            soundcloudLink: single.soundcloudLink || null,
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
    <div className="px-4 sm:px-6 md:px-[10%] w-full mx-auto py-14 sm:py-20 md:py-28">
      <p className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl tracking-tighter">New Music, No Compromise.</p>
      <p className="mt-4 sm:mt-5 text-muted-foreground text-base sm:text-lg md:text-xl">
        From underground hits to future anthems, our releases are about pushing
        boundaries and setting trends.
      </p>
      <div className="flex justify-center md:justify-end mt-4 sm:mt-6">
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
          <div className="flex items-center gap-2 sm:gap-3 mt-8 sm:mt-10 min-w-0">
            {canScrollLeft ? (
              <button
                type="button"
                onClick={() => scrollByCard("prev")}
                aria-label="Previous release"
                className="flex-shrink-0 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
              >
                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden />
              </button>
            ) : null}
            <div
              ref={scrollContainerRef}
              className="flex min-w-0 flex-1 gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {songs.map((song) => (
                <MusicCard key={song.id} song={song} />
              ))}
            </div>
            {canScrollRight ? (
              <button
                type="button"
                onClick={() => scrollByCard("next")}
                aria-label="Next release"
                className="flex-shrink-0 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
              >
                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden />
              </button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewMusicSection;
