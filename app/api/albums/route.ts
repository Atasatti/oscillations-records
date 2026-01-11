import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering - prevent static generation
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET /api/albums - Get all albums
export async function GET() {
  try {
    const albums = await prisma.album.findMany({
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

// POST /api/albums - Create a new album with primary and feature artists
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, coverImage, releaseDate, description, songIds, primaryArtistIds, featureArtistIds } = body;

    // Validate required fields
    if (!name || !coverImage || !songIds || !Array.isArray(songIds) || songIds.length === 0) {
      return NextResponse.json(
        { error: "Name, coverImage, and songIds (non-empty array) are required" },
        { status: 400 }
      );
    }

    // Validate primary artists (at least one required)
    if (!primaryArtistIds || !Array.isArray(primaryArtistIds) || primaryArtistIds.length === 0) {
      return NextResponse.json(
        { error: "At least one primary artist is required" },
        { status: 400 }
      );
    }

    // Validate feature artists (optional, but must be array if provided)
    if (featureArtistIds && !Array.isArray(featureArtistIds)) {
      return NextResponse.json(
        { error: "Feature artists must be an array" },
        { status: 400 }
      );
    }

    // Verify all primary artists exist
    const primaryArtists = await prisma.artist.findMany({
      where: {
        id: { in: primaryArtistIds },
      },
    });

    if (primaryArtists.length !== primaryArtistIds.length) {
      return NextResponse.json(
        { error: "One or more primary artists not found" },
        { status: 404 }
      );
    }

    // Verify all feature artists exist (if provided)
    if (featureArtistIds && featureArtistIds.length > 0) {
      const featureArtists = await prisma.artist.findMany({
        where: {
          id: { in: featureArtistIds },
        },
      });

      if (featureArtists.length !== featureArtistIds.length) {
        return NextResponse.json(
          { error: "One or more feature artists not found" },
          { status: 404 }
        );
      }
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
        primaryArtistIds,
        featureArtistIds: featureArtistIds || [],
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

