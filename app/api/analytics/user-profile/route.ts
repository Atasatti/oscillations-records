import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering - prevent static generation
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// POST /api/analytics/user-profile - Store or update user demographics
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
    const { gender, age, ageRange, country, city } = body;

    // Find or create user by email
    let user = await prisma.user.findUnique({
      where: { email: token.email as string },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: token.email as string,
          name: token.name as string,
          image: token.picture as string,
        },
      });
    }

    // Upsert user profile
    const profile = await prisma.userProfile.upsert({
      where: { userId: user.id },
      update: {
        gender: gender || undefined,
        age: age || undefined,
        ageRange: ageRange || undefined,
        country: country || undefined,
        city: city || undefined,
      },
      create: {
        userId: user.id,
        gender: gender || null,
        age: age || null,
        ageRange: ageRange || null,
        country: country || null,
        city: city || null,
      },
    });

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Failed to update user profile" },
      { status: 500 }
    );
  }
}

// GET /api/analytics/user-profile - Get user profile
export async function GET(request: NextRequest) {
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

    const user = await prisma.user.findUnique({
      where: { email: token.email as string },
      include: { profile: true },
    });

    if (!user) {
      return NextResponse.json({ profile: null });
    }

    return NextResponse.json({ profile: user.profile });
  } catch (error) {
    console.error("Error getting user profile:", error);
    return NextResponse.json(
      { error: "Failed to get user profile" },
      { status: 500 }
    );
  }
}

