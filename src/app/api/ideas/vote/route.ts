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
  const salt = process.env.IP_HASH_SALT || "mytale-ideas-salt";
  return crypto.createHash("sha256").update(ip + salt).digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    const { ideaId } = await request.json();

    if (!ideaId) {
      return NextResponse.json(
        { success: false, error: "Idea ID is required" },
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

    // Call the vote function
    // Using type assertion to bypass strict RPC type checking
    const { data, error } = await (supabase.rpc as Function)("vote_for_idea", {
      p_idea_id: ideaId,
      p_ip_hash: ipHash,
      p_user_id: profileId,
    });

    if (error) {
      console.error("Vote error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to vote" },
        { status: 500 }
      );
    }

    // The function returns JSON with success/error
    if (data.error === "already_voted") {
      return NextResponse.json(
        { success: false, error: "You have already voted for this idea" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      votes: data.votes,
    });
  } catch (error) {
    console.error("Vote error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred" },
      { status: 500 }
    );
  }
}

// Check if user has voted
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ideaId = searchParams.get("ideaId");

    if (!ideaId) {
      return NextResponse.json(
        { success: false, error: "Idea ID is required" },
        { status: 400 }
      );
    }

    // Get client IP
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIP = request.headers.get("x-real-ip");
    const ip = forwardedFor?.split(",")[0] || realIP || "unknown";
    const ipHash = hashIP(ip);

    // Check if voted
    // Using type assertion to bypass strict RPC type checking
    const { data, error } = await (supabase.rpc as Function)("has_voted_for_idea", {
      p_idea_id: ideaId,
      p_ip_hash: ipHash,
    });

    if (error) {
      console.error("Check vote error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to check vote status" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      hasVoted: data,
    });
  } catch (error) {
    console.error("Check vote error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred" },
      { status: 500 }
    );
  }
}

