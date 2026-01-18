import { createClient } from "./server";
import type { Database } from "./types";

type Server = Database["public"]["Tables"]["servers"]["Row"];
type Mod = Database["public"]["Tables"]["mods"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

// Extended types for queries with relations
export type ServerWithProfile = Server & {
  profiles: Pick<Profile, "id" | "clerk_id" | "username" | "display_name" | "avatar_url"> | null;
};

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

export async function getServerBySlug(slug: string): Promise<ServerWithProfile | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("servers")
    .select(`
      *,
      profiles:owner_id (
        id,
        clerk_id,
        username,
        display_name,
        avatar_url
      )
    `)
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching server:", error);
    return null;
  }

  return data as ServerWithProfile;
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

// Get mod with all versions and author info
export async function getModWithVersions(slug: string) {
  const supabase = await createClient();
  
  // Get the mod with author profile
  const { data: mod, error: modError } = await supabase
    .from("mods")
    .select(`
      *,
      profiles:author_id (
        id,
        clerk_id,
        username,
        display_name,
        avatar_url
      )
    `)
    .eq("slug", slug)
    .single();

  if (modError || !mod) {
    console.error("Error fetching mod:", modError);
    return null;
  }

  // Get versions
  const { data: versions, error: versionsError } = await supabase
    .from("mod_versions")
    .select("*")
    .eq("mod_id", mod.id)
    .order("created_at", { ascending: false });

  if (versionsError) {
    console.error("Error fetching versions:", versionsError);
  }

  return {
    ...mod,
    versions: versions || [],
  };
}

// Track a download
export async function trackDownload(modId: string, versionId: string) {
  const supabase = await createClient();
  
  // Increment version downloads
  // Using type assertion to bypass strict RPC type checking
  await (supabase.rpc as Function)("increment_version_downloads", { version_id: versionId });
  
  // Increment total mod downloads
  await (supabase.rpc as Function)("increment_mod_downloads", { mod_id: modId });
}

// Get mod for editing (includes author profile for ownership check)
export async function getModForEdit(slug: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("mods")
    .select(`
      *,
      profiles:author_id (
        id,
        clerk_id,
        username,
        display_name
      )
    `)
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching mod for edit:", error);
    return null;
  }

  return data;
}

// Get server for editing (includes owner profile for ownership check)
export async function getServerForEdit(slug: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("servers")
    .select(`
      *,
      profiles:owner_id (
        id,
        clerk_id,
        username,
        display_name
      )
    `)
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching server for edit:", error);
    return null;
  }

  return data;
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

// ==========================================
// MAP QUERIES
// ==========================================

export async function getMaps(options?: {
  featured?: boolean;
  limit?: number;
  category?: string;
}) {
  const supabase = await createClient();
  
  let query = supabase
    .from("maps")
    .select("*")
    .eq("status", "approved")
    .order("downloads", { ascending: false });

  if (options?.featured) {
    query = query.eq("is_featured", true);
  }

  if (options?.category && options.category !== "all") {
    query = query.eq("category", options.category);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching maps:", error);
    return [];
  }

  return data;
}

export async function getMapBySlug(slug: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("maps")
    .select(`
      *,
      profiles:author_id (
        id,
        clerk_id,
        username,
        display_name,
        avatar_url
      )
    `)
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching map:", error);
    return null;
  }

  return data;
}

export async function getMapWithVersions(slug: string) {
  const supabase = await createClient();
  
  const { data: map, error: mapError } = await supabase
    .from("maps")
    .select(`
      *,
      profiles:author_id (
        id,
        clerk_id,
        username,
        display_name,
        avatar_url
      )
    `)
    .eq("slug", slug)
    .single();

  if (mapError || !map) {
    console.error("Error fetching map:", mapError);
    return null;
  }

  const { data: versions, error: versionsError } = await supabase
    .from("map_versions")
    .select("*")
    .eq("map_id", map.id)
    .order("created_at", { ascending: false });

  if (versionsError) {
    console.error("Error fetching versions:", versionsError);
  }

  return {
    ...map,
    versions: versions || [],
  };
}

// Get map for editing (includes owner profile for ownership check)
export async function getMapForEdit(slug: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("maps")
    .select(`
      *,
      profiles:author_id (
        id,
        clerk_id,
        username,
        display_name
      )
    `)
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching map for edit:", error);
    return null;
  }

  return data;
}

// ==========================================
// TEXTURE QUERIES
// ==========================================

export async function getTextures(options?: {
  featured?: boolean;
  limit?: number;
  category?: string;
  resolution?: string;
}) {
  const supabase = await createClient();
  
  let query = supabase
    .from("textures")
    .select("*")
    .eq("status", "approved")
    .order("downloads", { ascending: false });

  if (options?.featured) {
    query = query.eq("is_featured", true);
  }

  if (options?.category && options.category !== "all") {
    query = query.eq("category", options.category);
  }

  if (options?.resolution && options.resolution !== "all") {
    query = query.eq("resolution", options.resolution);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching textures:", error);
    return [];
  }

  return data;
}

export async function getTextureBySlug(slug: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("textures")
    .select(`
      *,
      profiles:author_id (
        id,
        clerk_id,
        username,
        display_name,
        avatar_url
      )
    `)
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching texture:", error);
    return null;
  }

  return data;
}

export async function getTextureWithVersions(slug: string) {
  const supabase = await createClient();
  
  const { data: texture, error: textureError } = await supabase
    .from("textures")
    .select(`
      *,
      profiles:author_id (
        id,
        clerk_id,
        username,
        display_name,
        avatar_url
      )
    `)
    .eq("slug", slug)
    .single();

  if (textureError || !texture) {
    console.error("Error fetching texture:", textureError);
    return null;
  }

  const { data: versions, error: versionsError } = await supabase
    .from("texture_versions")
    .select("*")
    .eq("texture_id", texture.id)
    .order("created_at", { ascending: false });

  if (versionsError) {
    console.error("Error fetching versions:", versionsError);
  }

  return {
    ...texture,
    versions: versions || [],
  };
}

// ==========================================
// PLUGIN QUERIES
// ==========================================

export async function getPlugins(options?: {
  featured?: boolean;
  limit?: number;
  category?: string;
}) {
  const supabase = await createClient();
  
  let query = supabase
    .from("plugins")
    .select("*")
    .eq("status", "approved")
    .order("downloads", { ascending: false });

  if (options?.featured) {
    query = query.eq("is_featured", true);
  }

  if (options?.category && options.category !== "all") {
    query = query.eq("category", options.category);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching plugins:", error);
    return [];
  }

  return data;
}

export async function getPluginBySlug(slug: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("plugins")
    .select(`
      *,
      profiles:author_id (
        id,
        clerk_id,
        username,
        display_name,
        avatar_url
      )
    `)
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching plugin:", error);
    return null;
  }

  return data;
}

export async function getPluginWithVersions(slug: string) {
  const supabase = await createClient();
  
  const { data: plugin, error: pluginError } = await supabase
    .from("plugins")
    .select(`
      *,
      profiles:author_id (
        id,
        clerk_id,
        username,
        display_name,
        avatar_url
      )
    `)
    .eq("slug", slug)
    .single();

  if (pluginError || !plugin) {
    console.error("Error fetching plugin:", pluginError);
    return null;
  }

  const { data: versions, error: versionsError } = await supabase
    .from("plugin_versions")
    .select("*")
    .eq("plugin_id", plugin.id)
    .order("created_at", { ascending: false });

  if (versionsError) {
    console.error("Error fetching versions:", versionsError);
  }

  return {
    ...plugin,
    versions: versions || [],
  };
}

// ==========================================
// IDEAS QUERIES
// ==========================================

export async function getIdeas(options?: {
  category?: string;
  status?: string;
  sortBy?: "votes" | "newest" | "oldest";
  limit?: number;
}) {
  const supabase = await createClient();

  let query = supabase
    .from("ideas")
    .select(`
      *,
      profiles:author_id (
        id,
        username,
        display_name,
        avatar_url
      )
    `)
    .in("status", ["open", "in_progress", "completed"]);

  if (options?.category && options.category !== "all") {
    query = query.eq("category", options.category);
  }

  if (options?.status && options.status !== "all") {
    query = query.eq("status", options.status);
  }

  // Sorting
  switch (options?.sortBy) {
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    case "oldest":
      query = query.order("created_at", { ascending: true });
      break;
    case "votes":
    default:
      query = query.order("votes", { ascending: false });
      break;
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching ideas:", error);
    return [];
  }

  return data;
}

export async function getIdeaById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("ideas")
    .select(`
      *,
      profiles:author_id (
        id,
        username,
        display_name,
        avatar_url
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching idea:", error);
    return null;
  }

  return data;
}

// ==========================================
// BUILDER QUERIES
// ==========================================

// Builder types (defined explicitly until Database types are regenerated after migration)
export type BuilderWithProfile = {
  id: string;
  builder_id: string | null;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  thumbnail_url: string | null;
  banner_url: string | null;
  discord_url: string | null;
  twitter_url: string | null;
  youtube_url: string | null;
  website_url: string | null;
  upvotes: number;
  is_featured: boolean;
  status: string;
  created_at: string;
  updated_at: string;
  profiles: Pick<Profile, "id" | "clerk_id" | "username" | "display_name" | "avatar_url"> | null;
};

export type PortfolioItem = {
  id: string;
  builder_id: string;
  type: "image" | "video";
  url: string;
  thumbnail_url: string | null;
  title: string | null;
  description: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export async function getBuilders(options?: {
  featured?: boolean;
  limit?: number;
  sortBy?: "upvotes" | "newest";
  search?: string;
}) {
  const supabase = await createClient();

  let query = supabase
    .from("builders")
    .select(`
      *,
      profiles:builder_id (
        id,
        clerk_id,
        username,
        display_name,
        avatar_url
      )
    `)
    .eq("status", "approved");

  if (options?.featured) {
    query = query.eq("is_featured", true);
  }

  if (options?.search) {
    query = query.or(`name.ilike.%${options.search}%,tagline.ilike.%${options.search}%,description.ilike.%${options.search}%`);
  }

  // Sorting
  switch (options?.sortBy) {
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    case "upvotes":
    default:
      query = query.order("upvotes", { ascending: false });
      break;
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching builders:", error);
    return [];
  }

  return data as BuilderWithProfile[];
}

export async function getBuilderBySlug(slug: string): Promise<(BuilderWithProfile & { portfolio_items: PortfolioItem[] }) | null> {
  const supabase = await createClient();

  const { data: builder, error: builderError } = await supabase
    .from("builders")
    .select(`
      *,
      profiles:builder_id (
        id,
        clerk_id,
        username,
        display_name,
        avatar_url
      )
    `)
    .eq("slug", slug)
    .single();

  if (builderError || !builder) {
    console.error("Error fetching builder:", builderError);
    return null;
  }

  const { data: portfolioItems, error: portfolioError } = await supabase
    .from("builder_portfolio_items")
    .select("*")
    .eq("builder_id", (builder as BuilderWithProfile).id)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (portfolioError) {
    console.error("Error fetching portfolio items:", portfolioError);
  }

  return {
    ...(builder as BuilderWithProfile),
    portfolio_items: (portfolioItems || []) as PortfolioItem[],
  };
}

export async function getFeaturedBuilders(limit = 4) {
  return getBuilders({ featured: true, limit });
}

// ==========================================
// IDEA COMMENT QUERIES
// ==========================================

export type IdeaComment = {
  id: string;
  idea_id: string;
  author_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  profiles: {
    id: string;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  } | null;
};

export async function getIdeaComments(ideaId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("idea_comments")
    .select(`
      *,
      profiles:author_id (
        id,
        username,
        display_name,
        avatar_url
      )
    `)
    .eq("idea_id", ideaId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching idea comments:", error);
    return [];
  }

  return data as IdeaComment[];
}
