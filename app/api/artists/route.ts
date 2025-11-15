import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/artists - Get all artists
export async function GET() {
  try {
    const artists = await prisma.artist.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json(artists);
  } catch (error) {
    console.error("Error fetching artists:", error);
    return NextResponse.json(
      { error: "Failed to fetch artists" },
      { status: 500 }
    );
  }
}

// POST /api/artists - Create a new artist
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      biography,
      profilePicture,
      xLink,
      tiktokLink,
      spotifyLink,
      instagramLink,
      youtubeLink,
      facebookLink,
    } = body;

    // Validate required fields
    if (!name || !biography) {
      return NextResponse.json(
        { error: "Name and biography are required" },
        { status: 400 }
      );
    }

    const artist = await prisma.artist.create({
      data: {
        name,
        biography,
        profilePicture,
        xLink,
        tiktokLink,
        spotifyLink,
        instagramLink,
        youtubeLink,
        facebookLink,
      },
    });

    return NextResponse.json(artist, { status: 201 });
  } catch (error) {
    console.error("Error creating artist:", error);
    return NextResponse.json(
      { error: "Failed to create artist" },
      { status: 500 }
    );
  }
}
