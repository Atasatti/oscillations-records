import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering - prevent static generation
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET /api/artists/[artistId]/eps - Get all EPs for an artist
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ artistId: string }> }
) {
  try {
    const { artistId } = await params;

    const eps = await prisma.ep.findMany({
      where: {
        artistId: artistId,
      },
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

// POST /api/artists/[artistId]/eps - Create a new EP for an artist
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ artistId: string }> }
) {
  try {
    const { artistId } = await params;
    const body = await request.json();
    const { name, coverImage, description, songIds } = body;

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

    const ep = await prisma.ep.create({
      data: {
        name,
        coverImage,
        artistId: artistId,
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

