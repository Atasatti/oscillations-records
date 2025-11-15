import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/artists/[artistId]/songs/bulk - Create multiple songs (singles) at once
export async function POST(
  request: NextRequest,
  { params }: { params: { artistId: string } }
) {
  try {
    const { artistId } = params;
    const body = await request.json();
    const { songs } = body; // Array of { name, audioFile, duration, image? }

    // Validate required fields
    if (!songs || !Array.isArray(songs) || songs.length === 0) {
      return NextResponse.json(
        { error: "Songs array is required and must not be empty" },
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

    // Create all songs
    const createdSongs = await Promise.all(
      songs.map((song) =>
        prisma.single.create({
          data: {
            name: song.name,
            image: song.image || null,
            audioFile: song.audioFile,
            duration: parseInt(song.duration, 10),
            artistId: artistId,
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

