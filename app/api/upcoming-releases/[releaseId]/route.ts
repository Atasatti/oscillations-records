import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ releaseId: string }> }
) {
  try {
    const { releaseId } = await params;

    const existing = await prisma.upcomingRelease.findUnique({
      where: { id: releaseId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Upcoming release not found" },
        { status: 404 }
      );
    }

    await prisma.upcomingRelease.delete({
      where: { id: releaseId },
    });

    return NextResponse.json({ message: "Upcoming release deleted successfully" });
  } catch (error) {
    console.error("Error deleting upcoming release:", error);
    return NextResponse.json(
      { error: "Failed to delete upcoming release" },
      { status: 500 }
    );
  }
}
