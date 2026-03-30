import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering - prevent static generation
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const getOptionalDate = (value: unknown): Date | null => {
  if (!value) return null;
  if (value instanceof Date) return value;
  const parsed = new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

// GET /api/releases - Get all singles, albums and EPs with artist info
export async function GET() {
  try {
    // Fetch all singles
    const singles = await prisma.single.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Fetch all albums
    const albums = await prisma.album.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Fetch all EPs
    const eps = await prisma.ep.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Get all unique artist IDs
    const allArtistIds = new Set<string>();
    albums.forEach(album => {
      album.primaryArtistIds.forEach(id => allArtistIds.add(String(id)));
      album.featureArtistIds.forEach(id => allArtistIds.add(String(id)));
    });
    eps.forEach(ep => {
      ep.primaryArtistIds.forEach(id => allArtistIds.add(String(id)));
      ep.featureArtistIds.forEach(id => allArtistIds.add(String(id)));
    });
    singles.forEach(single => {
      single.primaryArtistIds.forEach(id => allArtistIds.add(String(id)));
      single.featureArtistIds.forEach(id => allArtistIds.add(String(id)));
    });

    // Fetch all artists
    const artists = await prisma.artist.findMany({
      where: {
        id: { in: Array.from(allArtistIds) },
      },
      select: {
        id: true,
        name: true,
      }
    });

    // Mongo ObjectIds can come back in varying representations; normalize to strings.
    const artistMap = new Map(artists.map(a => [String(a.id), a]));

    const formatArtistLine = (primaryName: string, featureNames: string[]) => {
      const unique = Array.from(new Set(featureNames.filter(Boolean)));
      return unique.length > 0 ? `${primaryName} ft ${unique.join(", ")}` : primaryName;
    };

    /** Feature IDs that are not also listed as primary (avoid dupes / bad data). */
    const featureIdsExcludingPrimary = (
      featureIds: string[],
      primaryIds: string[]
    ) => {
      const primarySet = new Set(primaryIds.map(String));
      return featureIds.filter((id) => !primarySet.has(String(id)));
    };

    const primaryNamesFromIds = (ids: string[]) => {
      const names = ids
        .map((id) => artistMap.get(String(id))?.name)
        .filter((n): n is string => Boolean(n));
      return names.length ? names.join(", ") : "Unknown Artist";
    };

    // Exclude tracks already included in albums/EPs from singles section
    const usedSongIds = new Set<string>();
    albums.forEach((album) =>
      album.songIds.forEach((id) => usedSongIds.add(String(id)))
    );
    eps.forEach((ep) => ep.songIds.forEach((id) => usedSongIds.add(String(id))));

    // Combine and format releases
    const releases = [
      ...singles
        .filter((single) => !usedSongIds.has(single.id))
        .map(single => {
          const primaryIds = single.primaryArtistIds || [];
          const primaryArtistId = primaryIds[0];
          const featureArtistIds = featureIdsExcludingPrimary(
            single.featureArtistIds || [],
            primaryIds
          );
          const featureArtistNames = Array.from(
            new Set(
              featureArtistIds
                .map((id: string) => artistMap.get(String(id))?.name)
                .filter((name): name is string => Boolean(name))
            )
          );
          const primaryName = primaryNamesFromIds(primaryIds);
          const singleReleaseDate = getOptionalDate(
            (single as unknown as Record<string, unknown>).releaseDate
          );

          return {
            id: single.id,
            name: single.name,
            thumbnail: single.image,
            audio: single.audioFile,
            type: 'single' as const,
            primaryArtistName: primaryName,
            artist: formatArtistLine(primaryName, featureArtistNames),
            artistId: primaryArtistId ? String(primaryArtistId) : '',
            featureArtistIds,
            featureArtistNames,
            releaseDate: singleReleaseDate,
            spotifyLink: single.spotifyLink || null,
            appleMusicLink: single.appleMusicLink || null,
            tidalLink: single.tidalLink || null,
            amazonMusicLink: single.amazonMusicLink || null,
            youtubeLink: single.youtubeLink || null,
            soundcloudLink: single.soundcloudLink || null,
            createdAt: single.createdAt,
            year: singleReleaseDate
              ? singleReleaseDate.getFullYear().toString()
              : new Date(single.createdAt).getFullYear().toString(),
            songCount: 1,
          };
        }),
      ...albums.map(album => {
        const primaryIds = album.primaryArtistIds || [];
        const primaryArtistId = primaryIds[0];
        const featureArtistIds = featureIdsExcludingPrimary(
          album.featureArtistIds || [],
          primaryIds
        );
        const featureArtistNames = Array.from(
          new Set(
            featureArtistIds
              .map((id: string) => artistMap.get(String(id))?.name)
              .filter((name): name is string => Boolean(name))
          )
        );
        const primaryName = primaryNamesFromIds(primaryIds);
        
        return {
          id: album.id,
          name: album.name,
          thumbnail: album.coverImage,
          audio: null, // Albums don't have a single audio file
          type: 'album' as const,
          primaryArtistName: primaryName,
          artist: formatArtistLine(primaryName, featureArtistNames),
          artistId: primaryArtistId ? String(primaryArtistId) : '',
          featureArtistIds,
          featureArtistNames,
          releaseDate: album.releaseDate,
          spotifyLink: album.spotifyLink || null,
          appleMusicLink: album.appleMusicLink || null,
          tidalLink: album.tidalLink || null,
          amazonMusicLink: album.amazonMusicLink || null,
          youtubeLink: album.youtubeLink || null,
          soundcloudLink: album.soundcloudLink || null,
          createdAt: album.createdAt,
          year: album.releaseDate 
            ? new Date(album.releaseDate).getFullYear().toString()
            : new Date(album.createdAt).getFullYear().toString(),
          songCount: album.songIds.length,
        };
      }),
      ...eps.map(ep => {
        const primaryIds = ep.primaryArtistIds || [];
        const primaryArtistId = primaryIds[0];
        const featureArtistIds = featureIdsExcludingPrimary(
          ep.featureArtistIds || [],
          primaryIds
        );
        const featureArtistNames = Array.from(
          new Set(
            featureArtistIds
              .map((id: string) => artistMap.get(String(id))?.name)
              .filter((name): name is string => Boolean(name))
          )
        );
        const primaryName = primaryNamesFromIds(primaryIds);
        const epReleaseDate = getOptionalDate(
          (ep as unknown as Record<string, unknown>).releaseDate
        );
        
        return {
          id: ep.id,
          name: ep.name,
          thumbnail: ep.coverImage,
          audio: null, // EPs don't have a single audio file
          type: 'ep' as const,
          primaryArtistName: primaryName,
          artist: formatArtistLine(primaryName, featureArtistNames),
          artistId: primaryArtistId ? String(primaryArtistId) : '',
          featureArtistIds,
          featureArtistNames,
          releaseDate: epReleaseDate,
          spotifyLink: ep.spotifyLink || null,
          appleMusicLink: ep.appleMusicLink || null,
          tidalLink: ep.tidalLink || null,
          amazonMusicLink: ep.amazonMusicLink || null,
          youtubeLink: ep.youtubeLink || null,
          soundcloudLink: ep.soundcloudLink || null,
          createdAt: ep.createdAt,
          year: epReleaseDate
            ? epReleaseDate.getFullYear().toString()
            : new Date(ep.createdAt).getFullYear().toString(),
          songCount: ep.songIds.length,
        };
      })
    ];

    // Sort by creation date (newest first)
    releases.sort((a, b) => {
      const dateA = a.releaseDate ? new Date(a.releaseDate).getTime() : new Date(a.createdAt).getTime();
      const dateB = b.releaseDate ? new Date(b.releaseDate).getTime() : new Date(b.createdAt).getTime();
      return dateB - dateA;
    });

    return NextResponse.json(releases);
  } catch (error) {
    console.error("Error fetching releases:", error);
    return NextResponse.json(
      { error: "Failed to fetch releases" },
      { status: 500 }
    );
  }
}

