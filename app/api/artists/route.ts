import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering - prevent static generation
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET /api/artists — all artists, or search with `?q=` (case-insensitive substring) and optional `?limit=`
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || "").trim();
    const limitRaw = searchParams.get("limit");
    let take: number | undefined;
    if (limitRaw !== null && limitRaw !== "") {
      const n = parseInt(limitRaw, 10);
      if (Number.isFinite(n) && n > 0) {
        take = Math.min(n, 100);
      }
    }

    const where =
      q.length > 0
        ? { name: { contains: q, mode: "insensitive" as const } }
        : undefined;

    const artists = await prisma.artist.findMany({
      ...(where ? { where } : {}),
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      ...(take !== undefined ? { take } : {}),
    });

    return NextResponse.json(artists);
  } catch (error) {
    console.error("Error fetching artists:", error);
    return NextResponse.json(
      { error: "Failed to fetch artists" },
      { status: 500 }
    );
  }
}

// POST /api/artists - Create a new artist
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      biography,
      profilePicture,
      composer,
      lyricist,
      leadVocal,
      xLink,
      tiktokLink,
      spotifyLink,
      instagramLink,
      youtubeLink,
      facebookLink,
      appleMusicLink,
      tidalLink,
      amazonMusicLink,
      soundcloudLink,
    } = body;

    // Validate required fields
    if (!name || !biography) {
      return NextResponse.json(
        { error: "Name and biography are required" },
        { status: 400 }
      );
    }

    const maxOrder = await prisma.artist.aggregate({
      _max: { sortOrder: true },
    });
    const sortOrder = (maxOrder._max.sortOrder ?? -1) + 1;

    const artist = await prisma.artist.create({
      data: {
        name,
        biography,
        profilePicture,
        composer: composer || null,
        lyricist: lyricist || null,
        leadVocal: leadVocal || null,
        xLink,
        tiktokLink,
        spotifyLink,
        instagramLink,
        youtubeLink,
        facebookLink,
        appleMusicLink: appleMusicLink || null,
        tidalLink: tidalLink || null,
        amazonMusicLink: amazonMusicLink || null,
        soundcloudLink: soundcloudLink || null,
        sortOrder,
      },
    });

    return NextResponse.json(artist, { status: 201 });
  } catch (error) {
    console.error("Error creating artist:", error);
    return NextResponse.json(
      { error: "Failed to create artist" },
      { status: 500 }
    );
  }
}
