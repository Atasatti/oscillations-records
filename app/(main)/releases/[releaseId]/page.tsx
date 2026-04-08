"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import TrackCard from "@/components/local-ui/TrackCard";
import ExplicitBadge from "@/components/local-ui/ExplicitBadge";
import StreamingLinks, { hasStreamingLinks } from "@/components/local-ui/StreamingLinks";
import Footer from "@/components/local-ui/Footer";

interface TrackRow {
  id: string;
  name: string;
  image: string | null;
  audioFile: string;
  duration: number;
  spotifyLink?: string;
  appleMusicLink?: string;
  tidalLink?: string;
  amazonMusicLink?: string;
  youtubeLink?: string;
  soundcloudLink?: string;
  primaryArtistIds: string[];
  featureArtistIds: string[];
  isrcExplicit?: boolean;
}

interface Artist {
  id: string;
  name: string;
  profilePicture: string | null;
}

interface Release {
  id: string;
  name: string;
  coverImage: string;
  type: 'single' | 'album' | 'ep';
  primaryArtistIds: string[];
  featureArtistIds: string[];
  artists: Artist[];
  description?: string | null;
  releaseDate?: string | null;
  composer?: string | null;
  lyricist?: string | null;
  leadVocal?: string | null;
  upcCode?: string | null;
  isrcExplicit?: boolean;
  spotifyLink?: string | null;
  appleMusicLink?: string | null;
  tidalLink?: string | null;
  amazonMusicLink?: string | null;
  youtubeLink?: string | null;
  soundcloudLink?: string | null;
  tracks: TrackRow[];
  songs?: TrackRow[];
}

export default function ReleaseDetail() {
  const params = useParams();
  const router = useRouter();
  const releaseId = params.releaseId as string;
  
  const [release, setRelease] = useState<Release | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReleaseData();
  }, [releaseId]);

  // Track release view
  useEffect(() => {
    if (release) {
      trackReleaseView(release);
    }
  }, [release]);

  const trackReleaseView = async (release: Release) => {
    try {
      // Get primary artist (first one) for tracking
      const primaryArtistId = release.primaryArtistIds[0];
      const primaryArtist = primaryArtistId 
        ? release.artists.find(a => a.id === primaryArtistId)
        : null;
      
      await fetch("/api/analytics/track-play", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contentType: "release",
          contentId: release.id,
          contentName: release.name,
          artistId: primaryArtistId || null,
          artistName: primaryArtist?.name || 'Unknown Artist',
          playDuration: null,
          completed: false,
        }),
      });
    } catch (error) {
      console.error("Error tracking release view:", error);
    }
  };

  const fetchReleaseData = async () => {
    try {
      const response = await fetch(`/api/releases/${releaseId}`);
      if (response.ok) {
        const data = await response.json();
        setRelease(data);
      } else {
        if (response.status === 404) {
          setError("Release not found");
        } else {
          setError("Failed to fetch release");
        }
      }
    } catch (error) {
      console.error("Error fetching release:", error);
      setError("Failed to fetch release");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const releasePrimaryNames = release
    ? release.primaryArtistIds
        .map((id) => release.artists.find((a) => a.id === id)?.name)
        .filter((name): name is string => Boolean(name))
    : [];
  const primarySet = release ? new Set(release.primaryArtistIds) : new Set<string>();
  const releaseFeatureNames = release
    ? Array.from(
        new Set(
          release.featureArtistIds
            .filter((id) => !primarySet.has(id))
            .map((id) => release.artists.find((a) => a.id === id)?.name)
            .filter((name): name is string => Boolean(name))
        )
      )
    : [];

  if (isLoading) {
    return (
      <div>
        {/* <Navbar /> */}
        <div className="min-h-screen text-white flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !release) {
    return (
      <div>
        <div className="min-h-screen text-white">
          <div className="px-[10%] py-14">
            <div className="text-center py-20">
              <p className="text-red-400 mb-4">{error || "Release not found"}</p>
              <Button onClick={() => router.back()} variant="outline" className="border-gray-700">
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const kindLabel =
    release.type === "album" ? "Album" : release.type === "ep" ? "EP" : "Single";
  const hasCredits = Boolean(
    release.composer ||
      release.lyricist ||
      release.leadVocal ||
      release.upcCode
  );
  const showAbout =
    Boolean(release.description) || Boolean(release.releaseDate);
  const streamProps = {
    spotifyLink: release.spotifyLink,
    appleMusicLink: release.appleMusicLink,
    tidalLink: release.tidalLink,
    amazonMusicLink: release.amazonMusicLink,
    youtubeLink: release.youtubeLink,
    soundcloudLink: release.soundcloudLink,
  };
  const showStream = hasStreamingLinks(streamProps);
  const trackList = release.tracks?.length ? release.tracks : release.songs ?? [];

  return (
    <div>
      <div className="min-h-screen text-white">
        <div className="px-4 sm:px-6 md:px-[10%] py-10 sm:py-14">
          <div className="mb-10 lg:mb-14 max-w-6xl xl:max-w-7xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-6 -ml-2 text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 xl:gap-12 items-start">
              <div className="w-full max-w-[min(100%,320px)] mx-auto lg:mx-0 shrink-0">
                <img
                  src={release.coverImage}
                  alt={release.name}
                  className="w-full aspect-square object-cover rounded-2xl ring-1 ring-white/10 shadow-2xl shadow-black/40"
                />
              </div>

              <div className="flex-1 min-w-0 space-y-6 w-full">
                <header className="space-y-3">
                  <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    {kindLabel}
                  </p>
                  <h1 className="text-4xl sm:text-5xl font-light tracking-tighter flex flex-wrap items-center gap-3">
                    <span>{release.name}</span>
                    {release.isrcExplicit ? <ExplicitBadge size="xl" /> : null}
                  </h1>
                  {(releasePrimaryNames.length > 0 || releaseFeatureNames.length > 0) ? (
                    <div className="space-y-0.5">
                      {releasePrimaryNames.length > 0 ? (
                        <p className="text-lg sm:text-xl text-white/95 font-medium">
                          {releasePrimaryNames.join(", ")}
                        </p>
                      ) : null}
                      {releaseFeatureNames.length > 0 ? (
                        <p className="text-sm text-muted-foreground">
                          ft {releaseFeatureNames.join(", ")}
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </header>

                {(showAbout || hasCredits) && (
                  <div
                    className={`grid gap-4 lg:gap-5 ${showAbout && hasCredits ? "md:grid-cols-2" : ""}`}
                  >
                    {showAbout ? (
                      <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.02] p-5 sm:p-6">
                        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                          About
                        </h2>
                        {release.releaseDate ? (
                          <p className="text-sm text-white/90 font-medium mb-3">
                            Released{" "}
                            {new Date(release.releaseDate).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        ) : null}
                        {release.description ? (
                          <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-wrap">
                            {release.description}
                          </p>
                        ) : !release.releaseDate ? (
                          <p className="text-sm text-muted-foreground">No description yet.</p>
                        ) : null}
                      </div>
                    ) : null}

                    {hasCredits ? (
                      <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.02] p-5 sm:p-6">
                        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                          Credits
                        </h2>
                        <dl className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-[minmax(5rem,auto)_1fr]">
                          {release.composer ? (
                            <>
                              <dt className="text-gray-500 font-medium">Composer</dt>
                              <dd className="text-gray-200">{release.composer}</dd>
                            </>
                          ) : null}
                          {release.lyricist ? (
                            <>
                              <dt className="text-gray-500 font-medium">Lyricist</dt>
                              <dd className="text-gray-200">{release.lyricist}</dd>
                            </>
                          ) : null}
                          {release.leadVocal ? (
                            <>
                              <dt className="text-gray-500 font-medium">Lead vocal</dt>
                              <dd className="text-gray-200">{release.leadVocal}</dd>
                            </>
                          ) : null}
                          {release.upcCode ? (
                            <>
                              <dt className="text-gray-500 font-medium">UPC</dt>
                              <dd className="text-gray-200 font-mono text-xs sm:text-sm break-all">
                                {release.upcCode}
                              </dd>
                            </>
                          ) : null}
                        </dl>
                      </div>
                    ) : null}
                  </div>
                )}

                {showStream ? (
                  <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.02] px-5 py-4 sm:px-6 sm:py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground shrink-0">
                      Stream
                    </h2>
                    <StreamingLinks {...streamProps} size="md" className="sm:ml-auto" />
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Songs */}
          <div className="mt-12 max-w-6xl xl:max-w-7xl mx-auto px-0">
            <h2 className="text-2xl font-light mb-6">Tracks</h2>
            {trackList.length === 0 ? (
              <p className="text-gray-400">No tracks available.</p>
            ) : (
              <div className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2">
                {trackList.map((song) => {
                  // Get primary artist for this song from the release's artists array
                  const primaryArtistId = song.primaryArtistIds[0];
                  const primaryArtist = primaryArtistId 
                    ? release.artists.find(a => a.id === primaryArtistId)
                    : null;
                  const primaryName = primaryArtist?.name || 'Unknown Artist';

                  const featureArtistNames = Array.from(
                    new Set(
                      song.featureArtistIds
                        .map((id) => release.artists.find((a) => a.id === id)?.name)
                        .filter((name): name is string => Boolean(name))
                    )
                  );

                  const artistName =
                    featureArtistNames.length > 0
                      ? `${primaryName} ft ${featureArtistNames.join(", ")}`
                      : primaryName;
                  
                  // Get primary artist for release (for avatar)
                  const releasePrimaryArtistId = release.primaryArtistIds[0];
                  const releasePrimaryArtist = releasePrimaryArtistId
                    ? release.artists.find(a => a.id === releasePrimaryArtistId)
                    : null;
                  
                  return (
                    <TrackCard
                      key={song.id}
                      track={{
                        id: song.id,
                        title: song.name,
                        artist: artistName,
                        duration: formatDuration(song.duration),
                        backgroundImage: song.image || release.coverImage,
                        avatar: releasePrimaryArtist?.profilePicture || undefined,
                        audio: song.audioFile,
                        spotifyLink: song.spotifyLink,
                        appleMusicLink: song.appleMusicLink,
                        tidalLink: song.tidalLink,
                        amazonMusicLink: song.amazonMusicLink,
                        youtubeLink: song.youtubeLink,
                        soundcloudLink: song.soundcloudLink,
                        isrcExplicit: song.isrcExplicit,
                      }}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

