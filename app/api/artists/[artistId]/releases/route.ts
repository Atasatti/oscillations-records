import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// GET releases that list this artist as primary or feature
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ artistId: string }> }
) {
  try {
    const { artistId } = await params;

    const releases = await prisma.release.findMany({
      where: {
        OR: [
          { primaryArtistIds: { has: artistId } },
          { featureArtistIds: { has: artistId } },
        ],
      },
      orderBy: { createdAt: "desc" },
      include: {
        tracks: { orderBy: { sortOrder: "asc" } },
      },
    });

    return NextResponse.json(releases);
  } catch (error) {
    console.error("Error fetching artist releases:", error);
    return NextResponse.json(
      { error: "Failed to fetch releases" },
      { status: 500 }
    );
  }
}
