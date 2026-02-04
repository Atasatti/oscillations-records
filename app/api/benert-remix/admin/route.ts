import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ADMIN_EMAIL = "oscillationrecordz@gmail.com";

// GET /api/benert-remix/admin - List all submissions (admin only)
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

    const rows = entries.map((entry) => ({
      id: entry.id,
      name: entry.user.name ?? "—",
      email: entry.user.email ?? "—",
      musicFileUrl: entry.uploadedFileUrl,
    }));

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Benert remix admin list error:", error);
    return NextResponse.json(
      { error: "Failed to list entries" },
      { status: 500 }
    );
  }
}
