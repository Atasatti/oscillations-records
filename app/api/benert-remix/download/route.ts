import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// POST /api/benert-remix/download - Record that user started download (for 24h timer). File is downloaded from client via /bsk-stem.zip
export async function POST(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.sub || !token?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Resolve user by email (JWT sub is provider id, not DB user id)
    let user = await prisma.user.findUnique({
      where: { email: token.email as string },
    });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: token.email as string,
          name: (token.name as string) ?? null,
          image: (token.picture as string) ?? null,
        },
      });
    }

    const entry = await prisma.benertRemixEntry.findUnique({
      where: { userId: user.id },
    });

    if (entry?.downloadStartedAt) {
      return NextResponse.json({ error: "Already downloaded" }, { status: 400 });
    }

    const now = new Date();

    await prisma.benertRemixEntry.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        downloadStartedAt: now,
      },
      update: {
        downloadStartedAt: now,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Benert remix download error:", error);
    return NextResponse.json(
      { error: "Failed to record download" },
      { status: 500 }
    );
  }
}
