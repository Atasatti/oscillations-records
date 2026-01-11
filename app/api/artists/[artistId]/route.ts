import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering - prevent static generation
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET /api/artists/[artistId] - Get a single artist by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ artistId: string }> }
) {
  try {
    const { artistId } = await params;

    const artist = await prisma.artist.findUnique({
      where: {
        id: artistId,
      },
    });

    if (!artist) {
      return NextResponse.json(
        { error: "Artist not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(artist);
  } catch (error) {
    console.error("Error fetching artist:", error);
    return NextResponse.json(
      { error: "Failed to fetch artist" },
      { status: 500 }
    );
  }
}

// DELETE /api/artists/[artistId] - Delete an artist and all related data
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ artistId: string }> }
) {
  try {
    const { artistId } = await params;

    // Check if artist exists
    const artist = await prisma.artist.findUnique({
      where: { id: artistId },
    });

    if (!artist) {
      return NextResponse.json(
        { error: "Artist not found" },
        { status: 404 }
      );
    }

    // Remove artist from all singles, albums, and EPs that reference it
    // Get all singles, albums, and EPs that reference this artist
    const [singles, albums, eps] = await Promise.all([
      prisma.single.findMany({
        where: {
          OR: [
            { primaryArtistIds: { has: artistId } },
            { featureArtistIds: { has: artistId } }
          ]
        }
      }),
      prisma.album.findMany({
        where: {
          OR: [
            { primaryArtistIds: { has: artistId } },
            { featureArtistIds: { has: artistId } }
          ]
        }
      }),
      prisma.ep.findMany({
        where: {
          OR: [
            { primaryArtistIds: { has: artistId } },
            { featureArtistIds: { has: artistId } }
          ]
        }
      })
    ]);

    // Update singles to remove artist from arrays
    for (const single of singles) {
      const updatedPrimary = single.primaryArtistIds.filter(id => id !== artistId);
      const updatedFeature = single.featureArtistIds.filter(id => id !== artistId);
      
      // If no primary artists left, delete the single
      if (updatedPrimary.length === 0) {
        await prisma.single.delete({ where: { id: single.id } });
      } else {
        await prisma.single.update({
          where: { id: single.id },
          data: {
            primaryArtistIds: updatedPrimary,
            featureArtistIds: updatedFeature
          }
        });
      }
    }

    // Update albums to remove artist from arrays
    for (const album of albums) {
      const updatedPrimary = album.primaryArtistIds.filter(id => id !== artistId);
      const updatedFeature = album.featureArtistIds.filter(id => id !== artistId);
      
      if (updatedPrimary.length === 0) {
        await prisma.album.delete({ where: { id: album.id } });
      } else {
        await prisma.album.update({
          where: { id: album.id },
          data: {
            primaryArtistIds: updatedPrimary,
            featureArtistIds: updatedFeature
          }
        });
      }
    }

    // Update EPs to remove artist from arrays
    for (const ep of eps) {
      const updatedPrimary = ep.primaryArtistIds.filter(id => id !== artistId);
      const updatedFeature = ep.featureArtistIds.filter(id => id !== artistId);
      
      if (updatedPrimary.length === 0) {
        await prisma.ep.delete({ where: { id: ep.id } });
      } else {
        await prisma.ep.update({
          where: { id: ep.id },
          data: {
            primaryArtistIds: updatedPrimary,
            featureArtistIds: updatedFeature
          }
        });
      }
    }

    // Now delete the artist
    await prisma.artist.delete({
      where: { id: artistId },
    });

    return NextResponse.json({ message: "Artist deleted successfully" });
  } catch (error) {
    console.error("Error deleting artist:", error);
    return NextResponse.json(
      { error: "Failed to delete artist" },
      { status: 500 }
    );
  }
}



