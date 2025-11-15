"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import MusicCardSm from "@/components/local-ui/MusicCardSm";
import MusicCard from "@/components/local-ui/MusicCard";
import { FaFacebookF, FaInstagram, FaSpotify, FaYoutube } from "react-icons/fa";
import { LuX } from "react-icons/lu";
import { RiTiktokFill } from "react-icons/ri";

interface Single {
  id: string;
  name: string;
  image?: string;
  audioFile: string;
  duration: number;
  artistId: string;
  artist?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Album {
  id: string;
  name: string;
  coverImage: string;
  artistId: string;
  releaseDate?: string | null;
  description?: string | null;
  songIds: string[];
  songs?: Single[];
  createdAt: string;
  updatedAt: string;
}

interface EP {
  id: string;
  name: string;
  coverImage: string;
  artistId: string;
  description?: string | null;
  songIds: string[];
  songs?: Single[];
  createdAt: string;
  updatedAt: string;
}

interface Artist {
  id: string;
  name: string;
  biography: string;
  profilePicture?: string;
  xLink?: string;
  tiktokLink?: string;
  spotifyLink?: string;
  instagramLink?: string;
  youtubeLink?: string;
  facebookLink?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ArtistDetail() {
  const params = useParams();
  const router = useRouter();
  const artistId = params.artistId as string;
  
  const [artist, setArtist] = useState<Artist | null>(null);
  const [singles, setSingles] = useState<Single[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [eps, setEps] = useState<EP[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchArtistData();
  }, [artistId]);

  const fetchArtistData = async () => {
    try {
      // Fetch artist details
      const artistResponse = await fetch(`/api/artists/${artistId}`);
      if (artistResponse.ok) {
        const artistData = await artistResponse.json();
        setArtist(artistData);
      } else {
        if (artistResponse.status === 404) {
          setError("Artist not found");
        } else {
          setError("Failed to fetch artist");
        }
        return;
      }

      // Fetch all data in parallel
      const [singlesResponse, albumsResponse, epsResponse] = await Promise.all([
        fetch(`/api/artists/${artistId}/singles`),
        fetch(`/api/artists/${artistId}/albums`),
        fetch(`/api/artists/${artistId}/eps`),
      ]);

      if (singlesResponse.ok) {
        const singlesData = await singlesResponse.json();
        setSingles(singlesData);
      }

      if (albumsResponse.ok) {
        const albumsData = await albumsResponse.json();
        setAlbums(albumsData);
      }

      if (epsResponse.ok) {
        const epsData = await epsResponse.json();
        setEps(epsData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSocialClick = (url: string | undefined, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  if (isLoading) {
    return (
      <div>
        <div className="min-h-screen text-white flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  if (error || !artist) {
    return (
      <div>
        <div className="min-h-screen  text-white">
          <div className="px-[10%] py-14">
            <div className="text-center py-20">
              <p className="text-red-400 mb-4">{error || "Artist not found"}</p>
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
      <div className="min-h-screen  text-white">
        <div className="px-[10%] py-14">
          {/* Header */}
          <div className="mb-12">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-6 text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <div className="flex items-start gap-8">
              {artist.profilePicture && (
                <img
                  src={artist.profilePicture}
                  alt={artist.name}
                  className="w-48 h-48 rounded-2xl object-cover"
                />
              )}
              <div className="flex-1">
                <h1 className="text-5xl font-light tracking-tighter mb-4">{artist.name}</h1>
                <p className="text-gray-400 text-lg mb-6 max-w-3xl">{artist.biography}</p>
                
                {/* Social Media Links */}
                <div className="flex items-center gap-4">
                  {artist.xLink && (
                    <button
                      onClick={(e) => handleSocialClick(artist.xLink, e)}
                      className="text-gray-400 hover:text-white transition-colors"
                      aria-label="X (Twitter)"
                    >
                      <LuX className="h-6 w-6" />
                    </button>
                  )}
                  {artist.tiktokLink && (
                    <button
                      onClick={(e) => handleSocialClick(artist.tiktokLink, e)}
                      className="text-gray-400 hover:text-white transition-colors"
                      aria-label="TikTok"
                    >
                      <RiTiktokFill className="h-6 w-6" />
                    </button>
                  )}
                  {artist.youtubeLink && (
                    <button
                      onClick={(e) => handleSocialClick(artist.youtubeLink, e)}
                      className="text-gray-400 hover:text-white transition-colors"
                      aria-label="YouTube"
                    >
                      <FaYoutube className="h-6 w-6" />
                    </button>
                  )}
                  {artist.instagramLink && (
                    <button
                      onClick={(e) => handleSocialClick(artist.instagramLink, e)}
                      className="text-gray-400 hover:text-white transition-colors"
                      aria-label="Instagram"
                    >
                      <FaInstagram className="h-6 w-6" />
                    </button>
                  )}
                  {artist.facebookLink && (
                    <button
                      onClick={(e) => handleSocialClick(artist.facebookLink, e)}
                      className="text-gray-400 hover:text-white transition-colors"
                      aria-label="Facebook"
                    >
                      <FaFacebookF className="h-6 w-6" />
                    </button>
                  )}
                  {artist.spotifyLink && (
                    <button
                      onClick={(e) => handleSocialClick(artist.spotifyLink, e)}
                      className="text-gray-400 hover:text-white transition-colors"
                      aria-label="Spotify"
                    >
                      <FaSpotify className="h-6 w-6" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Singles Section */}
          {singles.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-light tracking-tighter mb-6">Singles</h2>
              <div className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4">
                {singles.map((single) => (
                  <MusicCard
                    key={single.id}
                    song={{
                      id: single.id,
                      title: single.name,
                      artist: artist.name,
                      duration: formatDuration(single.duration),
                      backgroundImage: single.image || artist.profilePicture || "/placeholder.svg",
                      avatar: artist.profilePicture || undefined,
                      audio: single.audioFile,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Albums Section */}
          {albums.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-light tracking-tighter mb-6">Albums</h2>
              <div className="flex gap-5 items-center flex-wrap">
                {albums.map((album) => (
                  <div
                    key={album.id}
                    onClick={() => router.push(`/releases/${album.id}`)}
                    className="cursor-pointer w-72 h-84"
                  >
                    <MusicCardSm 
                      song={{
                        id: album.id,
                        name: album.name,
                        thumbnail: album.coverImage,
                        audio: null,
                        artist: artist.name,
                        songCount: album.songIds.length,
                      }} 
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EPs Section */}
          {eps.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-light tracking-tighter mb-6">EPs</h2>
              <div className="flex gap-5 items-center flex-wrap">
                {eps.map((ep) => (
                  <div
                    key={ep.id}
                    onClick={() => router.push(`/releases/${ep.id}`)}
                    className="cursor-pointer w-72 h-84"
                  >
                    <MusicCardSm 
                      song={{
                        id: ep.id,
                        name: ep.name,
                        thumbnail: ep.coverImage,
                        audio: null,
                        artist: artist.name,
                        songCount: ep.songIds.length,
                      }} 
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {singles.length === 0 && albums.length === 0 && eps.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No music available yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

