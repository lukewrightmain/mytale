"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Download, Star, Search } from "lucide-react";
import { Card, Badge, Input } from "@/components/ui";
import { formatNumber } from "@/lib/utils";

interface Map {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  thumbnail_url: string | null;
  category: string;
  tags: string[];
  downloads: number;
  rating: number;
  is_featured: boolean;
}

const CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: "Adventure", label: "Adventure" },
  { value: "Survival", label: "Survival" },
  { value: "Parkour", label: "Parkour" },
  { value: "Puzzle", label: "Puzzle" },
  { value: "PvP", label: "PvP Arena" },
  { value: "Creative", label: "Creative Build" },
  { value: "Horror", label: "Horror" },
  { value: "Minigame", label: "Minigame" },
];

interface MapsContentProps {
  initialMaps: Map[];
}

export function MapsContent({ initialMaps }: MapsContentProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("downloads");

  const filteredMaps = useMemo(() => {
    let result = [...initialMaps];

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (map) =>
          map.name.toLowerCase().includes(searchLower) ||
          (map.tagline && map.tagline.toLowerCase().includes(searchLower)) ||
          map.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    if (category !== "all") {
      result = result.filter((map) => map.category === category);
    }

    switch (sort) {
      case "downloads":
        result.sort((a, b) => b.downloads - a.downloads);
        break;
      case "rating":
        result.sort((a, b) => Number(b.rating) - Number(a.rating));
        break;
      case "newest":
        result.sort((a, b) => b.id.localeCompare(a.id));
        break;
    }

    return result;
  }, [initialMaps, search, category, sort]);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar */}
      <aside className="lg:w-64 flex-shrink-0">
        <div className="bg-surface rounded-xl border border-border p-4 sticky top-20">
          <h3 className="font-display font-semibold text-foreground mb-4">Categories</h3>
          <nav className="space-y-1">
            {CATEGORIES.map((cat) => (
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
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" />
            <Input
              type="text"
              placeholder="Search maps..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-2.5 bg-surface border border-border rounded-lg text-foreground"
          >
            <option value="downloads">Most Downloads</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest</option>
          </select>
          <div className="text-sm text-foreground-muted self-center">
            {filteredMaps.length} maps
          </div>
        </div>

        {/* Maps Grid */}
        {filteredMaps.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredMaps.map((map) => (
              <Link key={map.id} href={`/maps/${map.slug}`} className="block">
                <Card hover glow="accent" className="h-full cursor-pointer">
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={map.thumbnail_url || "/images/hero/Hero3.png"}
                      alt={map.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant="default" className="backdrop-blur-sm bg-black/50">
                        {map.category}
                      </Badge>
                    </div>
                    {map.is_featured && (
                      <div className="absolute top-3 right-3">
                        <Badge variant="accent" size="sm">Featured</Badge>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-display font-semibold text-lg text-foreground line-clamp-1">
                      {map.name}
                    </h3>
                    <p className="text-foreground-muted text-sm mb-4 line-clamp-2">
                      {map.tagline}
                    </p>

                    {map.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {map.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" size="sm">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-foreground-muted">
                        <Download className="w-4 h-4" />
                        <span>{formatNumber(map.downloads)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span>{Number(map.rating).toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-foreground-muted text-lg">No maps found.</p>
            <p className="text-foreground-subtle mt-2">
              Be the first to upload a map!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

