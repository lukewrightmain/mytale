import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mytale.gg";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/mods`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/servers`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/maps`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/textures`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/ideas`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/builders`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/builders/submit`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/mods/submit`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/servers/submit`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/maps/submit`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/textures/submit`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/ideas/submit`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    // Guides - High priority for SEO
    {
      url: `${SITE_URL}/guides`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/guides/server-manual`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.95, // Very high priority - comprehensive guide
    },
  ];

  // Dynamic mod pages
  const { data: mods } = await supabase
    .from("mods")
    .select("slug, updated_at")
    .eq("status", "approved");

  const modPages: MetadataRoute.Sitemap =
    (mods as { slug: string; updated_at: string }[] | null)?.map((mod) => ({
      url: `${SITE_URL}/mods/${mod.slug}`,
      lastModified: new Date(mod.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })) || [];

  // Dynamic server pages
  const { data: servers } = await supabase
    .from("servers")
    .select("slug, updated_at")
    .eq("status", "approved");

  const serverPages: MetadataRoute.Sitemap =
    (servers as { slug: string; updated_at: string }[] | null)?.map((server) => ({
      url: `${SITE_URL}/servers/${server.slug}`,
      lastModified: new Date(server.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })) || [];


  // Dynamic map pages
  const { data: maps } = await supabase
    .from("maps")
    .select("slug, updated_at")
    .eq("status", "approved");

  const mapPages: MetadataRoute.Sitemap =
    (maps as { slug: string; updated_at: string }[] | null)?.map((map) => ({
      url: `${SITE_URL}/maps/${map.slug}`,
      lastModified: new Date(map.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })) || [];

  // Dynamic texture pages
  const { data: textures } = await supabase
    .from("textures")
    .select("slug, updated_at")
    .eq("status", "approved");

  const texturePages: MetadataRoute.Sitemap =
    (textures as { slug: string; updated_at: string }[] | null)?.map((texture) => ({
      url: `${SITE_URL}/textures/${texture.slug}`,
      lastModified: new Date(texture.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })) || [];

  // Dynamic idea pages
  const { data: ideas } = await supabase
    .from("ideas")
    .select("id, updated_at");

  const ideaPages: MetadataRoute.Sitemap =
    (ideas as { id: string; updated_at: string }[] | null)?.map((idea) => ({
      url: `${SITE_URL}/ideas/${idea.id}`,
      lastModified: new Date(idea.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })) || [];

  // Dynamic builder pages
  const { data: builders } = await supabase
    .from("builders")
    .select("slug, updated_at")
    .eq("status", "approved");

  const builderPages: MetadataRoute.Sitemap =
    (builders as { slug: string; updated_at: string }[] | null)?.map((builder) => ({
      url: `${SITE_URL}/builders/${builder.slug}`,
      lastModified: new Date(builder.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })) || [];

  return [
    ...staticPages,
    ...modPages,
    ...serverPages,
    ...mapPages,
    ...texturePages,
    ...ideaPages,
    ...builderPages,
  ];
}

