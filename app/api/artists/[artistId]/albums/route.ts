import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering - prevent static generation
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET /api/artists/[artistId]/albums - Get all albums for an artist
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ artistId: string }> }
) {
  try {
    const { artistId } = await params;

    const albums = await prisma.album.findMany({
      where: {
        OR: [
          { primaryArtistIds: { has: artistId } },
          { featureArtistIds: { has: artistId } }
        ]
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

// POST method removed - use /api/albums instead

