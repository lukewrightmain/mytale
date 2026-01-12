"use server";

import { auth } from "@clerk/nextjs/server";
import { createClient } from "./server";
import { revalidatePath } from "next/cache";

// Helper to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ==========================================
// MOD SUBMISSION
// ==========================================

export interface ModSubmissionData {
  name: string;
  tagline: string;
  description: string;
  category: string;
  modType: string;
  tags: string;
  thumbnailUrl?: string;
  // Version info
  versionNumber: string;
  gameVersion: string;
  downloadUrl: string;
  changelog?: string;
  // Optional support/donation link
  supportUrl?: string;
}

export async function submitMod(data: ModSubmissionData) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "You must be signed in to submit a mod" };
  }

  const supabase = await createClient();

  // Generate slug
  const baseSlug = generateSlug(data.name);
  const timestamp = Date.now().toString(36);
  const slug = `${baseSlug}-${timestamp}`;

  // Parse tags
  const tags = data.tags
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter((tag) => tag.length > 0);

  try {
    // Insert the mod
    const { data: modData, error: modError } = await supabase
      .from("mods")
      .insert({
        name: data.name,
        slug,
        tagline: data.tagline,
        description: data.description,
        category: data.category,
        mod_type: data.modType,
        tags,
        thumbnail_url: data.thumbnailUrl || null,
        support_url: data.supportUrl || null,
        status: "pending",
        is_featured: false,
        downloads: 0,
        rating: 0,
        rating_count: 0,
      })
      .select("id")
      .single();

    if (modError) {
      console.error("Error submitting mod:", modError);
      return { success: false, error: "Failed to submit mod. Please try again." };
    }

    // Insert the initial version
    const { error: versionError } = await supabase.from("mod_versions").insert({
      mod_id: modData.id,
      version_number: data.versionNumber,
      game_version: data.gameVersion,
      download_url: data.downloadUrl,
      changelog: data.changelog || "Initial release",
      downloads: 0,
    });

    if (versionError) {
      console.error("Error creating version:", versionError);
      // Don't fail the whole submission, just log it
    }

    revalidatePath("/mods");
    return { success: true, slug };
  } catch (err) {
    console.error("Error submitting mod:", err);
    return { success: false, error: "An unexpected error occurred" };
  }
}

// ==========================================
// SERVER SUBMISSION
// ==========================================

export interface ServerSubmissionData {
  name: string;
  description: string;
  ipAddress: string;
  port: string;
  region: string;
  gameModes: string;
  discordUrl?: string;
  websiteUrl?: string;
  bannerUrl?: string;
}

export async function submitServer(data: ServerSubmissionData) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "You must be signed in to list a server" };
  }

  const supabase = await createClient();

  // Generate slug
  const baseSlug = generateSlug(data.name);
  const timestamp = Date.now().toString(36);
  const slug = `${baseSlug}-${timestamp}`;

  // Parse game modes
  const gameModes = data.gameModes
    .split(",")
    .map((mode) => mode.trim())
    .filter((mode) => mode.length > 0);

  try {
    const { error } = await supabase.from("servers").insert({
      name: data.name,
      slug,
      description: data.description,
      ip_address: data.ipAddress,
      port: parseInt(data.port) || 25565,
      region: data.region,
      game_modes: gameModes,
      discord_url: data.discordUrl || null,
      website_url: data.websiteUrl || null,
      banner_url: data.bannerUrl || null,
      status: "pending",
      is_featured: false,
      is_verified: false,
      is_online: true,
      players_online: 0,
      max_players: 100,
    });

    if (error) {
      console.error("Error submitting server:", error);
      return { success: false, error: "Failed to submit server. Please try again." };
    }

    revalidatePath("/servers");
    return { success: true, slug };
  } catch (err) {
    console.error("Error submitting server:", err);
    return { success: false, error: "An unexpected error occurred" };
  }
}

