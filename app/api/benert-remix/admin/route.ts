import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ADMIN_EMAIL = "oscillationrecordz@gmail.com";
const TIMER_HOURS = 24;

// GET /api/benert-remix/admin - List all users who have uploaded (admin only)
export async function GET(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.email || token.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const entries = await prisma.benertRemixEntry.findMany({
      where: { uploadedFileUrl: { not: null } },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const rows = entries.map((entry) => {
      const timerEndsAt = entry.downloadStartedAt
        ? new Date(
            entry.downloadStartedAt.getTime() +
              TIMER_HOURS * 60 * 60 * 1000
          )
        : null;
      const now = new Date();
      const timeRemaining =
        timerEndsAt && timerEndsAt > now
          ? Math.max(0, Math.floor((timerEndsAt.getTime() - now.getTime()) / 1000))
          : null;
      const timeRemainingLabel = entry.uploadedFileUrl
        ? "Submitted"
        : timeRemaining !== null
          ? formatDuration(timeRemaining)
          : "—";

      return {
        id: entry.id,
        name: entry.user.name ?? "—",
        email: entry.user.email ?? "—",
        timeRemaining: timeRemainingLabel,
        musicFileUrl: entry.uploadedFileUrl,
      };
    });

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Benert remix admin list error:", error);
    return NextResponse.json(
      { error: "Failed to list entries" },
      { status: 500 }
    );
  }
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}
