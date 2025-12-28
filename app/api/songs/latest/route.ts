import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering - prevent static generation
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET /api/songs/latest - Get latest songs (singles) with artist info
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "8", 10);

    // Get latest singles with artist info
    const singles = await prisma.single.findMany({
      take: limit,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        artist: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          }
        }
      }
    });

    return NextResponse.json(singles);
  } catch (error) {
    console.error("Error fetching latest songs:", error);
    return NextResponse.json(
      { error: "Failed to fetch latest songs" },
      { status: 500 }
    );
  }
}


