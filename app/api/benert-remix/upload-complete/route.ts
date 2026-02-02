import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// POST /api/benert-remix/upload-complete - Save uploaded file URL (stops timer)
export async function POST(request: NextRequest) {
  try {
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
      return NextResponse.json(
        { error: "Download the STEM first" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { fileURL } = body;

    if (!fileURL || typeof fileURL !== "string") {
      return NextResponse.json(
        { error: "fileURL is required" },
        { status: 400 }
      );
    }

    const entry = await prisma.benertRemixEntry.findUnique({
      where: { userId: user.id },
    });

    if (!entry?.downloadStartedAt) {
      return NextResponse.json(
        { error: "Download the STEM first" },
        { status: 400 }
      );
    }

    if (entry.uploadedFileUrl) {
      return NextResponse.json(
        { error: "You have already submitted your remix" },
        { status: 400 }
      );
    }

    await prisma.benertRemixEntry.update({
      where: { userId: user.id },
      data: { uploadedFileUrl: fileURL },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Benert remix upload-complete error:", error);
    return NextResponse.json(
      { error: "Failed to save upload" },
      { status: 500 }
    );
  }
}
