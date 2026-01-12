import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type ContentType = "mod" | "plugin" | "map" | "texture";

export async function POST(request: NextRequest) {
  try {
    const { type, contentId, versionId } = await request.json();

    if (!type || !contentId) {
      return NextResponse.json(
        { error: "Missing type or contentId" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Track downloads based on content type
    // Using type assertion to bypass strict RPC type checking
    switch (type as ContentType) {
      case "mod":
        await (supabase.rpc as Function)("increment_mod_downloads", { mod_id: contentId });
        if (versionId) {
          await (supabase.rpc as Function)("increment_mod_version_downloads", { version_id: versionId });
        }
        break;

      case "plugin":
        await (supabase.rpc as Function)("increment_plugin_downloads", { plugin_id: contentId });
        if (versionId) {
          await (supabase.rpc as Function)("increment_plugin_version_downloads", { version_id: versionId });
        }
        break;

      case "map":
        await (supabase.rpc as Function)("increment_map_downloads", { map_id: contentId });
        if (versionId) {
          await (supabase.rpc as Function)("increment_map_version_downloads", { version_id: versionId });
        }
        break;

      case "texture":
        await (supabase.rpc as Function)("increment_texture_downloads", { texture_id: contentId });
        if (versionId) {
          await (supabase.rpc as Function)("increment_texture_version_downloads", { version_id: versionId });
        }
        break;

      default:
        return NextResponse.json(
          { error: "Invalid content type" },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Download tracking error:", error);
    return NextResponse.json(
      { error: "Failed to track download" },
      { status: 500 }
    );
  }
}
