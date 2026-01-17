"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Download, Star, Search } from "lucide-react";
import { Card, Badge, Input } from "@/components/ui";
import { formatNumber } from "@/lib/utils";

interface Texture {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  thumbnail_url: string | null;
  resolution: string;
  category: string;
  tags: string[];
  downloads: number;
  rating: number;
  is_featured: boolean;
}

const CATEGORIES = [
  { value: "all", label: "All Styles" },
  { value: "Realistic", label: "Realistic" },
  { value: "Fantasy", label: "Fantasy" },
  { value: "Medieval", label: "Medieval" },
  { value: "Modern", label: "Modern" },
  { value: "Cartoon", label: "Cartoon" },
  { value: "Minimalist", label: "Minimalist" },
  { value: "Sci-Fi", label: "Sci-Fi" },
];

const RESOLUTIONS = [
  { value: "all", label: "All Resolutions" },
  { value: "16x", label: "16x" },
  { value: "32x", label: "32x" },
  { value: "64x", label: "64x" },
  { value: "128x", label: "128x" },
  { value: "256x", label: "256x" },
  { value: "512x", label: "512x" },
];

interface TexturesContentProps {
  initialTextures: Texture[];
}

export function TexturesContent({ initialTextures }: TexturesContentProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [resolution, setResolution] = useState("all");
  const [sort, setSort] = useState("downloads");

  const filteredTextures = useMemo(() => {
    let result = [...initialTextures];

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (texture) =>
          texture.name.toLowerCase().includes(searchLower) ||
          (texture.tagline && texture.tagline.toLowerCase().includes(searchLower)) ||
          texture.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    if (category !== "all") {
      result = result.filter((texture) => texture.category === category);
    }

    if (resolution !== "all") {
      result = result.filter((texture) => texture.resolution === resolution);
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
  }, [initialTextures, search, category, resolution, sort]);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar */}
      <aside className="lg:w-64 flex-shrink-0">
        <div className="bg-surface rounded-xl border border-border p-4 sticky top-20 space-y-6">
          <div>
            <h3 className="font-display font-semibold text-foreground mb-4">Style</h3>
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

          <div>
            <h3 className="font-display font-semibold text-foreground mb-4">Resolution</h3>
            <nav className="space-y-1">
              {RESOLUTIONS.map((res) => (
                <button
                  key={res.value}
                  onClick={() => setResolution(res.value)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    resolution === res.value
                      ? "bg-primary-500/10 text-primary-400"
                      : "text-foreground-muted hover:text-foreground hover:bg-stone-800"
                  }`}
                >
                  {res.label}
                </button>
              ))}
            </nav>
          </div>
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
              placeholder="Search texture packs..."
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
            {filteredTextures.length} texture packs
          </div>
        </div>

        {/* Textures Grid */}
        {filteredTextures.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTextures.map((texture) => (
              <Link key={texture.id} href={`/textures/${texture.slug}`} className="block">
                <Card hover glow="accent" className="h-full cursor-pointer">
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={texture.thumbnail_url || "/images/hero/Hero4.png"}
                      alt={texture.name}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge variant="default" className="backdrop-blur-sm bg-black/50">
                        {texture.resolution}
                      </Badge>
                      <Badge variant="outline" className="backdrop-blur-sm bg-black/50">
                        {texture.category}
                      </Badge>
                    </div>
                    {texture.is_featured && (
                      <div className="absolute top-3 right-3">
                        <Badge variant="accent" size="sm">Featured</Badge>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-display font-semibold text-lg text-foreground line-clamp-1">
                      {texture.name}
                    </h3>
                    <p className="text-foreground-muted text-sm mb-4 line-clamp-2">
                      {texture.tagline}
                    </p>

                    {texture.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {texture.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" size="sm">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-foreground-muted">
                        <Download className="w-4 h-4" />
                        <span>{formatNumber(texture.downloads)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span>{Number(texture.rating).toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-foreground-muted text-lg">No texture packs found.</p>
            <p className="text-foreground-subtle mt-2">
              Be the first to upload a texture pack!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

