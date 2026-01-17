import { NextRequest, NextResponse } from "next/server";
import { getMapForEdit } from "@/lib/supabase/queries";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const map = await getMapForEdit(slug);

    if (!map) {
      return NextResponse.json(
        { error: "Map not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(map);
  } catch (error) {
    console.error("Error fetching map:", error);
    return NextResponse.json(
      { error: "Failed to fetch map" },
      { status: 500 }
    );
  }
}

