import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const TIMER_HOURS = 24;

// GET /api/benert-remix/status - Get current user's competition status
export async function GET(request: NextRequest) {
  try {
    if (!process.env.NEXTAUTH_SECRET) {
      console.error("NEXTAUTH_SECRET is not configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.sub || !token?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: token.email as string },
    });
    if (!user) {
      return NextResponse.json({
        hasDownloaded: false,
        timerEndsAt: null,
        hasUploaded: false,
        fileUrl: null,
      });
    }

    const defaultStatus = {
      hasDownloaded: false,
      timerEndsAt: null,
      hasUploaded: false,
      fileUrl: null,
    };

    let entry;
    try {
      entry = await prisma.benertRemixEntry.findUnique({
        where: { userId: user.id },
      });
    } catch (dbError) {
      const msg = dbError instanceof Error ? dbError.message : String(dbError);
      console.error("Benert remix status DB lookup error:", msg);
      return NextResponse.json(defaultStatus);
    }

    if (!entry) {
      return NextResponse.json(defaultStatus);
    }

    const hasDownloaded = !!entry.downloadStartedAt;
    const timerEndsAt = entry.downloadStartedAt
      ? new Date(entry.downloadStartedAt.getTime() + TIMER_HOURS * 60 * 60 * 1000)
      : null;
    const hasUploaded = !!entry.uploadedFileUrl;

    return NextResponse.json({
      hasDownloaded,
      timerEndsAt: timerEndsAt?.toISOString() ?? null,
      hasUploaded,
      fileUrl: entry.uploadedFileUrl,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;
    console.error("Benert remix status error:", message, stack);
    return NextResponse.json(
      {
        error: "Failed to get status",
        ...(process.env.NODE_ENV === "development" && { detail: message }),
      },
      { status: 500 }
    );
  }
}
