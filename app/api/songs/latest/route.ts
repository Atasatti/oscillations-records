import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering - prevent static generation
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET /api/songs/latest - Get latest songs (singles) with artist info
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "8", 10);

    // Get latest singles
    const singles = await prisma.single.findMany({
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Get all unique artist IDs
    const allArtistIds = new Set<string>();
    singles.forEach(single => {
      single.primaryArtistIds.forEach(id => allArtistIds.add(id));
      single.featureArtistIds.forEach(id => allArtistIds.add(id));
    });

    // Fetch all artists
    const artists = await prisma.artist.findMany({
      where: {
        id: { in: Array.from(allArtistIds) },
      },
      select: {
        id: true,
        name: true,
        profilePicture: true,
      }
    });

    const artistMap = new Map(artists.map(a => [a.id, a]));

    // Add artist info to each single (using primary artist for display)
    const singlesWithArtists = singles.map(single => {
      const primaryArtistId = single.primaryArtistIds[0];
      const primaryArtist = primaryArtistId ? artistMap.get(primaryArtistId) : null;
      
      return {
        ...single,
        artist: primaryArtist || null,
      };
    });

    return NextResponse.json(singlesWithArtists);
  } catch (error) {
    console.error("Error fetching latest songs:", error);
    return NextResponse.json(
      { error: "Failed to fetch latest songs" },
      { status: 500 }
    );
  }
}


