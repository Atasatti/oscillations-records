import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering - prevent static generation
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// POST /api/songs/bulk - Create multiple songs (singles) at once with primary and feature artists
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { songs, primaryArtistIds, featureArtistIds } = body; // Array of { name, audioFile, duration, image? }

    // Validate required fields
    if (!songs || !Array.isArray(songs) || songs.length === 0) {
      return NextResponse.json(
        { error: "Songs array is required and must not be empty" },
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

    // Validate each song
    for (const song of songs) {
      if (!song.name || !song.audioFile || !song.duration) {
        return NextResponse.json(
          { error: "Each song must have name, audioFile, and duration" },
          { status: 400 }
        );
      }
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

    // Create all songs
    const createdSongs = await Promise.all(
      songs.map((song) =>
        prisma.single.create({
          data: {
            name: song.name,
            image: song.image || null,
            audioFile: song.audioFile,
            duration: parseInt(song.duration, 10),
            primaryArtistIds,
            featureArtistIds: featureArtistIds || [],
          },
        })
      )
    );

    return NextResponse.json(createdSongs, { status: 201 });
  } catch (error) {
    console.error("Error creating songs:", error);
    return NextResponse.json(
      { error: "Failed to create songs" },
      { status: 500 }
    );
  }
}

