import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering - prevent static generation
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET /api/releases - Get all albums and EPs with artist info
export async function GET() {
  try {
    // Fetch all albums with artist info
    const albums = await prisma.album.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        artist: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });

    // Fetch all EPs with artist info
    const eps = await prisma.ep.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        artist: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });

    // Combine and format releases
    const releases = [
      ...albums.map(album => ({
        id: album.id,
        name: album.name,
        thumbnail: album.coverImage,
        audio: null, // Albums don't have a single audio file
        type: 'album' as const,
        artist: album.artist.name,
        artistId: album.artist.id,
        releaseDate: album.releaseDate,
        createdAt: album.createdAt,
        year: album.releaseDate 
          ? new Date(album.releaseDate).getFullYear().toString()
          : new Date(album.createdAt).getFullYear().toString(),
        songCount: album.songIds.length,
      })),
      ...eps.map(ep => ({
        id: ep.id,
        name: ep.name,
        thumbnail: ep.coverImage,
        audio: null, // EPs don't have a single audio file
        type: 'ep' as const,
        artist: ep.artist.name,
        artistId: ep.artist.id,
        releaseDate: null,
        createdAt: ep.createdAt,
        year: new Date(ep.createdAt).getFullYear().toString(),
        songCount: ep.songIds.length,
      }))
    ];

    // Sort by creation date (newest first)
    releases.sort((a, b) => {
      const dateA = a.releaseDate ? new Date(a.releaseDate).getTime() : new Date(a.createdAt).getTime();
      const dateB = b.releaseDate ? new Date(b.releaseDate).getTime() : new Date(b.createdAt).getTime();
      return dateB - dateA;
    });

    return NextResponse.json(releases);
  } catch (error) {
    console.error("Error fetching releases:", error);
    return NextResponse.json(
      { error: "Failed to fetch releases" },
      { status: 500 }
    );
  }
}

