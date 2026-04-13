"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import IconButton from "../local-ui/IconButton";
import ReleaseCardSm from "../local-ui/ReleaseCardSm";

interface HomeRelease {
  id: string;
  name: string;
  thumbnail?: string | null;
  audio?: string | null;
  type: "single" | "ep" | "album";
  primaryArtistName?: string;
  featureArtistNames?: string[];
  artist: string;
  songCount: number;
  spotifyLink?: string | null;
  appleMusicLink?: string | null;
  tidalLink?: string | null;
  amazonMusicLink?: string | null;
  youtubeLink?: string | null;
  soundcloudLink?: string | null;
  isrcExplicit?: boolean;
  showLatestOnHome?: boolean;
  showOnHome?: boolean;
}

const SCROLL_GAP_PX = 16; // matches gap-4

const NewMusicSection = () => {
  const pathname = usePathname();
  const router = useRouter();
  const isReleasesListingPage =
    pathname === "/releases" || pathname === "/releases/";

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [releases, setReleases] = useState<HomeRelease[]>([]);
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
    if (!el || releases.length === 0) return;

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
  }, [releases, updateScrollArrows]);

  const fetchReleases = useCallback(async () => {
    try {
      const response = await fetch("/api/releases?carousel=1");
      if (response.ok) {
        const data: HomeRelease[] = await response.json();
        setReleases(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching releases:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReleases();
  }, [fetchReleases]);

  const handleReleaseClick = (release: HomeRelease) => {
    router.push(`/releases/${release.id}`);
  };

  return (
    <div className="px-4 sm:px-6 md:px-[10%] w-full mx-auto py-14 sm:py-20 md:py-28">
      <p className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl tracking-tighter">New Music, No Compromise.</p>
      <p className="mt-4 sm:mt-5 text-muted-foreground text-base sm:text-lg md:text-xl">
        From underground hits to future anthems, our releases are about pushing
        boundaries and setting trends.
      </p>
      {!isReleasesListingPage ? (
        <div className="flex justify-center md:justify-end mt-4 sm:mt-6">
          <IconButton text="Listen Now" href="/releases" />
        </div>
      ) : null}
      <div className="relative">
        {isLoading ? (
          <div className="flex justify-center items-center mt-10 py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : releases.length === 0 ? (
          <p className="text-center text-muted-foreground mt-10">No releases available yet.</p>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3 mt-8 sm:mt-10 min-w-0">
            {canScrollLeft ? (
              <button
                type="button"
                onClick={() => scrollByCard("prev")}
                aria-label="Previous releases"
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
              {releases.map((release) => (
                <div
                  key={release.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleReleaseClick(release)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleReleaseClick(release);
                    }
                  }}
                  className="cursor-pointer relative group w-72 h-84 shrink-0"
                >
                  {release.showLatestOnHome ? (
                    <span className="absolute right-3 top-3 z-30 rounded-full bg-red-600 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white pointer-events-none">
                      Latest
                    </span>
                  ) : null}
                  <ReleaseCardSm
                    release={{
                      id: release.id,
                      name: release.name,
                      thumbnail: release.thumbnail,
                      audio: release.audio,
                      primaryArtistName: release.primaryArtistName,
                      featureArtistNames: release.featureArtistNames,
                      artist: release.artist,
                      songCount: release.songCount,
                      kindLabel:
                        release.type === "album"
                          ? "Album"
                          : release.type === "ep"
                            ? "EP"
                            : "Single",
                      spotifyLink: release.spotifyLink,
                      appleMusicLink: release.appleMusicLink,
                      tidalLink: release.tidalLink,
                      amazonMusicLink: release.amazonMusicLink,
                      youtubeLink: release.youtubeLink,
                      soundcloudLink: release.soundcloudLink,
                      isrcExplicit: release.isrcExplicit,
                    }}
                  />
                </div>
              ))}
            </div>
            {canScrollRight ? (
              <button
                type="button"
                onClick={() => scrollByCard("next")}
                aria-label="Next releases"
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
