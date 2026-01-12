"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { ModCard, ModFilters } from "@/components/mods";
import { MOD_CATEGORY_OPTIONS } from "@/lib/constants";
import type { Mod, ModCategory, ModType } from "@/lib/types";

// Mock data - will be replaced with Supabase
const mockMods: Mod[] = [
  {
    id: "1",
    name: "Magic Expansion",
    slug: "magic-expansion",
    tagline: "Adds 50+ new spells, magical items, and enchanting systems",
    description: "A comprehensive magic overhaul...",
    thumbnail: "/images/hero/Hero.png",
    screenshots: [],
    author: { id: "1", username: "arcanedev", displayName: "ArcaneDev" },
    category: "gameplay",
    type: "mod",
    tags: ["magic", "spells", "enchanting"],
    downloads: 45200,
    rating: 4.8,
    ratingCount: 892,
    versions: [],
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Better Creatures",
    slug: "better-creatures",
    tagline: "New behaviors, animations, and 30+ new creatures",
    description: "Completely overhauls creature AI...",
    thumbnail: "/images/hero/Hero2.png",
    screenshots: [],
    author: { id: "2", username: "wildmaker", displayName: "WildMaker" },
    category: "creatures",
    type: "mod",
    tags: ["creatures", "animals", "AI"],
    downloads: 32100,
    rating: 4.6,
    ratingCount: 654,
    versions: [],
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "Biome Bundle",
    slug: "biome-bundle",
    tagline: "20 stunning new biomes with unique flora and fauna",
    description: "Explore new worlds...",
    thumbnail: "/images/hero/Hero3.png",
    screenshots: [],
    author: { id: "3", username: "terraformer", displayName: "Terraformer" },
    category: "worldgen",
    type: "mod",
    tags: ["biomes", "world", "exploration"],
    downloads: 28700,
    rating: 4.9,
    ratingCount: 1203,
    versions: [],
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    name: "Builder's Toolkit",
    slug: "builders-toolkit",
    tagline: "Essential tools for creative builders - WorldEdit, copy/paste, and more",
    description: "The ultimate building companion...",
    thumbnail: "/images/hero/Hero4.png",
    screenshots: [],
    author: { id: "4", username: "buildmaster", displayName: "BuildMaster" },
    category: "tools",
    type: "plugin",
    tags: ["building", "tools", "worldedit"],
    downloads: 21300,
    rating: 4.5,
    ratingCount: 432,
    versions: [],
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "5",
    name: "Epic Items Pack",
    slug: "epic-items-pack",
    tagline: "100+ new weapons, armor sets, and accessories",
    description: "Gear up with epic loot...",
    thumbnail: "/images/hero/Hero5.png",
    screenshots: [],
    author: { id: "5", username: "lootlord", displayName: "LootLord" },
    category: "items",
    type: "mod",
    tags: ["items", "weapons", "armor"],
    downloads: 38900,
    rating: 4.7,
    ratingCount: 789,
    versions: [],
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "6",
    name: "Clean UI",
    slug: "clean-ui",
    tagline: "Minimalist UI overhaul with customization options",
    description: "A cleaner interface...",
    thumbnail: "/images/hero/Hero6.png",
    screenshots: [],
    author: { id: "6", username: "uimaster", displayName: "UIMaster" },
    category: "ui",
    type: "resourcepack",
    tags: ["ui", "interface", "minimal"],
    downloads: 15600,
    rating: 4.4,
    ratingCount: 321,
    versions: [],
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "7",
    name: "Dragon Taming",
    slug: "dragon-taming",
    tagline: "Tame, ride, and breed dragons in your world",
    description: "Become a dragon master...",
    thumbnail: "/images/hero/Hero7.png",
    screenshots: [],
    author: { id: "7", username: "dragonlord", displayName: "DragonLord" },
    category: "creatures",
    type: "mod",
    tags: ["dragons", "taming", "pets"],
    downloads: 52300,
    rating: 4.9,
    ratingCount: 1567,
    versions: [],
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "8",
    name: "Economy Plus",
    slug: "economy-plus",
    tagline: "Complete economy system with shops, trading, and banks",
    description: "Build a thriving economy...",
    thumbnail: "/images/hero/Hero8.png",
    screenshots: [],
    author: { id: "8", username: "econmaster", displayName: "EconMaster" },
    category: "gameplay",
    type: "plugin",
    tags: ["economy", "trading", "shops"],
    downloads: 19800,
    rating: 4.3,
    ratingCount: 287,
    versions: [],
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function ModsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [type, setType] = useState("all");
  const [sort, setSort] = useState("downloads");

  const filteredMods = useMemo(() => {
    let result = [...mockMods];

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (mod) =>
          mod.name.toLowerCase().includes(searchLower) ||
          mod.tagline.toLowerCase().includes(searchLower) ||
          mod.tags.some((tag) => tag.toLowerCase().includes(searchLower)) ||
          mod.author.username.toLowerCase().includes(searchLower)
      );
    }

    // Filter by category
    if (category !== "all") {
      result = result.filter((mod) => mod.category === category);
    }

    // Filter by type
    if (type !== "all") {
      result = result.filter((mod) => mod.type === type);
    }

    // Sort
    switch (sort) {
      case "downloads":
        result.sort((a, b) => b.downloads - a.downloads);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case "updated":
        result.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [search, category, type, sort]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero/Hero.png"
            alt="Mods"
            fill
            className="object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-4">
            Mods & <span className="gradient-text">Plugins</span>
          </h1>
          <p className="text-xl text-foreground-muted max-w-2xl mx-auto">
            Enhance your Hytale experience with community-created mods, plugins, 
            resource packs, and more.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Categories */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="bg-surface rounded-xl border border-border p-4 sticky top-20">
                <h3 className="font-display font-semibold text-foreground mb-4">
                  Categories
                </h3>
                <nav className="space-y-1">
                  {MOD_CATEGORY_OPTIONS.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setCategory(cat.value)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        category === cat.value
                          ? "bg-primary-500/10 text-primary-400"
                          : "text-foreground-muted hover:text-foreground hover:bg-stone-800"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Filters */}
              <div className="mb-8">
                <ModFilters
                  search={search}
                  onSearchChange={setSearch}
                  category={category}
                  onCategoryChange={setCategory}
                  type={type}
                  onTypeChange={setType}
                  sort={sort}
                  onSortChange={setSort}
                  totalCount={filteredMods.length}
                />
              </div>

              {/* Mods Grid */}
              {filteredMods.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredMods.map((mod) => (
                    <ModCard key={mod.id} mod={mod} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-foreground-muted text-lg">
                    No mods found matching your criteria.
                  </p>
                  <p className="text-foreground-subtle mt-2">
                    Try adjusting your filters or search query.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

