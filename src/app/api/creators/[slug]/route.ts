import { NextRequest, NextResponse } from "next/server";
import { getContentCreatorForEdit } from "@/lib/supabase/queries";
import { checkContentCreatorOwnership } from "@/lib/supabase/actions";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const creator = await getContentCreatorForEdit(slug);

    if (!creator) {
      return NextResponse.json(
        { error: "Creator not found" },
        { status: 404 }
      );
    }

    // Check ownership
    const isOwner = await checkContentCreatorOwnership(creator.id);
    if (!isOwner) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    return NextResponse.json(creator);
  } catch (error) {
    console.error("Error fetching creator:", error);
    return NextResponse.json(
      { error: "Failed to fetch creator" },
      { status: 500 }
    );
  }
}

