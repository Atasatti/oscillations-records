"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import AdminNavbar from "@/components/local-ui/AdminNavbar";
import ArtistCard from "@/components/local-ui/ArtistCard";
import MusicCardSm from "@/components/local-ui/MusicCardSm";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Users, MoreVertical, Trash2 } from "lucide-react";

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

interface Single {
  id: string;
  name: string;
  image?: string;
  audioFile: string;
  duration: number;
  primaryArtistIds: string[];
  featureArtistIds: string[];
  createdAt: string;
  updatedAt: string;
}

interface Album {
  id: string;
  name: string;
  coverImage: string;
  primaryArtistIds: string[];
  featureArtistIds: string[];
  releaseDate?: string;
  description?: string;
  songIds: string[];
  songs?: Single[];
  createdAt: string;
  updatedAt: string;
}

interface EP {
  id: string;
  name: string;
  coverImage: string;
  primaryArtistIds: string[];
  featureArtistIds: string[];
  description?: string;
  songIds: string[];
  songs?: Single[];
  createdAt: string;
  updatedAt: string;
}

export default function AdminCatalog() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [singles, setSingles] = useState<Single[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [eps, setEps] = useState<EP[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [artistToDelete, setArtistToDelete] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [artistsRes, singlesRes, albumsRes, epsRes] = await Promise.all([
        fetch("/api/artists"),
        fetch("/api/singles"),
        fetch("/api/albums"),
        fetch("/api/eps"),
      ]);

      if (artistsRes.ok) {
        const data = await artistsRes.json();
        setArtists(data);
      }

      if (singlesRes.ok) {
        const data = await singlesRes.json();
        setSingles(data);
      }

      if (albumsRes.ok) {
        const data = await albumsRes.json();
        setAlbums(data);
      }

      if (epsRes.ok) {
        const data = await epsRes.json();
        setEps(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchArtists = async () => {
    try {
      const response = await fetch("/api/artists");
      if (response.ok) {
        const data = await response.json();
        setArtists(data);
      } else {
        setError("Failed to fetch artists");
      }
    } catch (error) {
      console.error("Error fetching artists:", error);
      setError("Failed to fetch artists");
    }
  };

  const handleDeleteClick = (artistId: string, artistName: string) => {
    setArtistToDelete({ id: artistId, name: artistName });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!artistToDelete) return;

    try {
      const response = await fetch(`/api/artists/${artistToDelete.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setDeleteDialogOpen(false);
        setArtistToDelete(null);
        fetchAllData();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error deleting artist:", error);
      alert("Failed to delete artist");
    }
  };

  return (
    <div className="min-h-screen text-white">
      <AdminNavbar />
      
      <div className="px-4 md:px-6 lg:px-[10%] py-8 md:py-12 lg:py-14">
        {/* Header */}
        <div className="mb-8 md:mb-12 lg:mb-14">
          <p className="text-xs uppercase tracking-wider text-center text-muted-foreground">
            Music Catalog
          </p>
          <p className="font-light text-3xl md:text-4xl lg:text-5xl text-center tracking-tighter mt-2 md:mt-3">Manage Artists</p>
        </div>

        {/* Create Artist Button */}
        <div className="mb-6 md:mb-8 flex justify-center">
          <Link href="/admin/catalog/create">
            <Button className="bg-white text-black hover:bg-gray-200 px-4 md:px-6 py-2.5 md:py-3 text-sm md:text-base">
              <Plus className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              Create New Artist
            </Button>
          </Link>
        </div>

        {/* Artists Section */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-xl md:text-2xl font-light tracking-tighter mb-4 md:mb-6">Artists</h2>
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-400 mb-4">{error}</p>
              <Button onClick={fetchArtists} variant="outline" className="border-gray-700">
                Try Again
              </Button>
            </div>
          ) : artists.length === 0 ? (
            <div className="text-center py-20 bg-[#0F0F0F] rounded-xl">
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-4">No artists found</p>
              <p className="text-gray-500 mb-6">Create your first artist to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {artists.map((artist) => (
                <div key={artist.id} className="relative group">
                  <Link href={`/admin/catalog/artist/${artist.id}`}>
                    <ArtistCard artist={artist} />
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 h-8 w-8"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#0F0F0F] border-gray-800">
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDeleteClick(artist.id, artist.name);
                        }}
                        className="text-red-400 focus:text-red-300 focus:bg-red-950/20"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Artist
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Singles Section */}
        <div className="mb-12 md:mb-16">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-light tracking-tighter">Manage Singles</h2>
            <Link href="/admin/catalog/create/single">
              <Button className="bg-white text-black hover:bg-gray-200 text-sm md:text-base w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Create Single
              </Button>
            </Link>
          </div>
          {singles.length === 0 ? (
            <div className="text-center py-20 bg-[#0F0F0F] rounded-xl">
              <p className="text-gray-400 text-lg mb-4">No singles found</p>
              <p className="text-gray-500 mb-6">Create your first single</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {singles.map((single) => (
                <div key={single.id} className="w-full sm:w-72 h-84">
                  <MusicCardSm
                    song={{
                      id: single.id,
                      name: single.name,
                      thumbnail: single.image,
                      audio: single.audioFile
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Albums Section */}
        <div className="mb-12 md:mb-16">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-light tracking-tighter">Manage Albums</h2>
            <Link href="/admin/catalog/create/album">
              <Button className="bg-white text-black hover:bg-gray-200 text-sm md:text-base w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Create Album
              </Button>
            </Link>
          </div>
          {albums.length === 0 ? (
            <div className="text-center py-20 bg-[#0F0F0F] rounded-xl">
              <p className="text-gray-400 text-lg mb-4">No albums found</p>
              <p className="text-gray-500 mb-6">Create your first album</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {albums.map((album) => (
                <div key={album.id} className="w-full sm:w-72 h-84">
                  <MusicCardSm
                    song={{
                      id: album.id,
                      name: album.name,
                      thumbnail: album.coverImage,
                      audio: null,
                      songCount: album.songIds.length,
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* EPs Section */}
        <div className="mb-12 md:mb-16">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-light tracking-tighter">Manage EPs</h2>
            <Link href="/admin/catalog/create/ep">
              <Button className="bg-white text-black hover:bg-gray-200 text-sm md:text-base w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Create EP
              </Button>
            </Link>
          </div>
          {eps.length === 0 ? (
            <div className="text-center py-20 bg-[#0F0F0F] rounded-xl">
              <p className="text-gray-400 text-lg mb-4">No EPs found</p>
              <p className="text-gray-500 mb-6">Create your first EP</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {eps.map((ep) => (
                <div key={ep.id} className="w-full sm:w-72 h-84">
                  <MusicCardSm
                    song={{
                      id: ep.id,
                      name: ep.name,
                      thumbnail: ep.coverImage,
                      audio: null,
                      songCount: ep.songIds.length,
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="bg-[#0F0F0F] border-gray-800 text-white">
            <DialogHeader>
              <DialogTitle>Delete Artist</DialogTitle>
              <DialogDescription className="text-gray-400">
                Are you sure you want to delete &quot;{artistToDelete?.name}&quot;? This will also delete all their singles, albums, and EPs. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setDeleteDialogOpen(false);
                  setArtistToDelete(null);
                }}
                className="border-gray-700"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
