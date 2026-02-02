import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// POST /api/benert-remix/upload-url - Validate user can upload (has downloaded, not uploaded yet)
// This is a validation endpoint - actual presigned URL is obtained from /api/upload/presigned-urls
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

    // Validation passed - client can proceed to get presigned URL from /api/upload/presigned-urls
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Benert remix upload-url validation error:", error);
    return NextResponse.json(
      { error: "Failed to validate upload" },
      { status: 500 }
    );
  }
}
