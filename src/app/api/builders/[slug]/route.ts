import { NextRequest, NextResponse } from "next/server";
import { getBuilderBySlug } from "@/lib/supabase/queries";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const builder = await getBuilderBySlug(slug);

    if (!builder) {
      return NextResponse.json(
        { error: "Builder not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(builder);
  } catch (error) {
    console.error("Error fetching builder:", error);
    return NextResponse.json(
      { error: "Failed to fetch builder" },
      { status: 500 }
    );
  }
}
