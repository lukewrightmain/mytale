import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";
import crypto from "crypto";

// Use service role to bypass RLS for voting
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Hash the IP for privacy
function hashIP(ip: string): string {
  // Add a salt for extra security
  const salt = process.env.IP_HASH_SALT || "mytale-builders-salt";
  return crypto.createHash("sha256").update(ip + salt).digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    const { builderId } = await request.json();

    if (!builderId) {
      return NextResponse.json(
        { success: false, error: "Builder ID is required" },
        { status: 400 }
      );
    }

    // Get client IP
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIP = request.headers.get("x-real-ip");
    const ip = forwardedFor?.split(",")[0] || realIP || "unknown";
    const ipHash = hashIP(ip);

    // Get user ID if logged in (optional)
    const { userId } = await auth();
    let profileId: string | null = null;

    if (userId) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("clerk_id", userId)
        .single();
      
      profileId = profile?.id || null;
    }

    // Call the upvote function
    // Using type assertion to bypass strict RPC type checking
    const { data, error } = await (supabase.rpc as Function)("upvote_builder", {
      p_builder_id: builderId,
      p_ip_hash: ipHash,
      p_user_id: profileId,
    });

    if (error) {
      console.error("Upvote error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to upvote" },
        { status: 500 }
      );
    }

    // The function returns JSON with success/error
    if (data.error === "already_voted") {
      return NextResponse.json(
        { success: false, error: "You have already upvoted this builder" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      upvotes: data.upvotes,
    });
  } catch (error) {
    console.error("Upvote error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred" },
      { status: 500 }
    );
  }
}

// Check if user has upvoted
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const builderId = searchParams.get("builderId");

    if (!builderId) {
      return NextResponse.json(
        { success: false, error: "Builder ID is required" },
        { status: 400 }
      );
    }

    // Get client IP
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIP = request.headers.get("x-real-ip");
    const ip = forwardedFor?.split(",")[0] || realIP || "unknown";
    const ipHash = hashIP(ip);

    // Check if upvoted
    // Using type assertion to bypass strict RPC type checking
    const { data, error } = await (supabase.rpc as Function)("has_upvoted_builder", {
      p_builder_id: builderId,
      p_ip_hash: ipHash,
    });

    if (error) {
      console.error("Check upvote error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to check upvote status" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      hasUpvoted: data,
    });
  } catch (error) {
    console.error("Check upvote error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred" },
      { status: 500 }
    );
  }
}
