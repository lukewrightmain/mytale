import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Download, Star } from "lucide-react";
import { Button, Card, Badge } from "@/components/ui";
import { formatNumber } from "@/lib/utils";
import { MOD_CATEGORIES } from "@/lib/constants";
import type { Mod, ModCategory } from "@/lib/types";

// Mock data - will be replaced with real data from Supabase
const featuredMods: Partial<Mod>[] = [
  {
    id: "1",
    name: "Magic Expansion",
    slug: "magic-expansion",
    tagline: "Adds 50+ new spells and magical items",
    thumbnail: "/images/hero/Hero2.png",
    category: "gameplay" as ModCategory,
    downloads: 45200,
    rating: 4.8,
  },
  {
    id: "2",
    name: "Better Creatures",
    slug: "better-creatures",
    tagline: "New behaviors and creatures for your world",
    thumbnail: "/images/hero/Hero3.png",
    category: "creatures" as ModCategory,
    downloads: 32100,
    rating: 4.6,
  },
  {
    id: "3",
    name: "Biome Bundle",
    slug: "biome-bundle",
    tagline: "20 stunning new biomes to explore",
    thumbnail: "/images/hero/Hero4.png",
    category: "worldgen" as ModCategory,
    downloads: 28700,
    rating: 4.9,
  },
  {
    id: "4",
    name: "Builder's Toolkit",
    slug: "builders-toolkit",
    tagline: "Essential tools for creative builders",
    thumbnail: "/images/hero/Hero5.png",
    category: "tools" as ModCategory,
    downloads: 21300,
    rating: 4.5,
  },
];

export function FeaturedMods() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-2">
              Featured Mods
            </h2>
            <p className="text-foreground-muted">
              Hand-picked mods loved by the community
            </p>
          </div>
          <Link href="/mods">
            <Button variant="ghost">
              View All Mods
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Mods Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredMods.map((mod) => (
            <Link key={mod.id} href={`/mods/${mod.slug}`}>
              <Card hover glow="primary" className="h-full">
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={mod.thumbnail || "/images/placeholder/mod-thumb.png"}
                    alt={mod.name || ""}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge variant="default" className="backdrop-blur-sm bg-black/50">
                      {MOD_CATEGORIES[mod.category as ModCategory]?.icon}{" "}
                      {MOD_CATEGORIES[mod.category as ModCategory]?.label}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-display font-semibold text-lg text-foreground mb-1 line-clamp-1">
                    {mod.name}
                  </h3>
                  <p className="text-foreground-muted text-sm mb-4 line-clamp-2">
                    {mod.tagline}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-foreground-muted">
                      <Download className="w-4 h-4" />
                      <span>{formatNumber(mod.downloads || 0)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{mod.rating?.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

