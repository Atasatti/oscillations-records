import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering - prevent static generation
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// DELETE /api/artists/[artistId]/singles/[singleId] - Delete a single
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ artistId: string; singleId: string }> }
) {
  try {
    const { artistId, singleId } = await params;

    // Check if single exists and belongs to the artist
    const single = await prisma.single.findFirst({
      where: {
        id: singleId,
        OR: [
          { primaryArtistIds: { has: artistId } },
          { featureArtistIds: { has: artistId } }
        ]
      },
    });

    if (!single) {
      return NextResponse.json(
        { error: "Single not found" },
        { status: 404 }
      );
    }

    // Check if single is used in any album or EP
    const [albums, eps] = await Promise.all([
      prisma.album.findMany({
        where: {
          OR: [
            { primaryArtistIds: { has: artistId } },
            { featureArtistIds: { has: artistId } }
          ],
          songIds: { has: singleId },
        },
      }),
      prisma.ep.findMany({
        where: {
          OR: [
            { primaryArtistIds: { has: artistId } },
            { featureArtistIds: { has: artistId } }
          ],
          songIds: { has: singleId },
        },
      }),
    ]);

    if (albums.length > 0 || eps.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete single: it is used in an album or EP. Remove it from the album/EP first." },
        { status: 400 }
      );
    }

    // Delete the single
    await prisma.single.delete({
      where: { id: singleId },
    });

    return NextResponse.json({ message: "Single deleted successfully" });
  } catch (error) {
    console.error("Error deleting single:", error);
    return NextResponse.json(
      { error: "Failed to delete single" },
      { status: 500 }
    );
  }
}
