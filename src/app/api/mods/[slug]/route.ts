import { NextRequest, NextResponse } from "next/server";
import { getModForEdit } from "@/lib/supabase/queries";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const mod = await getModForEdit(slug);

    if (!mod) {
      return NextResponse.json(
        { error: "Mod not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(mod);
  } catch (error) {
    console.error("Error fetching mod:", error);
    return NextResponse.json(
      { error: "Failed to fetch mod" },
      { status: 500 }
    );
  }
}

