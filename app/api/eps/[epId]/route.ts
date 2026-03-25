import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ epId: string }> }
) {
  try {
    const { epId } = await params;

    const ep = await prisma.ep.findUnique({
      where: { id: epId },
    });

    if (!ep) {
      return NextResponse.json({ error: "EP not found" }, { status: 404 });
    }

    const songs = await prisma.single.findMany({
      where: {
        id: { in: ep.songIds },
      },
    });

    return NextResponse.json({
      ...ep,
      songs,
    });
  } catch (error) {
    console.error("Error fetching EP:", error);
    return NextResponse.json({ error: "Failed to fetch EP" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ epId: string }> }
) {
  try {
    const { epId } = await params;

    const ep = await prisma.ep.findUnique({
      where: { id: epId },
    });

    if (!ep) {
      return NextResponse.json({ error: "EP not found" }, { status: 404 });
    }

    await prisma.ep.delete({
      where: { id: epId },
    });

    return NextResponse.json({ message: "EP deleted successfully" });
  } catch (error) {
    console.error("Error deleting EP:", error);
    return NextResponse.json({ error: "Failed to delete EP" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ epId: string }> }
) {
  try {
    const { epId } = await params;
    const body = await request.json();
    const {
      name,
      coverImage,
      description,
      composer,
      lyricist,
      leadVocal,
      spotifyLink,
      appleMusicLink,
      tidalLink,
      amazonMusicLink,
      songIds,
      primaryArtistIds,
      featureArtistIds,
    } = body;

    if (!name || !coverImage || !songIds || !Array.isArray(songIds) || songIds.length === 0) {
      return NextResponse.json(
        { error: "Name, coverImage, and songIds (non-empty array) are required" },
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

    const existing = await prisma.ep.findUnique({
      where: { id: epId },
    });
    if (!existing) {
      return NextResponse.json({ error: "EP not found" }, { status: 404 });
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

    const songs = await prisma.single.findMany({
      where: { id: { in: songIds } },
    });
    if (songs.length !== songIds.length) {
      return NextResponse.json(
        { error: "One or more songs not found" },
        { status: 404 }
      );
    }

    const ep = await prisma.ep.update({
      where: { id: epId },
      data: {
        name,
        coverImage,
        description: description || null,
        composer: composer || null,
        lyricist: lyricist || null,
        leadVocal: leadVocal || null,
        spotifyLink: spotifyLink || null,
        appleMusicLink: appleMusicLink || null,
        tidalLink: tidalLink || null,
        amazonMusicLink: amazonMusicLink || null,
        songIds,
        primaryArtistIds,
        featureArtistIds: featureArtistIds || [],
      },
    });

    return NextResponse.json({ ...ep, songs });
  } catch (error) {
    console.error("Error updating EP:", error);
    return NextResponse.json({ error: "Failed to update EP" }, { status: 500 });
  }
}
