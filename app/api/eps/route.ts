import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering - prevent static generation
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET /api/eps - Get all EPs
export async function GET() {
  try {
    const eps = await prisma.ep.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Populate song details for each EP
    const epsWithSongs = await Promise.all(
      eps.map(async (ep) => {
        const songs = await prisma.single.findMany({
          where: {
            id: { in: ep.songIds },
          },
        });
        return {
          ...ep,
          songs,
        };
      })
    );

    return NextResponse.json(epsWithSongs);
  } catch (error) {
    console.error("Error fetching EPs:", error);
    return NextResponse.json(
      { error: "Failed to fetch EPs" },
      { status: 500 }
    );
  }
}

// POST /api/eps - Create a new EP with primary and feature artists
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, coverImage, description, songIds, primaryArtistIds, featureArtistIds } = body;

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

    const ep = await prisma.ep.create({
      data: {
        name,
        coverImage,
        primaryArtistIds,
        featureArtistIds: featureArtistIds || [],
        description: description || null,
        songIds,
      },
    });

    // Populate songs for response
    const epWithSongs = {
      ...ep,
      songs,
    };

    return NextResponse.json(epWithSongs, { status: 201 });
  } catch (error) {
    console.error("Error creating EP:", error);
    return NextResponse.json(
      { error: "Failed to create EP" },
      { status: 500 }
    );
  }
}

