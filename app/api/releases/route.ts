import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  apiKindToPrisma,
  buildArtistMap,
  featureIdsExcludingPrimary,
  formatArtistLine,
  getOptionalDate,
  primaryNamesFromIds,
  prismaKindToApi,
} from "@/lib/release-format";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// GET /api/releases — list releases for public grid (optional `?limit=` for home carousel)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limitRaw = searchParams.get("limit");
    let take: number | undefined;
    if (limitRaw !== null && limitRaw !== "") {
      const n = parseInt(limitRaw, 10);
      if (Number.isFinite(n) && n > 0) {
        take = Math.min(n, 100);
      }
    }

    const releases = await prisma.release.findMany({
      ...(take !== undefined ? { take } : {}),
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      include: {
        tracks: { orderBy: { sortOrder: "asc" } },
      },
    });

    const allArtistIds = new Set<string>();
    releases.forEach((r) => {
      r.primaryArtistIds.forEach((id) => allArtistIds.add(String(id)));
      r.featureArtistIds.forEach((id) => allArtistIds.add(String(id)));
    });

    const artists = await prisma.artist.findMany({
      where: { id: { in: Array.from(allArtistIds) } },
      select: { id: true, name: true },
    });
    const artistMap = buildArtistMap(artists);

    const out = releases.map((r) => {
      const primaryIds = r.primaryArtistIds || [];
      const primaryArtistId = primaryIds[0];
      const featureArtistIds = featureIdsExcludingPrimary(
        r.featureArtistIds || [],
        primaryIds
      );
      const featureArtistNames = Array.from(
        new Set(
          featureArtistIds
            .map((id: string) => artistMap.get(String(id))?.name)
            .filter((name): name is string => Boolean(name))
        )
      );
      const primaryName = primaryNamesFromIds(primaryIds, artistMap);
      const rd = getOptionalDate(r.releaseDate);

      const firstAudio = r.tracks[0]?.audioFile ?? null;

      return {
        id: r.id,
        name: r.name,
        thumbnail: r.coverImage,
        audio: firstAudio,
        type: prismaKindToApi(r.kind),
        primaryArtistName: primaryName,
        artist: formatArtistLine(primaryName, featureArtistNames),
        artistId: primaryArtistId ? String(primaryArtistId) : "",
        featureArtistIds,
        featureArtistNames,
        releaseDate: r.releaseDate,
        upcCode: r.upcCode,
        spotifyLink: r.spotifyLink || null,
        appleMusicLink: r.appleMusicLink || null,
        tidalLink: r.tidalLink || null,
        amazonMusicLink: r.amazonMusicLink || null,
        youtubeLink: r.youtubeLink || null,
        soundcloudLink: r.soundcloudLink || null,
        isrcExplicit: r.isrcExplicit,
        sortOrder: r.sortOrder,
        showLatestOnHome: r.showLatestOnHome,
        createdAt: r.createdAt,
        year: rd
          ? rd.getFullYear().toString()
          : new Date(r.createdAt).getFullYear().toString(),
        songCount: r.tracks.length,
      };
    });

    return NextResponse.json(out);
  } catch (error) {
    console.error("Error fetching releases:", error);
    return NextResponse.json(
      { error: "Failed to fetch releases" },
      { status: 500 }
    );
  }
}

// POST /api/releases — create release shell (tracks added separately)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const kind = apiKindToPrisma(body.kind);
    if (!kind) {
      return NextResponse.json(
        { error: "kind must be single, ep, or album" },
        { status: 400 }
      );
    }

    const {
      name,
      coverImage,
      releaseDate,
      description,
      composer,
      lyricist,
      leadVocal,
      upcCode,
      isrcExplicit,
      spotifyLink,
      appleMusicLink,
      tidalLink,
      amazonMusicLink,
      youtubeLink,
      soundcloudLink,
      primaryArtistIds,
      featureArtistIds,
    } = body;

    if (!name || !coverImage) {
      return NextResponse.json(
        { error: "name and coverImage are required" },
        { status: 400 }
      );
    }
    if (!upcCode || !String(upcCode).trim()) {
      return NextResponse.json(
        { error: "upcCode is required" },
        { status: 400 }
      );
    }

    if (
      !primaryArtistIds ||
      !Array.isArray(primaryArtistIds) ||
      primaryArtistIds.length === 0
    ) {
      return NextResponse.json(
        { error: "At least one primary artist is required" },
        { status: 400 }
      );
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

    const featIds = featureArtistIds || [];
    if (featIds.length > 0) {
      const featureArtists = await prisma.artist.findMany({
        where: { id: { in: featIds } },
      });
      if (featureArtists.length !== featIds.length) {
        return NextResponse.json(
          { error: "One or more feature artists not found" },
          { status: 404 }
        );
      }
    }

    const maxOrder = await prisma.release.aggregate({
      _max: { sortOrder: true },
    });
    const sortOrder = (maxOrder._max.sortOrder ?? -1) + 1;

    const release = await prisma.release.create({
      data: {
        kind,
        name: String(name),
        coverImage: String(coverImage),
        primaryArtistIds,
        featureArtistIds: featIds,
        sortOrder,
        releaseDate: releaseDate ? new Date(releaseDate) : null,
        description: description ? String(description) : null,
        composer: composer ? String(composer) : null,
        lyricist: lyricist ? String(lyricist) : null,
        leadVocal: leadVocal ? String(leadVocal) : null,
        upcCode: upcCode ? String(upcCode) : null,
        isrcExplicit: Boolean(isrcExplicit),
        spotifyLink: spotifyLink || null,
        appleMusicLink: appleMusicLink || null,
        tidalLink: tidalLink || null,
        amazonMusicLink: amazonMusicLink || null,
        youtubeLink: youtubeLink || null,
        soundcloudLink: soundcloudLink || null,
      },
      include: { tracks: { orderBy: { sortOrder: "asc" } } },
    });

    const allArtistIds = [
      ...release.primaryArtistIds,
      ...release.featureArtistIds,
    ];
    const artists = await prisma.artist.findMany({
      where: { id: { in: allArtistIds } },
      select: { id: true, name: true, profilePicture: true },
    });

    return NextResponse.json(
      {
        ...release,
        type: prismaKindToApi(release.kind),
        songs: release.tracks,
        tracks: release.tracks,
        artists,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating release:", error);
    return NextResponse.json(
      { error: "Failed to create release" },
      { status: 500 }
    );
  }
}
