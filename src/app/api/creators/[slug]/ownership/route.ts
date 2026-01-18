import { NextRequest, NextResponse } from "next/server";
import { checkContentCreatorOwnership } from "@/lib/supabase/actions";
import { getContentCreatorForEdit } from "@/lib/supabase/queries";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    // First get the creator to get the ID
    const creator = await getContentCreatorForEdit(slug);
    
    if (!creator) {
      return NextResponse.json({ isOwner: false });
    }

    const isOwner = await checkContentCreatorOwnership(creator.id);
    return NextResponse.json({ isOwner });
  } catch (error) {
    console.error("Error checking ownership:", error);
    return NextResponse.json({ isOwner: false });
  }
}

