import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering - prevent static generation
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET /api/artists/[artistId]/eps/[epId] - Get a single EP by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ artistId: string; epId: string }> }
) {
  try {
    const { artistId, epId } = await params;

    const ep = await prisma.ep.findFirst({
      where: {
        id: epId,
        artistId: artistId,
      },
    });

    if (!ep) {
      return NextResponse.json(
        { error: "EP not found" },
        { status: 404 }
      );
    }

    // Populate song details with artist information
    const songs = await prisma.single.findMany({
      where: {
        id: { in: ep.songIds },
      },
      include: {
        artist: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const epWithSongs = {
      ...ep,
      songs,
    };

    return NextResponse.json(epWithSongs);
  } catch (error) {
    console.error("Error fetching EP:", error);
    return NextResponse.json(
      { error: "Failed to fetch EP" },
      { status: 500 }
    );
  }
}

// DELETE /api/artists/[artistId]/eps/[epId] - Delete an EP
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ artistId: string; epId: string }> }
) {
  try {
    const { artistId, epId } = await params;

    // Check if EP exists and belongs to the artist
    const ep = await prisma.ep.findFirst({
      where: {
        id: epId,
        artistId: artistId,
      },
    });

    if (!ep) {
      return NextResponse.json(
        { error: "EP not found" },
        { status: 404 }
      );
    }

    // Delete the EP (songs are not deleted, they remain as singles)
    await prisma.ep.delete({
      where: { id: epId },
    });

    return NextResponse.json({ message: "EP deleted successfully" });
  } catch (error) {
    console.error("Error deleting EP:", error);
    return NextResponse.json(
      { error: "Failed to delete EP" },
      { status: 500 }
    );
  }
}



