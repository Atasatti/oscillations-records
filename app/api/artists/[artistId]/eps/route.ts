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
        OR: [
          { primaryArtistIds: { has: artistId } },
          { featureArtistIds: { has: artistId } }
        ]
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

// POST method removed - use /api/eps instead

