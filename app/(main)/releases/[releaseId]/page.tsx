"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import MusicCard from "@/components/local-ui/MusicCard";
import Navbar from "@/components/local-ui/Navbar";
import Footer from "@/components/local-ui/Footer";

interface Song {
  id: string;
  name: string;
  image: string | null;
  audioFile: string;
  duration: number;
  artist: {
    id: string;
    name: string;
  };
}

interface Release {
  id: string;
  name: string;
  coverImage: string;
  type: 'album' | 'ep';
  artist: {
    id: string;
    name: string;
    profilePicture: string | null;
  };
  description?: string | null;
  releaseDate?: string | null;
  songs: Song[];
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
      await fetch("/api/analytics/track-play", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contentType: release.type,
          contentId: release.id,
          contentName: release.name,
          artistId: release.artist.id,
          artistName: release.artist.name,
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

  if (isLoading) {
    return (
      <div>
        <Navbar />
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

  return (
    <div>
      <div className="min-h-screen text-white">
        <div className="px-[10%] py-14">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-4 text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <div className="flex items-start gap-6">
              <img
                src={release.coverImage}
                alt={release.name}
                className="w-64 h-64 rounded-2xl object-cover"
              />
              <div className="flex-1">
                <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">
                  {release.type === 'album' ? 'Album' : 'EP'}
                </p>
                <h1 className="text-5xl font-light tracking-tighter mb-4">{release.name}</h1>
                <p className="text-xl text-gray-400 mb-2">{release.artist.name}</p>
                {release.releaseDate && (
                  <p className="text-sm text-gray-500">
                    Released: {new Date(release.releaseDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                )}
                {release.description && (
                  <p className="text-gray-400 mt-4 max-w-2xl">{release.description}</p>
                )}
              </div>
            </div>
          </div>

          {/* Songs */}
          <div className="mt-12">
            <h2 className="text-2xl font-light mb-6">Songs</h2>
            {release.songs.length === 0 ? (
              <p className="text-gray-400">No songs available.</p>
            ) : (
              <div className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth">
                {release.songs.map((song) => (
                  <MusicCard
                    key={song.id}
                    song={{
                      id: song.id,
                      title: song.name,
                      artist: song.artist.name,
                      duration: formatDuration(song.duration),
                      backgroundImage: song.image || release.coverImage,
                      avatar: release.artist.profilePicture || undefined,
                      audio: song.audioFile,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

