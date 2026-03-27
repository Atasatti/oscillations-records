import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering - prevent static generation
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET /api/releases/[releaseId] - Get a single release (single, album or EP) by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ releaseId: string }> }
) {
  try {
    const { releaseId } = await params;

    // Try to find as single first
    const single = await prisma.single.findUnique({
      where: { id: releaseId },
    });

    if (single) {
      const allArtistIds = [...single.primaryArtistIds, ...single.featureArtistIds];
      const artists = await prisma.artist.findMany({
        where: {
          id: { in: allArtistIds },
        },
        select: {
          id: true,
          name: true,
          profilePicture: true,
        }
      });

      return NextResponse.json({
        id: single.id,
        name: single.name,
        coverImage: single.image,
        type: "single",
        primaryArtistIds: single.primaryArtistIds,
        featureArtistIds: single.featureArtistIds,
        description: null,
        releaseDate: single.releaseDate,
        artists,
        songs: [single],
      });
    }

    // Try to find as album
    const album = await prisma.album.findUnique({
      where: { id: releaseId },
    });

    if (album) {
      // Fetch primary and feature artists
      const allArtistIds = [...album.primaryArtistIds, ...album.featureArtistIds];
      const artists = await prisma.artist.findMany({
        where: {
          id: { in: allArtistIds },
        },
        select: {
          id: true,
          name: true,
          profilePicture: true,
        }
      });

      // Populate song details
      const songs = await prisma.single.findMany({
        where: {
          id: { in: album.songIds },
        },
      });

      return NextResponse.json({
        ...album,
        type: 'album',
        artists,
        songs,
      });
    }

    // Try to find as EP
    const ep = await prisma.ep.findUnique({
      where: { id: releaseId },
    });

    if (ep) {
      // Fetch primary and feature artists
      const allArtistIds = [...ep.primaryArtistIds, ...ep.featureArtistIds];
      const artists = await prisma.artist.findMany({
        where: {
          id: { in: allArtistIds },
        },
        select: {
          id: true,
          name: true,
          profilePicture: true,
        }
      });

      // Populate song details
      const songs = await prisma.single.findMany({
        where: {
          id: { in: ep.songIds },
        },
      });

      return NextResponse.json({
        ...ep,
        type: 'ep',
        artists,
        songs,
      });
    }

    return NextResponse.json(
      { error: "Release not found" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Error fetching release:", error);
    return NextResponse.json(
      { error: "Failed to fetch release" },
      { status: 500 }
    );
  }
}


