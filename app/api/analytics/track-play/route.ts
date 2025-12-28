import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering - prevent static generation
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// POST /api/analytics/track-play - Track when a user plays content
export async function POST(request: NextRequest) {
  try {
    // Safeguard: Ensure NEXTAUTH_SECRET is available
    if (!process.env.NEXTAUTH_SECRET) {
      console.error("NEXTAUTH_SECRET is not configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });

    if (!token || !token.sub) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { contentType, contentId, contentName, artistId, artistName, playDuration, completed } = body;

    if (!contentType || !contentId || !contentName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find or create user by email
    let user = await prisma.user.findUnique({
      where: { email: token.email as string },
    });

    if (!user) {
      // Create user if doesn't exist
      user = await prisma.user.create({
        data: {
          email: token.email as string,
          name: token.name as string,
          image: token.picture as string,
        },
      });
    }

    // Create play event
    const playEvent = await prisma.playEvent.create({
      data: {
        userId: user.id,
        contentType,
        contentId,
        contentName,
        artistId: artistId || null,
        artistName: artistName || null,
        playDuration: playDuration || null,
        completed: completed || false,
      },
    });

    return NextResponse.json({ success: true, playEvent });
  } catch (error) {
    console.error("Error tracking play:", error);
    return NextResponse.json(
      { error: "Failed to track play" },
      { status: 500 }
    );
  }
}

