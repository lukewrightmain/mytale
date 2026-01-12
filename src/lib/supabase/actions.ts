"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { createClient, createAdminClient } from "./server";
import { revalidatePath } from "next/cache";
import type { Database } from "./types";

type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];

// Helper to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ==========================================
// PROFILE HELPERS
// ==========================================

// Get or create profile for the current Clerk user
async function getOrCreateProfile() {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await currentUser();
  if (!user) return null;

  // Use admin client to bypass RLS for profile creation
  const supabase = createAdminClient();

  // Try to find existing profile
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("clerk_id", userId)
    .single();

  if (existingProfile) {
    return (existingProfile as { id: string }).id;
  }

  // Create new profile
  const username = user.username || user.emailAddresses[0]?.emailAddress?.split("@")[0] || `user_${Date.now()}`;
  const displayName = user.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : username;

  const profileData: ProfileInsert = {
    clerk_id: userId,
    username: `${username}_${Date.now().toString(36)}`, // Ensure uniqueness
    display_name: displayName,
    avatar_url: user.imageUrl,
  };
  
  const { data: newProfile, error } = await supabase
    .from("profiles")
    .insert(profileData as never)
    .select("id")
    .single();

  if (error) {
    console.error("Error creating profile:", error);
    return null;
  }

  return (newProfile as { id: string }).id;
}

// ==========================================
// MOD SUBMISSION & EDITING
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

  const profileId = await getOrCreateProfile();
  if (!profileId) {
    return { success: false, error: "Failed to create user profile" };
  }

  // Use admin client to bypass RLS (we've already verified user via Clerk)
  const supabase = createAdminClient();

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
    // Insert the mod with author_id
    const { data: modData, error: modError } = await supabase
      .from("mods")
      .insert({
        author_id: profileId,
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
      } as never)
      .select("id")
      .single();

    if (modError) {
      console.error("Error submitting mod:", modError);
      return { success: false, error: "Failed to submit mod. Please try again." };
    }

    // Insert the initial version
    const { error: versionError } = await supabase.from("mod_versions").insert({
      mod_id: (modData as { id: string }).id,
      version_number: data.versionNumber,
      game_version: data.gameVersion,
      download_url: data.downloadUrl,
      changelog: data.changelog || "Initial release",
      downloads: 0,
    } as never);

    if (versionError) {
      console.error("Error creating version:", versionError);
    }

    revalidatePath("/mods");
    return { success: true, slug };
  } catch (err) {
    console.error("Error submitting mod:", err);
    return { success: false, error: "An unexpected error occurred" };
  }
}

// Check if current user owns this mod
export async function checkModOwnership(modId: string) {
  const { userId } = await auth();
  if (!userId) return false;

  const supabase = await createClient();

  // Get the mod's author profile
  const { data: mod } = await supabase
    .from("mods")
    .select("author_id, profiles!mods_author_id_fkey(clerk_id)")
    .eq("id", modId)
    .single();

  const modData = mod as { author_id: string | null; profiles: { clerk_id: string } | null } | null;
  if (!modData || !modData.profiles) return false;

  // Check if the clerk_id matches
  return modData.profiles.clerk_id === userId;
}

// Update mod data
export interface ModUpdateData {
  name?: string;
  tagline?: string;
  description?: string;
  category?: string;
  modType?: string;
  tags?: string;
  thumbnailUrl?: string;
  supportUrl?: string;
}

export async function updateMod(modId: string, data: ModUpdateData) {
  const isOwner = await checkModOwnership(modId);
  if (!isOwner) {
    return { success: false, error: "You don't have permission to edit this mod" };
  }

  const supabase = createAdminClient();

  // Parse tags if provided
  const tags = data.tags
    ? data.tags
        .split(",")
        .map((tag) => tag.trim().toLowerCase())
        .filter((tag) => tag.length > 0)
    : undefined;

  const updateData: Record<string, unknown> = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.tagline !== undefined) updateData.tagline = data.tagline;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.category !== undefined) updateData.category = data.category;
  if (data.modType !== undefined) updateData.mod_type = data.modType;
  if (tags !== undefined) updateData.tags = tags;
  if (data.thumbnailUrl !== undefined) updateData.thumbnail_url = data.thumbnailUrl;
  if (data.supportUrl !== undefined) updateData.support_url = data.supportUrl;

  try {
    const { error } = await supabase
      .from("mods")
      .update(updateData)
      .eq("id", modId);

    if (error) {
      console.error("Error updating mod:", error);
      return { success: false, error: "Failed to update mod" };
    }

    revalidatePath("/mods");
    return { success: true };
  } catch (err) {
    console.error("Error updating mod:", err);
    return { success: false, error: "An unexpected error occurred" };
  }
}

// Add a new version to an existing mod
export interface NewVersionData {
  versionNumber: string;
  gameVersion: string;
  downloadUrl: string;
  changelog?: string;
}

export async function addModVersion(modId: string, data: NewVersionData) {
  const isOwner = await checkModOwnership(modId);
  if (!isOwner) {
    return { success: false, error: "You don't have permission to update this mod" };
  }

  const supabase = createAdminClient();

  try {
    // Check if version already exists
    const { data: existingVersion } = await supabase
      .from("mod_versions")
      .select("id")
      .eq("mod_id", modId)
      .eq("version_number", data.versionNumber)
      .single();

    if (existingVersion) {
      return { success: false, error: "This version number already exists" };
    }

    // Insert new version
    const { error } = await supabase.from("mod_versions").insert({
      mod_id: modId,
      version_number: data.versionNumber,
      game_version: data.gameVersion,
      download_url: data.downloadUrl,
      changelog: data.changelog || "",
      downloads: 0,
    } as never);

    if (error) {
      console.error("Error adding version:", error);
      return { success: false, error: "Failed to add version" };
    }

    revalidatePath("/mods");
    return { success: true };
  } catch (err) {
    console.error("Error adding version:", err);
    return { success: false, error: "An unexpected error occurred" };
  }
}

// ==========================================
// SERVER SUBMISSION & EDITING
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

  const profileId = await getOrCreateProfile();
  if (!profileId) {
    return { success: false, error: "Failed to create user profile" };
  }

  // Use admin client to bypass RLS (we've already verified user via Clerk)
  const supabase = createAdminClient();

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
      owner_id: profileId,
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
    } as never);

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

// Check if current user owns this server
export async function checkServerOwnership(serverId: string) {
  const { userId } = await auth();
  if (!userId) return false;

  const supabase = await createClient();

  // Get the server's owner profile
  const { data: server } = await supabase
    .from("servers")
    .select("owner_id, profiles!servers_owner_id_fkey(clerk_id)")
    .eq("id", serverId)
    .single();

  if (!server || !server.profiles) return false;

  // Check if the clerk_id matches (profiles is array from join)
  const profiles = server.profiles as { clerk_id: string }[] | { clerk_id: string };
  const profile = Array.isArray(profiles) ? profiles[0] : profiles;
  return profile?.clerk_id === userId;
}

// Update server data
export interface ServerUpdateData {
  name?: string;
  description?: string;
  ipAddress?: string;
  port?: string;
  region?: string;
  gameModes?: string;
  discordUrl?: string;
  websiteUrl?: string;
  bannerUrl?: string;
}

export async function updateServer(serverId: string, data: ServerUpdateData) {
  const isOwner = await checkServerOwnership(serverId);
  if (!isOwner) {
    return { success: false, error: "You don't have permission to edit this server" };
  }

  const supabase = createAdminClient();

  // Parse game modes if provided
  const gameModes = data.gameModes
    ? data.gameModes
        .split(",")
        .map((mode) => mode.trim())
        .filter((mode) => mode.length > 0)
    : undefined;

  const updateData: Record<string, unknown> = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.ipAddress !== undefined) updateData.ip_address = data.ipAddress;
  if (data.port !== undefined) updateData.port = parseInt(data.port) || 25565;
  if (data.region !== undefined) updateData.region = data.region;
  if (gameModes !== undefined) updateData.game_modes = gameModes;
  if (data.discordUrl !== undefined) updateData.discord_url = data.discordUrl;
  if (data.websiteUrl !== undefined) updateData.website_url = data.websiteUrl;
  if (data.bannerUrl !== undefined) updateData.banner_url = data.bannerUrl;

  try {
    const { error } = await supabase
      .from("servers")
      .update(updateData)
      .eq("id", serverId);

    if (error) {
      console.error("Error updating server:", error);
      return { success: false, error: "Failed to update server" };
    }

    revalidatePath("/servers");
    return { success: true };
  } catch (err) {
    console.error("Error updating server:", err);
    return { success: false, error: "An unexpected error occurred" };
  }
}

// ==========================================
// PLUGIN SUBMISSION
// ==========================================

export interface PluginSubmissionData {
  name: string;
  tagline: string;
  description: string;
  category: string;
  tags: string;
  thumbnailUrl?: string;
  serverSide: boolean;
  clientSide: boolean;
  apiVersion?: string;
  // Version info
  versionNumber: string;
  gameVersion: string;
  downloadUrl: string;
  changelog?: string;
  supportUrl?: string;
}

export async function submitPlugin(data: PluginSubmissionData) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "You must be signed in to submit a plugin" };
  }

  const profileId = await getOrCreateProfile();
  if (!profileId) {
    return { success: false, error: "Failed to create user profile" };
  }

  const supabase = createAdminClient();

  const baseSlug = generateSlug(data.name);
  const timestamp = Date.now().toString(36);
  const slug = `${baseSlug}-${timestamp}`;

  const tags = data.tags
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter((tag) => tag.length > 0);

  try {
    const { data: pluginData, error: pluginError } = await supabase
      .from("plugins")
      .insert({
        author_id: profileId,
        name: data.name,
        slug,
        tagline: data.tagline,
        description: data.description,
        category: data.category,
        tags,
        thumbnail_url: data.thumbnailUrl || null,
        server_side: data.serverSide,
        client_side: data.clientSide,
        api_version: data.apiVersion || null,
        support_url: data.supportUrl || null,
        status: "pending",
        is_featured: false,
        downloads: 0,
        rating: 0,
        rating_count: 0,
      } as never)
      .select("id")
      .single();

    if (pluginError) {
      console.error("Error submitting plugin:", pluginError);
      return { success: false, error: "Failed to submit plugin. Please try again." };
    }

    // Insert the initial version
    const { error: versionError } = await supabase.from("plugin_versions").insert({
      plugin_id: (pluginData as { id: string }).id,
      version_number: data.versionNumber,
      game_version: data.gameVersion,
      download_url: data.downloadUrl,
      changelog: data.changelog || "Initial release",
      downloads: 0,
    } as never);

    if (versionError) {
      console.error("Error creating plugin version:", versionError);
    }

    revalidatePath("/plugins");
    return { success: true, slug };
  } catch (err) {
    console.error("Error submitting plugin:", err);
    return { success: false, error: "An unexpected error occurred" };
  }
}

// ==========================================
// MAP SUBMISSION
// ==========================================

export interface MapSubmissionData {
  name: string;
  tagline: string;
  description: string;
  category: string;
  tags: string;
  thumbnailUrl?: string;
  // Version info
  versionNumber: string;
  gameVersion: string;
  downloadUrl: string;
  changelog?: string;
  supportUrl?: string;
}

export async function submitMap(data: MapSubmissionData) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "You must be signed in to submit a map" };
  }

  const profileId = await getOrCreateProfile();
  if (!profileId) {
    return { success: false, error: "Failed to create user profile" };
  }

  const supabase = createAdminClient();

  const baseSlug = generateSlug(data.name);
  const timestamp = Date.now().toString(36);
  const slug = `${baseSlug}-${timestamp}`;

  const tags = data.tags
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter((tag) => tag.length > 0);

  try {
    const { data: mapData, error: mapError } = await supabase
      .from("maps")
      .insert({
        author_id: profileId,
        name: data.name,
        slug,
        tagline: data.tagline,
        description: data.description,
        category: data.category,
        tags,
        thumbnail_url: data.thumbnailUrl || null,
        support_url: data.supportUrl || null,
        status: "pending",
        is_featured: false,
        downloads: 0,
        rating: 0,
        rating_count: 0,
      } as never)
      .select("id")
      .single();

    if (mapError) {
      console.error("Error submitting map:", mapError);
      return { success: false, error: "Failed to submit map. Please try again." };
    }

    // Insert the initial version
    const { error: versionError } = await supabase.from("map_versions").insert({
      map_id: (mapData as { id: string }).id,
      version_number: data.versionNumber,
      game_version: data.gameVersion,
      download_url: data.downloadUrl,
      changelog: data.changelog || "Initial release",
      downloads: 0,
    } as never);

    if (versionError) {
      console.error("Error creating map version:", versionError);
    }

    revalidatePath("/maps");
    return { success: true, slug };
  } catch (err) {
    console.error("Error submitting map:", err);
    return { success: false, error: "An unexpected error occurred" };
  }
}

// ==========================================
// TEXTURE SUBMISSION
// ==========================================

export interface TextureSubmissionData {
  name: string;
  tagline: string;
  description: string;
  category: string;
  resolution: string;
  tags: string;
  thumbnailUrl?: string;
  // Version info
  versionNumber: string;
  gameVersion: string;
  downloadUrl: string;
  changelog?: string;
  supportUrl?: string;
}

export async function submitTexture(data: TextureSubmissionData) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "You must be signed in to submit a texture pack" };
  }

  const profileId = await getOrCreateProfile();
  if (!profileId) {
    return { success: false, error: "Failed to create user profile" };
  }

  const supabase = createAdminClient();

  const baseSlug = generateSlug(data.name);
  const timestamp = Date.now().toString(36);
  const slug = `${baseSlug}-${timestamp}`;

  const tags = data.tags
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter((tag) => tag.length > 0);

  try {
    const { data: textureData, error: textureError } = await supabase
      .from("textures")
      .insert({
        author_id: profileId,
        name: data.name,
        slug,
        tagline: data.tagline,
        description: data.description,
        category: data.category,
        resolution: data.resolution,
        tags,
        thumbnail_url: data.thumbnailUrl || null,
        support_url: data.supportUrl || null,
        status: "pending",
        is_featured: false,
        downloads: 0,
        rating: 0,
        rating_count: 0,
      } as never)
      .select("id")
      .single();

    if (textureError) {
      console.error("Error submitting texture:", textureError);
      return { success: false, error: "Failed to submit texture pack. Please try again." };
    }

    // Insert the initial version
    const { error: versionError } = await supabase.from("texture_versions").insert({
      texture_id: (textureData as { id: string }).id,
      version_number: data.versionNumber,
      game_version: data.gameVersion,
      download_url: data.downloadUrl,
      changelog: data.changelog || "Initial release",
      downloads: 0,
    } as never);

    if (versionError) {
      console.error("Error creating texture version:", versionError);
    }

    revalidatePath("/textures");
    return { success: true, slug };
  } catch (err) {
    console.error("Error submitting texture:", err);
    return { success: false, error: "An unexpected error occurred" };
  }
}

// ==========================================
// IDEA SUBMISSION
// ==========================================

export interface IdeaSubmissionData {
  title: string;
  description: string;
  category: string;
  tags: string;
}

export async function submitIdea(data: IdeaSubmissionData) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "You must be signed in to submit an idea" };
  }

  const profileId = await getOrCreateProfile();
  if (!profileId) {
    return { success: false, error: "Failed to create user profile" };
  }

  const supabase = createAdminClient();

  const tags = data.tags
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter((tag) => tag.length > 0);

  try {
    const { error: ideaError } = await supabase
      .from("ideas")
      .insert({
        author_id: profileId,
        title: data.title,
        description: data.description,
        category: data.category,
        tags,
        votes: 0,
        status: "open",
        is_featured: false,
      } as never);

    if (ideaError) {
      console.error("Error submitting idea:", ideaError);
      return { success: false, error: "Failed to submit idea. Please try again." };
    }

    revalidatePath("/ideas");
    return { success: true };
  } catch (err) {
    console.error("Error submitting idea:", err);
    return { success: false, error: "An unexpected error occurred" };
  }
}
