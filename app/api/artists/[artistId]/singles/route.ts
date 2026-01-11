import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering - prevent static generation
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET /api/artists/[artistId]/singles - Get all singles for an artist (excluding songs used in albums/EPs)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ artistId: string }> }
) {
  try {
    const { artistId } = await params;

    // Get all songs used in albums and EPs for this artist
    const [albums, eps] = await Promise.all([
      prisma.album.findMany({
        where: {
          OR: [
            { primaryArtistIds: { has: artistId } },
            { featureArtistIds: { has: artistId } }
          ]
        },
        select: { songIds: true }
      }),
      prisma.ep.findMany({
        where: {
          OR: [
            { primaryArtistIds: { has: artistId } },
            { featureArtistIds: { has: artistId } }
          ]
        },
        select: { songIds: true }
      })
    ]);

    // Collect all song IDs that are used in albums or EPs
    const usedSongIds = new Set<string>();
    albums.forEach((album: { songIds: string[] }) => {
      album.songIds.forEach((id: string) => usedSongIds.add(id));
    });
    eps.forEach((ep: { songIds: string[] }) => {
      ep.songIds.forEach((id: string) => usedSongIds.add(id));
    });

    // Get all singles, excluding those used in albums/EPs
    const singles = await prisma.single.findMany({
      where: {
        OR: [
          { primaryArtistIds: { has: artistId } },
          { featureArtistIds: { has: artistId } }
        ],
        id: {
          notIn: Array.from(usedSongIds)
        }
      },
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

// POST /api/artists/[artistId]/singles - Create a new single for an artist
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ artistId: string }> }
) {
  try {
    const { artistId } = await params;
    const body = await request.json();
    const { name, image, audioFile, duration } = body;

    // Validate required fields
    if (!name || !audioFile || !duration) {
      return NextResponse.json(
        { error: "Name, audioFile, and duration are required" },
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

    const single = await prisma.single.create({
      data: {
        name,
        image: image || null,
        audioFile,
        duration: parseInt(duration, 10),
        artistId: artistId,
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

