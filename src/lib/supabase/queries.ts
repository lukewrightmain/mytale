import { createClient } from "./server";
import type { Database } from "./types";

type Server = Database["public"]["Tables"]["servers"]["Row"];
type Mod = Database["public"]["Tables"]["mods"]["Row"];

// ==========================================
// SERVER QUERIES
// ==========================================

export async function getServers(options?: {
  featured?: boolean;
  limit?: number;
  region?: string;
  gameMode?: string;
}) {
  const supabase = await createClient();
  
  let query = supabase
    .from("servers")
    .select("*")
    .eq("status", "approved")
    .order("players_online", { ascending: false });

  if (options?.featured) {
    query = query.eq("is_featured", true);
  }

  if (options?.region && options.region !== "all") {
    query = query.eq("region", options.region);
  }

  if (options?.gameMode && options.gameMode !== "all") {
    query = query.contains("game_modes", [options.gameMode]);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching servers:", error);
    return [];
  }

  return data as Server[];
}

export async function getServerBySlug(slug: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("servers")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching server:", error);
    return null;
  }

  return data as Server;
}

export async function getFeaturedServers(limit = 4) {
  return getServers({ featured: true, limit });
}

// ==========================================
// MOD QUERIES
// ==========================================

export async function getMods(options?: {
  featured?: boolean;
  limit?: number;
  category?: string;
  modType?: string;
  sortBy?: "downloads" | "rating" | "newest";
  search?: string;
}) {
  const supabase = await createClient();
  
  let query = supabase
    .from("mods")
    .select("*")
    .eq("status", "approved");

  if (options?.featured) {
    query = query.eq("is_featured", true);
  }

  if (options?.category && options.category !== "all") {
    query = query.eq("category", options.category);
  }

  if (options?.modType && options.modType !== "all") {
    query = query.eq("mod_type", options.modType);
  }

  if (options?.search) {
    query = query.or(`name.ilike.%${options.search}%,tagline.ilike.%${options.search}%`);
  }

  // Sorting
  switch (options?.sortBy) {
    case "rating":
      query = query.order("rating", { ascending: false });
      break;
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    case "downloads":
    default:
      query = query.order("downloads", { ascending: false });
      break;
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching mods:", error);
    return [];
  }

  return data as Mod[];
}

export async function getModBySlug(slug: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("mods")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching mod:", error);
    return null;
  }

  return data as Mod;
}

export async function getFeaturedMods(limit = 6) {
  return getMods({ featured: true, limit });
}

// ==========================================
// STATS QUERIES
// ==========================================

export async function getStats() {
  const supabase = await createClient();
  
  const [modsResult, serversResult, downloadsResult] = await Promise.all([
    supabase.from("mods").select("id", { count: "exact", head: true }).eq("status", "approved"),
    supabase.from("servers").select("id", { count: "exact", head: true }).eq("status", "approved"),
    supabase.from("mods").select("downloads").eq("status", "approved"),
  ]);

  const totalDownloads = downloadsResult.data?.reduce((acc, mod) => acc + (mod.downloads || 0), 0) || 0;
  
  // Calculate total online players
  const playersResult = await supabase
    .from("servers")
    .select("players_online")
    .eq("status", "approved")
    .eq("is_online", true);
  
  const playersOnline = playersResult.data?.reduce((acc, server) => acc + (server.players_online || 0), 0) || 0;

  return {
    mods: modsResult.count || 0,
    servers: serversResult.count || 0,
    downloads: totalDownloads,
    playersOnline,
  };
}

