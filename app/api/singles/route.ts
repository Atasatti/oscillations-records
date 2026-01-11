import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering - prevent static generation
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET /api/singles - Get all singles
export async function GET() {
  try {
    const singles = await prisma.single.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(singles);
  } catch (error) {
    console.error("Error fetching singles:", error);
    return NextResponse.json(
      { error: "Failed to fetch singles" },
      { status: 500 }
    );
  }
}

// POST /api/singles - Create a new single with primary and feature artists
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, image, audioFile, duration, primaryArtistIds, featureArtistIds } = body;

    // Validate required fields
    if (!name || !audioFile || !duration) {
      return NextResponse.json(
        { error: "Name, audioFile, and duration are required" },
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

    const single = await prisma.single.create({
      data: {
        name,
        image: image || null,
        audioFile,
        duration: parseInt(duration, 10),
        primaryArtistIds,
        featureArtistIds: featureArtistIds || [],
      },
    });

    return NextResponse.json(single, { status: 201 });
  } catch (error) {
    console.error("Error creating single:", error);
    return NextResponse.json(
      { error: "Failed to create single" },
      { status: 500 }
    );
  }
}
