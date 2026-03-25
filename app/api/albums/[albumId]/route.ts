import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ albumId: string }> }
) {
  try {
    const { albumId } = await params;

    const album = await prisma.album.findUnique({
      where: { id: albumId },
    });

    if (!album) {
      return NextResponse.json({ error: "Album not found" }, { status: 404 });
    }

    const songs = await prisma.single.findMany({
      where: {
        id: { in: album.songIds },
      },
    });

    return NextResponse.json({
      ...album,
      songs,
    });
  } catch (error) {
    console.error("Error fetching album:", error);
    return NextResponse.json({ error: "Failed to fetch album" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ albumId: string }> }
) {
  try {
    const { albumId } = await params;

    const album = await prisma.album.findUnique({
      where: { id: albumId },
    });

    if (!album) {
      return NextResponse.json({ error: "Album not found" }, { status: 404 });
    }

    await prisma.album.delete({
      where: { id: albumId },
    });

    return NextResponse.json({ message: "Album deleted successfully" });
  } catch (error) {
    console.error("Error deleting album:", error);
    return NextResponse.json({ error: "Failed to delete album" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ albumId: string }> }
) {
  try {
    const { albumId } = await params;
    const body = await request.json();
    const {
      name,
      coverImage,
      releaseDate,
      description,
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

    const existing = await prisma.album.findUnique({
      where: { id: albumId },
    });
    if (!existing) {
      return NextResponse.json({ error: "Album not found" }, { status: 404 });
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

    const album = await prisma.album.update({
      where: { id: albumId },
      data: {
        name,
        coverImage,
        releaseDate: releaseDate ? new Date(releaseDate) : null,
        description: description || null,
        spotifyLink: spotifyLink || null,
        appleMusicLink: appleMusicLink || null,
        tidalLink: tidalLink || null,
        amazonMusicLink: amazonMusicLink || null,
        songIds,
        primaryArtistIds,
        featureArtistIds: featureArtistIds || [],
      },
    });

    return NextResponse.json({ ...album, songs });
  } catch (error) {
    console.error("Error updating album:", error);
    return NextResponse.json({ error: "Failed to update album" }, { status: 500 });
  }
}
