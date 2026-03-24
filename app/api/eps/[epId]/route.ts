import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ epId: string }> }
) {
  try {
    const { epId } = await params;

    const ep = await prisma.ep.findUnique({
      where: { id: epId },
    });

    if (!ep) {
      return NextResponse.json({ error: "EP not found" }, { status: 404 });
    }

    const songs = await prisma.single.findMany({
      where: {
        id: { in: ep.songIds },
      },
    });

    return NextResponse.json({
      ...ep,
      songs,
    });
  } catch (error) {
    console.error("Error fetching EP:", error);
    return NextResponse.json({ error: "Failed to fetch EP" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ epId: string }> }
) {
  try {
    const { epId } = await params;

    const ep = await prisma.ep.findUnique({
      where: { id: epId },
    });

    if (!ep) {
      return NextResponse.json({ error: "EP not found" }, { status: 404 });
    }

    await prisma.ep.delete({
      where: { id: epId },
    });

    return NextResponse.json({ message: "EP deleted successfully" });
  } catch (error) {
    console.error("Error deleting EP:", error);
    return NextResponse.json({ error: "Failed to delete EP" }, { status: 500 });
  }
}
