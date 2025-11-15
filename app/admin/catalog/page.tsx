"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/components/local-ui/AdminNavbar";
import ArtistCard from "@/components/local-ui/ArtistCard";
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

export default function AdminCatalog() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [artistToDelete, setArtistToDelete] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    fetchArtists();
  }, []);

  const router = useRouter();

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
    } finally {
      setIsLoading(false);
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
        fetchArtists();
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
      
      <div className="px-[10%] py-14">
        {/* Header */}
        <div className="mb-14">
          <p className="text-xs uppercase tracking-wider text-center text-muted-foreground">
            Music Catalog
          </p>
          <p className="font-light text-5xl text-center tracking-tighter mt-3">Manage Artists</p>
        </div>

        {/* Create Button */}
        <div className="mb-8 flex justify-center">
          <Link href="/admin/catalog/create">
            <Button className="bg-white text-black hover:bg-gray-200 px-6 py-3">
              <Plus className="w-5 h-5 mr-2" />
              Create New Artist
            </Button>
          </Link>
        </div>

        {/* Artists Grid */}
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
          <div className="text-center py-20">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-4">No artists found</p>
            <p className="text-gray-500 mb-6">Create your first artist to get started</p>
            <Link href="/admin/catalog/create">
              <Button className="bg-white text-black hover:bg-gray-200">
                <Plus className="w-4 h-4 mr-2" />
                Create Artist
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="bg-[#0F0F0F] border-gray-800 text-white">
            <DialogHeader>
              <DialogTitle>Delete Artist</DialogTitle>
              <DialogDescription className="text-gray-400">
                Are you sure you want to delete "{artistToDelete?.name}"? This will also delete all their singles, albums, and EPs. This action cannot be undone.
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
