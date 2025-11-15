import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/artists/[artistId]/albums/[albumId] - Get a single Album by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ artistId: string; albumId: string }> }
) {
  try {
    const { artistId, albumId } = await params;

    const album = await prisma.album.findFirst({
      where: {
        id: albumId,
        artistId: artistId,
      },
    });

    if (!album) {
      return NextResponse.json(
        { error: "Album not found" },
        { status: 404 }
      );
    }

    // Populate song details with artist information
    const songs = await prisma.single.findMany({
      where: {
        id: { in: album.songIds },
      },
      include: {
        artist: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const albumWithSongs = {
      ...album,
      songs,
    };

    return NextResponse.json(albumWithSongs);
  } catch (error) {
    console.error("Error fetching Album:", error);
    return NextResponse.json(
      { error: "Failed to fetch Album" },
      { status: 500 }
    );
  }
}

// DELETE /api/artists/[artistId]/albums/[albumId] - Delete an album
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ artistId: string; albumId: string }> }
) {
  try {
    const { artistId, albumId } = await params;

    // Check if album exists and belongs to the artist
    const album = await prisma.album.findFirst({
      where: {
        id: albumId,
        artistId: artistId,
      },
    });

    if (!album) {
      return NextResponse.json(
        { error: "Album not found" },
        { status: 404 }
      );
    }

    // Delete the album (songs are not deleted, they remain as singles)
    await prisma.album.delete({
      where: { id: albumId },
    });

    return NextResponse.json({ message: "Album deleted successfully" });
  } catch (error) {
    console.error("Error deleting album:", error);
    return NextResponse.json(
      { error: "Failed to delete album" },
      { status: 500 }
    );
  }
}



