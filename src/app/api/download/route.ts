import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { modId, versionId } = await request.json();

    if (!modId || !versionId) {
      return NextResponse.json(
        { error: "Missing modId or versionId" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Increment mod downloads
    await supabase.rpc("increment_mod_downloads", { mod_id: modId });

    // Increment version downloads
    await supabase.rpc("increment_version_downloads", { version_id: versionId });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Download tracking error:", error);
    return NextResponse.json(
      { error: "Failed to track download" },
      { status: 500 }
    );
  }
}

