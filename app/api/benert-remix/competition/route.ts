import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// GET /api/benert-remix/competition - Public: get current competition state (no auth)
export async function GET() {
  try {
    const competition = await prisma.benertRemixCompetition.findFirst({
      orderBy: { startedAt: "desc" },
    });

    if (!competition) {
      return NextResponse.json({
        active: false,
        endsAt: null,
        durationHours: null,
      });
    }

    const now = new Date();
    const active = competition.endsAt > now;

    return NextResponse.json({
      active,
      endsAt: competition.endsAt.toISOString(),
      durationHours: competition.durationHours,
    });
  } catch (error) {
    console.error("Benert remix competition status error:", error);
    return NextResponse.json(
      { error: "Failed to get competition status" },
      { status: 500 }
    );
  }
}
