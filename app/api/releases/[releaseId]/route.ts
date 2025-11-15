import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/releases/[releaseId] - Get a single release (album or EP) by ID with songs
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ releaseId: string }> }
) {
  try {
    const { releaseId } = await params;

    // Try to find as album first
    let album = await prisma.album.findUnique({
      where: { id: releaseId },
      include: {
        artist: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          }
        }
      }
    });

    if (album) {
      // Populate song details
      const songs = await prisma.single.findMany({
        where: {
          id: { in: album.songIds },
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

      return NextResponse.json({
        ...album,
        type: 'album',
        songs,
      });
    }

    // Try to find as EP
    let ep = await prisma.ep.findUnique({
      where: { id: releaseId },
      include: {
        artist: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          }
        }
      }
    });

    if (ep) {
      // Populate song details
      const songs = await prisma.single.findMany({
        where: {
          id: { in: ep.songIds },
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

      return NextResponse.json({
        ...ep,
        type: 'ep',
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


