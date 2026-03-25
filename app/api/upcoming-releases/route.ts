import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const VALID_TYPES = new Set(["single", "ep", "album"]);

export async function GET() {
  try {
    const now = new Date();

    // Auto-cleanup releases that have reached/passed release date.
    await prisma.upcomingRelease.deleteMany({
      where: { releaseDate: { lte: now } },
    });

    const releases = await prisma.upcomingRelease.findMany({
      where: { releaseDate: { gt: now } },
      orderBy: { releaseDate: "asc" },
    });

    return NextResponse.json(releases);
  } catch (error) {
    console.error("Error fetching upcoming releases:", error);
    return NextResponse.json(
      { error: "Failed to fetch upcoming releases" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, image, releaseDate } = body;

    if (!name || !type || !image || !releaseDate) {
      return NextResponse.json(
        { error: "name, type, image, and releaseDate are required" },
        { status: 400 }
      );
    }

    const normalizedType = String(type).toLowerCase();
    if (!VALID_TYPES.has(normalizedType)) {
      return NextResponse.json(
        { error: "type must be one of: single, ep, album" },
        { status: 400 }
      );
    }

    const parsedDate = new Date(releaseDate);
    if (Number.isNaN(parsedDate.getTime())) {
      return NextResponse.json({ error: "Invalid releaseDate" }, { status: 400 });
    }

    const created = await prisma.upcomingRelease.create({
      data: {
        name,
        type: normalizedType,
        image,
        releaseDate: parsedDate,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Error creating upcoming release:", error);
    return NextResponse.json(
      { error: "Failed to create upcoming release" },
      { status: 500 }
    );
  }
}
