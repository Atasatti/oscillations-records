import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering - prevent static generation
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET /api/releases - Get all albums and EPs with artist info
export async function GET() {
  try {
    // Fetch all albums
    const albums = await prisma.album.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Fetch all EPs
    const eps = await prisma.ep.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Get all unique artist IDs
    const allArtistIds = new Set<string>();
    albums.forEach(album => {
      album.primaryArtistIds.forEach(id => allArtistIds.add(id));
      album.featureArtistIds.forEach(id => allArtistIds.add(id));
    });
    eps.forEach(ep => {
      ep.primaryArtistIds.forEach(id => allArtistIds.add(id));
      ep.featureArtistIds.forEach(id => allArtistIds.add(id));
    });

    // Fetch all artists
    const artists = await prisma.artist.findMany({
      where: {
        id: { in: Array.from(allArtistIds) },
      },
      select: {
        id: true,
        name: true,
      }
    });

    const artistMap = new Map(artists.map(a => [a.id, a]));

    // Combine and format releases
    const releases = [
      ...albums.map(album => {
        // Get primary artist (first one) for display
        const primaryArtistId = album.primaryArtistIds[0];
        const primaryArtist = primaryArtistId ? artistMap.get(primaryArtistId) : null;
        
        return {
          id: album.id,
          name: album.name,
          thumbnail: album.coverImage,
          audio: null, // Albums don't have a single audio file
          type: 'album' as const,
          artist: primaryArtist?.name || 'Unknown Artist',
          artistId: primaryArtistId || '',
          releaseDate: album.releaseDate,
          createdAt: album.createdAt,
          year: album.releaseDate 
            ? new Date(album.releaseDate).getFullYear().toString()
            : new Date(album.createdAt).getFullYear().toString(),
          songCount: album.songIds.length,
        };
      }),
      ...eps.map(ep => {
        // Get primary artist (first one) for display
        const primaryArtistId = ep.primaryArtistIds[0];
        const primaryArtist = primaryArtistId ? artistMap.get(primaryArtistId) : null;
        
        return {
          id: ep.id,
          name: ep.name,
          thumbnail: ep.coverImage,
          audio: null, // EPs don't have a single audio file
          type: 'ep' as const,
          artist: primaryArtist?.name || 'Unknown Artist',
          artistId: primaryArtistId || '',
          releaseDate: null,
          createdAt: ep.createdAt,
          year: new Date(ep.createdAt).getFullYear().toString(),
          songCount: ep.songIds.length,
        };
      })
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

