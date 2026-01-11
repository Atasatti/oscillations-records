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

// POST method removed - use /api/singles instead

