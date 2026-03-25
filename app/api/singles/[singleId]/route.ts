import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ singleId: string }> }
) {
  try {
    const { singleId } = await params;

    const single = await prisma.single.findUnique({
      where: { id: singleId },
    });

    if (!single) {
      return NextResponse.json({ error: "Single not found" }, { status: 404 });
    }

    const [albums, eps] = await Promise.all([
      prisma.album.findMany({
        where: {
          songIds: { has: singleId },
        },
      }),
      prisma.ep.findMany({
        where: {
          songIds: { has: singleId },
        },
      }),
    ]);

    if (albums.length > 0 || eps.length > 0) {
      return NextResponse.json(
        {
          error:
            "Cannot delete single: it is used in an album or EP. Remove it from the album/EP first.",
        },
        { status: 400 }
      );
    }

    await prisma.single.delete({
      where: { id: singleId },
    });

    return NextResponse.json({ message: "Single deleted successfully" });
  } catch (error) {
    console.error("Error deleting single:", error);
    return NextResponse.json({ error: "Failed to delete single" }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ singleId: string }> }
) {
  try {
    const { singleId } = await params;
    const single = await prisma.single.findUnique({
      where: { id: singleId },
    });

    if (!single) {
      return NextResponse.json({ error: "Single not found" }, { status: 404 });
    }

    return NextResponse.json(single);
  } catch (error) {
    console.error("Error fetching single:", error);
    return NextResponse.json({ error: "Failed to fetch single" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ singleId: string }> }
) {
  try {
    const { singleId } = await params;
    const body = await request.json();
    const {
      name,
      image,
      audioFile,
      duration,
      composer,
      lyricist,
      leadVocal,
      primaryArtistIds,
      featureArtistIds,
    } = body;

    if (!name || !audioFile || !duration) {
      return NextResponse.json(
        { error: "Name, audioFile, and duration are required" },
        { status: 400 }
      );
    }

    if (!primaryArtistIds || !Array.isArray(primaryArtistIds) || primaryArtistIds.length === 0) {
      return NextResponse.json(
        { error: "At least one primary artist is required" },
        { status: 400 }
      );
    }

    if (featureArtistIds && !Array.isArray(featureArtistIds)) {
      return NextResponse.json(
        { error: "Feature artists must be an array" },
        { status: 400 }
      );
    }

    const existing = await prisma.single.findUnique({
      where: { id: singleId },
    });
    if (!existing) {
      return NextResponse.json({ error: "Single not found" }, { status: 404 });
    }

    const primaryArtists = await prisma.artist.findMany({
      where: { id: { in: primaryArtistIds } },
    });
    if (primaryArtists.length !== primaryArtistIds.length) {
      return NextResponse.json(
        { error: "One or more primary artists not found" },
        { status: 404 }
      );
    }

    if (featureArtistIds && featureArtistIds.length > 0) {
      const featureArtists = await prisma.artist.findMany({
        where: { id: { in: featureArtistIds } },
      });
      if (featureArtists.length !== featureArtistIds.length) {
        return NextResponse.json(
          { error: "One or more feature artists not found" },
          { status: 404 }
        );
      }
    }

    const single = await prisma.single.update({
      where: { id: singleId },
      data: {
        name,
        image: image || null,
        audioFile,
        duration: parseInt(String(duration), 10),
        composer: composer || null,
        lyricist: lyricist || null,
        leadVocal: leadVocal || null,
        primaryArtistIds,
        featureArtistIds: featureArtistIds || [],
      },
    });

    return NextResponse.json(single);
  } catch (error) {
    console.error("Error updating single:", error);
    return NextResponse.json({ error: "Failed to update single" }, { status: 500 });
  }
}
