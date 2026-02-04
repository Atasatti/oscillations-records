import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ADMIN_EMAIL = "oscillationrecordz@gmail.com";

// POST /api/benert-remix/admin/start - Start competition (admin only)
export async function POST(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.email || token.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const durationHours = typeof body.durationHours === "number" ? body.durationHours : 24;

    if (durationHours < 1 || durationHours > 168) {
      return NextResponse.json(
        { error: "Duration must be between 1 and 168 hours" },
        { status: 400 }
      );
    }

    const startedAt = new Date();
    const endsAt = new Date(startedAt.getTime() + durationHours * 60 * 60 * 1000);

    await prisma.benertRemixCompetition.create({
      data: {
        startedAt,
        durationHours,
        endsAt,
      },
    });

    return NextResponse.json({
      success: true,
      startedAt: startedAt.toISOString(),
      endsAt: endsAt.toISOString(),
      durationHours,
    });
  } catch (error) {
    console.error("Benert remix admin start error:", error);
    return NextResponse.json(
      { error: "Failed to start competition" },
      { status: 500 }
    );
  }
}
