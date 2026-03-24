import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ singleId: string }> }
) {
  try {
    const { singleId } = await params;

    const single = await prisma.single.findUnique({
      where: { id: singleId },
    });

    if (!single) {
      return NextResponse.json({ error: "Single not found" }, { status: 404 });
    }

    const [albums, eps] = await Promise.all([
      prisma.album.findMany({
        where: {
          songIds: { has: singleId },
        },
      }),
      prisma.ep.findMany({
        where: {
          songIds: { has: singleId },
        },
      }),
    ]);

    if (albums.length > 0 || eps.length > 0) {
      return NextResponse.json(
        {
          error:
            "Cannot delete single: it is used in an album or EP. Remove it from the album/EP first.",
        },
        { status: 400 }
      );
    }

    await prisma.single.delete({
      where: { id: singleId },
    });

    return NextResponse.json({ message: "Single deleted successfully" });
  } catch (error) {
    console.error("Error deleting single:", error);
    return NextResponse.json({ error: "Failed to delete single" }, { status: 500 });
  }
}
