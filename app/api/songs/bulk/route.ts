import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** @deprecated Use POST /api/releases with nested `tracks` instead. */
export async function POST() {
  return NextResponse.json(
    {
      error:
        "Bulk song creation has been removed. Create a release with POST /api/releases including a tracks array.",
    },
    { status: 410 }
  );
}
