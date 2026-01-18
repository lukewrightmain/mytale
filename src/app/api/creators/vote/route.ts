import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { createHash } from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { creatorId } = await request.json();

    if (!creatorId) {
      return NextResponse.json(
        { success: false, error: "Creator ID is required" },
        { status: 400 }
      );
    }

    // Get IP for vote tracking
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || 
               request.headers.get("x-real-ip") || 
               "unknown";
    const ipHash = createHash("sha256").update(ip + creatorId).digest("hex");

    const supabase = createAdminClient();

    // Call the database function
    const { data, error } = await supabase.rpc("upvote_content_creator", {
      p_creator_id: creatorId,
      p_ip_hash: ipHash,
      p_user_id: null,
    });

    if (error) {
      console.error("Error upvoting creator:", error);
      return NextResponse.json(
        { success: false, error: "Failed to vote" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in vote route:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

