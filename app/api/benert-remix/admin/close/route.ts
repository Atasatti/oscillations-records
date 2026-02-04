import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ADMIN_EMAIL = "oscillationrecordz@gmail.com";

// POST /api/benert-remix/admin/close - Terminate the current competition (admin only, for testing)
export async function POST(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.email || token.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const competition = await prisma.benertRemixCompetition.findFirst({
      orderBy: { startedAt: "desc" },
    });

    if (!competition || competition.endsAt <= new Date()) {
      return NextResponse.json(
        { error: "No active competition to close" },
        { status: 400 }
      );
    }

    await prisma.benertRemixCompetition.update({
      where: { id: competition.id },
      data: { endsAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Benert remix admin close error:", error);
    return NextResponse.json(
      { error: "Failed to close competition" },
      { status: 500 }
    );
  }
}
