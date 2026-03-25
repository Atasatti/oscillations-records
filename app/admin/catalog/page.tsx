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
import { Plus, Users, MoreVertical, Trash2, Pencil, Image as ImageIcon, Loader2 } from "lucide-react";

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
  spotifyLink?: string;
  appleMusicLink?: string;
  tidalLink?: string;
  amazonMusicLink?: string;
  youtubeLink?: string;
  soundcloudLink?: string;
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
  spotifyLink?: string;
  appleMusicLink?: string;
  tidalLink?: string;
  amazonMusicLink?: string;
  youtubeLink?: string;
  soundcloudLink?: string;
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
  spotifyLink?: string;
  appleMusicLink?: string;
  tidalLink?: string;
  amazonMusicLink?: string;
  youtubeLink?: string;
  soundcloudLink?: string;
  songIds: string[];
  songs?: Single[];
  createdAt: string;
  updatedAt: string;
}

interface UpcomingRelease {
  id: string;
  name: string;
  type: "single" | "ep" | "album";
  image: string;
  releaseDate: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminCatalog() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [singles, setSingles] = useState<Single[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [eps, setEps] = useState<EP[]>([]);
  const [upcomingReleases, setUpcomingReleases] = useState<UpcomingRelease[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [artistToDelete, setArtistToDelete] = useState<{ id: string; name: string } | null>(null);
  const [contentDeleteDialogOpen, setContentDeleteDialogOpen] = useState(false);
  const [contentToDelete, setContentToDelete] = useState<{
    id: string;
    name: string;
    type: "single" | "album" | "ep";
  } | null>(null);
  const [upcomingForm, setUpcomingForm] = useState({
    name: "",
    type: "single" as "single" | "ep" | "album",
    releaseDate: "",
    imageFile: null as File | null,
  });
  const [upcomingImagePreview, setUpcomingImagePreview] = useState<string | null>(null);
  const [isCreatingUpcoming, setIsCreatingUpcoming] = useState(false);
  const [isUploadingUpcomingImage, setIsUploadingUpcomingImage] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [artistsRes, singlesRes, albumsRes, epsRes, upcomingRes] = await Promise.all([
        fetch("/api/artists"),
        fetch("/api/singles"),
        fetch("/api/albums"),
        fetch("/api/eps"),
        fetch("/api/upcoming-releases"),
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

      if (upcomingRes.ok) {
        const data = await upcomingRes.json();
        setUpcomingReleases(data);
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

  const handleContentDeleteClick = (
    type: "single" | "album" | "ep",
    id: string,
    name: string
  ) => {
    setContentToDelete({ type, id, name });
    setContentDeleteDialogOpen(true);
  };

  const handleContentDeleteConfirm = async () => {
    if (!contentToDelete) return;

    const endpoint =
      contentToDelete.type === "single"
        ? `/api/singles/${contentToDelete.id}`
        : contentToDelete.type === "album"
          ? `/api/albums/${contentToDelete.id}`
          : `/api/eps/${contentToDelete.id}`;

    try {
      const response = await fetch(endpoint, { method: "DELETE" });
      if (response.ok) {
        setContentDeleteDialogOpen(false);
        setContentToDelete(null);
        fetchAllData();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error(`Error deleting ${contentToDelete.type}:`, error);
      alert(`Failed to delete ${contentToDelete.type}`);
    }
  };

  const getUpcomingPresignedUrl = async (imageFile: File) => {
    const timestamp = Date.now();
    const imageFileName = `upcoming-releases/images/${timestamp}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const response = await fetch("/api/upload/presigned-url-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageFileName,
        imageFileType: imageFile.type,
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to get image upload URL");
    }
    return response.json() as Promise<{ uploadURL: string; fileURL: string }>;
  };

  const handleUpcomingImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUpcomingForm((prev) => ({ ...prev, imageFile: file }));
    setUpcomingImagePreview(URL.createObjectURL(file));
  };

  const handleCreateUpcomingRelease = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!upcomingForm.name || !upcomingForm.releaseDate || !upcomingForm.imageFile) {
      alert("Please fill all fields and choose an image");
      return;
    }

    setIsCreatingUpcoming(true);
    try {
      setIsUploadingUpcomingImage(true);
      const presigned = await getUpcomingPresignedUrl(upcomingForm.imageFile);
      const uploadRes = await fetch(presigned.uploadURL, {
        method: "PUT",
        body: upcomingForm.imageFile,
        headers: { "Content-Type": upcomingForm.imageFile.type },
      });
      if (!uploadRes.ok) throw new Error("Failed to upload image");
      setIsUploadingUpcomingImage(false);

      const createRes = await fetch("/api/upcoming-releases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: upcomingForm.name,
          type: upcomingForm.type,
          image: presigned.fileURL,
          releaseDate: upcomingForm.releaseDate,
        }),
      });
      if (!createRes.ok) {
        const err = await createRes.json();
        throw new Error(err.error || "Failed to create upcoming release");
      }

      setUpcomingForm({
        name: "",
        type: "single",
        releaseDate: "",
        imageFile: null,
      });
      setUpcomingImagePreview(null);
      fetchAllData();
    } catch (error) {
      console.error("Error creating upcoming release:", error);
      alert(error instanceof Error ? error.message : "Failed to create upcoming release");
    } finally {
      setIsUploadingUpcomingImage(false);
      setIsCreatingUpcoming(false);
    }
  };

  const handleDeleteUpcomingRelease = async (releaseId: string) => {
    const confirmed = window.confirm("Delete this upcoming release?");
    if (!confirmed) return;
    try {
      const response = await fetch(`/api/upcoming-releases/${releaseId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to delete upcoming release");
      }
      fetchAllData();
    } catch (error) {
      console.error("Error deleting upcoming release:", error);
      alert(error instanceof Error ? error.message : "Failed to delete upcoming release");
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
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/admin/catalog/edit/artist/${artist.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit Artist
                        </Link>
                      </DropdownMenuItem>
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
                <div key={single.id} className="relative group w-full sm:w-72 h-84">
                  <MusicCardSm
                    song={{
                      id: single.id,
                      name: single.name,
                      thumbnail: single.image,
                      audio: single.audioFile,
                      spotifyLink: single.spotifyLink,
                      appleMusicLink: single.appleMusicLink,
                      tidalLink: single.tidalLink,
                      amazonMusicLink: single.amazonMusicLink,
                      youtubeLink: single.youtubeLink,
                      soundcloudLink: single.soundcloudLink,
                    }}
                  />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 h-8 w-8"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#0F0F0F] border-gray-800">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/catalog/edit/single/${single.id}`}>
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit Single
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => handleContentDeleteClick("single", single.id, single.name)}
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
                <div key={album.id} className="relative group w-full sm:w-72 h-84">
                  <Link href={`/admin/catalog/album/${album.id}`}>
                    <MusicCardSm
                      song={{
                        id: album.id,
                        name: album.name,
                        thumbnail: album.coverImage,
                        audio: null,
                        songCount: album.songIds.length,
                        spotifyLink: album.spotifyLink,
                        appleMusicLink: album.appleMusicLink,
                        tidalLink: album.tidalLink,
                        amazonMusicLink: album.amazonMusicLink,
                        youtubeLink: album.youtubeLink,
                        soundcloudLink: album.soundcloudLink,
                      }}
                    />
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
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/admin/catalog/edit/album/${album.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit Album
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleContentDeleteClick("album", album.id, album.name);
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
                <div key={ep.id} className="relative group w-full sm:w-72 h-84">
                  <Link href={`/admin/catalog/ep/${ep.id}`}>
                    <MusicCardSm
                      song={{
                        id: ep.id,
                        name: ep.name,
                        thumbnail: ep.coverImage,
                        audio: null,
                        songCount: ep.songIds.length,
                        spotifyLink: ep.spotifyLink,
                        appleMusicLink: ep.appleMusicLink,
                        tidalLink: ep.tidalLink,
                        amazonMusicLink: ep.amazonMusicLink,
                        youtubeLink: ep.youtubeLink,
                        soundcloudLink: ep.soundcloudLink,
                      }}
                    />
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
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/admin/catalog/edit/ep/${ep.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit EP
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleContentDeleteClick("ep", ep.id, ep.name);
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

        {/* Upcoming Releases Section */}
        <div className="mb-12 md:mb-16">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-light tracking-tighter">Upcoming Releases</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <form
              onSubmit={handleCreateUpcomingRelease}
              className="bg-[#0F0F0F] border border-gray-800 rounded-xl p-5 space-y-4"
            >
              <h3 className="text-lg">Add Upcoming Release</h3>
              <input
                type="file"
                accept="image/*"
                onChange={handleUpcomingImageChange}
                className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-white file:text-black hover:file:bg-gray-200"
                required
              />
              {upcomingImagePreview ? (
                <img src={upcomingImagePreview} alt="Upcoming preview" className="w-24 h-24 rounded-md object-cover border border-gray-700" />
              ) : null}
              <input
                value={upcomingForm.name}
                onChange={(e) => setUpcomingForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Release name"
                className="w-full bg-black border border-gray-700 rounded-md px-3 py-2 text-white"
                required
              />
              <select
                value={upcomingForm.type}
                onChange={(e) =>
                  setUpcomingForm((prev) => ({
                    ...prev,
                    type: e.target.value as "single" | "ep" | "album",
                  }))
                }
                className="w-full bg-black border border-gray-700 rounded-md px-3 py-2 text-white"
              >
                <option value="single">Single</option>
                <option value="ep">EP</option>
                <option value="album">Album</option>
              </select>
              <input
                type="date"
                value={upcomingForm.releaseDate}
                onChange={(e) => setUpcomingForm((prev) => ({ ...prev, releaseDate: e.target.value }))}
                className="w-full bg-black border border-gray-700 rounded-md px-3 py-2 text-white"
                required
              />
              <Button type="submit" className="bg-white text-black hover:bg-gray-200" disabled={isCreatingUpcoming}>
                {isCreatingUpcoming ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isUploadingUpcomingImage ? "Uploading..." : "Saving..."}
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Add Upcoming Release
                  </>
                )}
              </Button>
            </form>

            <div className="bg-[#0F0F0F] border border-gray-800 rounded-xl p-5">
              <h3 className="text-lg mb-4">Scheduled</h3>
              {upcomingReleases.length === 0 ? (
                <p className="text-gray-400">No upcoming releases scheduled.</p>
              ) : (
                <div className="space-y-3">
                  {upcomingReleases.map((release) => (
                    <div key={release.id} className="flex items-center justify-between gap-3 bg-black/40 border border-gray-800 rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <img src={release.image} alt={release.name} className="w-14 h-14 rounded object-cover" />
                        <div>
                          <p className="text-sm font-medium">{release.name}</p>
                          <p className="text-xs text-gray-400 uppercase">
                            {release.type} • {new Date(release.releaseDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteUpcomingRelease(release.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
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

        <Dialog open={contentDeleteDialogOpen} onOpenChange={setContentDeleteDialogOpen}>
          <DialogContent className="bg-[#0F0F0F] border-gray-800 text-white">
            <DialogHeader>
              <DialogTitle>
                Delete {contentToDelete?.type === "single" ? "Single" : contentToDelete?.type === "album" ? "Album" : "EP"}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Are you sure you want to delete &quot;{contentToDelete?.name}&quot;?
                {contentToDelete?.type === "single"
                  ? " This action cannot be undone."
                  : " This will remove it but keep the songs. This action cannot be undone."}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setContentDeleteDialogOpen(false);
                  setContentToDelete(null);
                }}
                className="border-gray-700"
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleContentDeleteConfirm}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
