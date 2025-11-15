import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/artists/[artistId]/albums - Get all albums for an artist
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ artistId: string }> }
) {
  try {
    const { artistId } = await params;

    const albums = await prisma.album.findMany({
      where: {
        artistId: artistId,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Populate song details for each album
    const albumsWithSongs = await Promise.all(
      albums.map(async (album) => {
        const songs = await prisma.single.findMany({
          where: {
            id: { in: album.songIds },
          },
        });
        return {
          ...album,
          songs,
        };
      })
    );

    return NextResponse.json(albumsWithSongs);
  } catch (error) {
    console.error("Error fetching albums:", error);
    return NextResponse.json(
      { error: "Failed to fetch albums" },
      { status: 500 }
    );
  }
}

// POST /api/artists/[artistId]/albums - Create a new album for an artist
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ artistId: string }> }
) {
  try {
    const { artistId } = await params;
    const body = await request.json();
    const { name, coverImage, releaseDate, description, songIds } = body;

    // Validate required fields
    if (!name || !coverImage || !songIds || !Array.isArray(songIds) || songIds.length === 0) {
      return NextResponse.json(
        { error: "Name, coverImage, and songIds (non-empty array) are required" },
        { status: 400 }
      );
    }

    // Verify artist exists
    const artist = await prisma.artist.findUnique({
      where: { id: artistId },
    });

    if (!artist) {
      return NextResponse.json(
        { error: "Artist not found" },
        { status: 404 }
      );
    }

    // Verify all songs exist
    const songs = await prisma.single.findMany({
      where: {
        id: { in: songIds },
      },
    });

    if (songs.length !== songIds.length) {
      return NextResponse.json(
        { error: "One or more songs not found" },
        { status: 404 }
      );
    }

    const album = await prisma.album.create({
      data: {
        name,
        coverImage,
        artistId: artistId,
        releaseDate: releaseDate ? new Date(releaseDate) : null,
        description: description || null,
        songIds,
      },
    });

    // Populate songs for response
    const albumWithSongs = {
      ...album,
      songs,
    };

    return NextResponse.json(albumWithSongs, { status: 201 });
  } catch (error) {
    console.error("Error creating album:", error);
    return NextResponse.json(
      { error: "Failed to create album" },
      { status: 500 }
    );
  }
}

