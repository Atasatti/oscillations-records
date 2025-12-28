import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering - prevent static generation
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET /api/analytics/content/[contentId] - Get detailed analytics for a specific content item
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ contentId: string }> }
) {
  try {
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });

    // Check if user is admin
    if (!token ) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { contentId } = await params;
    const { searchParams } = new URL(request.url);
    const contentType = searchParams.get("type") || "single"; // single, album, or ep
    const days = parseInt(searchParams.get("days") || "30", 10);
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get all play events for this content
    const playEvents = await prisma.playEvent.findMany({
      where: {
        contentId,
        contentType,
        createdAt: {
          gte: startDate,
        },
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate statistics
    const totalPlays = playEvents.length;
    const uniqueUsers = new Set(playEvents.map(e => e.userId)).size;
    const completedPlays = playEvents.filter(e => e.completed).length;
    const averagePlayDuration = playEvents
      .filter(e => e.playDuration)
      .reduce((sum, e) => sum + (e.playDuration || 0), 0) / 
      (playEvents.filter(e => e.playDuration).length || 1);

    // Demographics breakdown
    const genderStats = {
      male: 0,
      female: 0,
      other: 0,
      prefer_not_to_say: 0,
      unknown: 0,
    };

    const ageRangeStats = {
      "18-24": 0,
      "25-34": 0,
      "35-44": 0,
      "45-54": 0,
      "55+": 0,
      unknown: 0,
    };

    const countryStats = new Map<string, number>();
    const cityStats = new Map<string, number>();

    playEvents.forEach(event => {
      const profile = event.user.profile;
      if (profile) {
        if (profile.gender) {
          genderStats[profile.gender as keyof typeof genderStats] = 
            (genderStats[profile.gender as keyof typeof genderStats] || 0) + 1;
        } else {
          genderStats.unknown++;
        }

        if (profile.ageRange) {
          ageRangeStats[profile.ageRange as keyof typeof ageRangeStats] = 
            (ageRangeStats[profile.ageRange as keyof typeof ageRangeStats] || 0) + 1;
        } else {
          ageRangeStats.unknown++;
        }

        if (profile.country) {
          countryStats.set(profile.country, (countryStats.get(profile.country) || 0) + 1);
        }

        if (profile.city) {
          cityStats.set(profile.city, (cityStats.get(profile.city) || 0) + 1);
        }
      } else {
        genderStats.unknown++;
        ageRangeStats.unknown++;
      }
    });

    // Plays over time
    const playsByDate = new Map<string, number>();
    playEvents.forEach(event => {
      const date = event.createdAt.toISOString().split('T')[0];
      playsByDate.set(date, (playsByDate.get(date) || 0) + 1);
    });

    const playsOverTime = Array.from(playsByDate.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // User engagement details
    const userEngagement = playEvents.map(event => ({
      userId: event.userId,
      userName: event.user.name || event.user.email,
      userEmail: event.user.email,
      gender: event.user.profile?.gender || null,
      ageRange: event.user.profile?.ageRange || null,
      country: event.user.profile?.country || null,
      city: event.user.profile?.city || null,
      playDuration: event.playDuration,
      completed: event.completed,
      createdAt: event.createdAt,
    }));

    // Top users by play count
    const userPlayCounts = new Map<string, number>();
    playEvents.forEach(event => {
      userPlayCounts.set(
        event.userId,
        (userPlayCounts.get(event.userId) || 0) + 1
      );
    });

    const topUsers = Array.from(userPlayCounts.entries())
      .map(([userId, count]) => {
        const userEvent = playEvents.find(e => e.userId === userId);
        return {
          userId,
          userName: userEvent?.user.name || userEvent?.user.email,
          playCount: count,
          profile: userEvent?.user.profile,
        };
      })
      .sort((a, b) => b.playCount - a.playCount)
      .slice(0, 10);

    return NextResponse.json({
      contentId,
      contentType,
      summary: {
        totalPlays,
        uniqueUsers,
        completedPlays,
        completionRate: totalPlays > 0 ? (completedPlays / totalPlays) * 100 : 0,
        averagePlayDuration: Math.floor(averagePlayDuration),
      },
      demographics: {
        gender: genderStats,
        ageRange: ageRangeStats,
        topCountries: Array.from(countryStats.entries())
          .map(([country, count]) => ({ country, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10),
        topCities: Array.from(cityStats.entries())
          .map(([city, count]) => ({ city, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10),
      },
      playsOverTime,
      topUsers,
      userEngagement,
    });
  } catch (error) {
    console.error("Error fetching content analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch content analytics" },
      { status: 500 }
    );
  }
}


