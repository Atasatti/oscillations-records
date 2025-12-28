"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import AdminNavbar from "@/components/local-ui/AdminNavbar";
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
import { Plus, ArrowLeft, MoreVertical, Trash2 } from "lucide-react";

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
  artistId: string;
  createdAt: string;
  updatedAt: string;
}

interface Album {
  id: string;
  name: string;
  coverImage: string;
  artistId: string;
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
  artistId: string;
  description?: string;
  songIds: string[];
  songs?: Single[];
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
  
  // Delete dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteType, setDeleteType] = useState<"single" | "album" | "ep" | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string } | null>(null);

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


  const handleDeleteClick = (type: "single" | "album" | "ep", id: string, name: string) => {
    setDeleteType(type);
    setItemToDelete({ id, name });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete || !deleteType) return;

    let endpoint = "";
    if (deleteType === "single") {
      endpoint = `/api/artists/${artistId}/singles/${itemToDelete.id}`;
    } else if (deleteType === "album") {
      endpoint = `/api/artists/${artistId}/albums/${itemToDelete.id}`;
    } else if (deleteType === "ep") {
      endpoint = `/api/artists/${artistId}/eps/${itemToDelete.id}`;
    }

    try {
      const response = await fetch(endpoint, {
        method: "DELETE",
      });

      if (response.ok) {
        setDeleteDialogOpen(false);
        setItemToDelete(null);
        setDeleteType(null);
        fetchArtistData();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error(`Error deleting ${deleteType}:`, error);
      alert(`Failed to delete ${deleteType}`);
    }
  };

  const getDeleteMessage = () => {
    if (!deleteType || !itemToDelete) return "";
    
    if (deleteType === "single") {
      return `Are you sure you want to delete "${itemToDelete.name}"? This action cannot be undone.`;
    } else if (deleteType === "album") {
      return `Are you sure you want to delete "${itemToDelete.name}"? This will remove the album but keep the songs. This action cannot be undone.`;
    } else if (deleteType === "ep") {
      return `Are you sure you want to delete "${itemToDelete.name}"? This will remove the EP but keep the songs. This action cannot be undone.`;
    }
    return "";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen  text-white">
        <AdminNavbar />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  if (error || !artist) {
    return (
      <div className="min-h-screen  text-white">
        <AdminNavbar />
        <div className="px-[10%] py-14">
          <div className="text-center py-20">
            <p className="text-red-400 mb-4">{error || "Artist not found"}</p>
            <Button onClick={() => router.back()} variant="outline" className="border-gray-700">
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  text-white">
      <AdminNavbar />
      
      <div className="px-[10%] py-14">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Catalog
          </Button>
          
          <h1 className="text-4xl font-light tracking-tighter">{artist.name}</h1>
          <p className="text-gray-400 mt-2">{artist.biography}</p>
        </div>

        {/* Singles Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-light tracking-tighter">Singles</h2>
            <Link href={`/admin/catalog/artist/${artistId}/single`}>
              <Button className="bg-white text-black hover:bg-gray-200">
                <Plus className="w-4 h-4 mr-2" />
                Create Single
              </Button>
            </Link>
          </div>

          {singles.length === 0 ? (
            <div className="text-center py-20 bg-[#0F0F0F] rounded-xl">
              <p className="text-gray-400 text-lg mb-4">No singles found</p>
              <p className="text-gray-500 mb-6">Create your first single for this artist</p>
            
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {singles.map((single) => (
                <div key={single.id} className="relative group w-72 h-84">
                  <MusicCardSm
                    song={{
                      id: single.id,
                      name: single.name,
                      thumbnail: single.image,
                      audio: single.audioFile
                    }}
                  />
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
                          handleDeleteClick("single", single.id, single.name);
                        }}
                        className="text-red-400 focus:text-red-300 focus:bg-red-950/20"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Single
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* EP Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-light tracking-tighter">EP</h2>
            <Link href={`/admin/catalog/artist/${artistId}/ep`}>
              <Button className="bg-white text-black hover:bg-gray-200">
                <Plus className="w-4 h-4 mr-2" />
                Create EP
              </Button>
            </Link>
          </div>

          {eps.length === 0 ? (
            <div className="text-center py-20 bg-[#0F0F0F] rounded-xl">
              <p className="text-gray-400 text-lg mb-4">No EPs found</p>
              <p className="text-gray-500 mb-6">Create your first EP for this artist</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {eps.map((ep) => (
                <div key={ep.id} className="relative group">
                  <Link 
                    href={`/admin/catalog/artist/${artistId}/ep/${ep.id}`}
                    className="bg-[#0F0F0F] rounded-xl overflow-hidden hover:bg-[#1a1a1a] transition-colors cursor-pointer block"
                  >
                    <img
                      src={ep.coverImage}
                      alt={ep.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-medium mb-1">{ep.name}</h3>
                      <p className="text-sm text-gray-400">
                        {ep.songs?.length || ep.songIds.length} song{ep.songs?.length !== 1 || ep.songIds.length !== 1 ? 's' : ''}
                      </p>
                    </div>
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
                          handleDeleteClick("ep", ep.id, ep.name);
                        }}
                        className="text-red-400 focus:text-red-300 focus:bg-red-950/20"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete EP
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Albums Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-light tracking-tighter">Albums</h2>
            <Link href={`/admin/catalog/artist/${artistId}/album`}>
              <Button className="bg-white text-black hover:bg-gray-200">
                <Plus className="w-4 h-4 mr-2" />
                Create Album
              </Button>
            </Link>
          </div>

          {albums.length === 0 ? (
            <div className="text-center py-20 bg-[#0F0F0F] rounded-xl">
              <p className="text-gray-400 text-lg mb-4">No albums found</p>
              <p className="text-gray-500 mb-6">Create your first album for this artist</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {albums.map((album) => (
                <div key={album.id} className="relative group">
                  <Link 
                    href={`/admin/catalog/artist/${artistId}/album/${album.id}`}
                    className="bg-[#0F0F0F] rounded-xl overflow-hidden hover:bg-[#1a1a1a] transition-colors cursor-pointer block"
                  >
                    <img
                      src={album.coverImage}
                      alt={album.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-medium mb-1">{album.name}</h3>
                      <p className="text-sm text-gray-400">
                        {album.songs?.length || album.songIds.length} song{album.songs?.length !== 1 || album.songIds.length !== 1 ? 's' : ''}
                      </p>
                      {album.releaseDate && (
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(album.releaseDate).getFullYear()}
                        </p>
                      )}
                    </div>
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
                          handleDeleteClick("album", album.id, album.name);
                        }}
                        className="text-red-400 focus:text-red-300 focus:bg-red-950/20"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Album
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="bg-[#0F0F0F] border-gray-800 text-white">
            <DialogHeader>
              <DialogTitle>
                Delete {deleteType === "single" ? "Single" : deleteType === "album" ? "Album" : "EP"}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                {getDeleteMessage()}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setDeleteDialogOpen(false);
                  setItemToDelete(null);
                  setDeleteType(null);
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
