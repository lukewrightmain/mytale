"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Download, Star } from "lucide-react";
import { Card, Badge } from "@/components/ui";
import { ModFilters } from "@/components/mods";
import { formatNumber } from "@/lib/utils";
import type { Database } from "@/lib/supabase/types";

type Mod = Database["public"]["Tables"]["mods"]["Row"];

const CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: "Gameplay", label: "Gameplay" },
  { value: "Graphics", label: "Graphics" },
  { value: "Server", label: "Server" },
  { value: "Building", label: "Building" },
  { value: "Creatures", label: "Creatures" },
  { value: "UI", label: "UI" },
  { value: "Adventure", label: "Adventure" },
];

interface ModsContentProps {
  initialMods: Mod[];
}

export function ModsContent({ initialMods }: ModsContentProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [type, setType] = useState("all");
  const [sort, setSort] = useState("downloads");

  const filteredMods = useMemo(() => {
    let result = [...initialMods];

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (mod) =>
          mod.name.toLowerCase().includes(searchLower) ||
          (mod.tagline && mod.tagline.toLowerCase().includes(searchLower)) ||
          mod.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    // Filter by category
    if (category !== "all") {
      result = result.filter((mod) => mod.category === category);
    }

    // Filter by type
    if (type !== "all") {
      result = result.filter((mod) => mod.mod_type === type);
    }

    // Sort
    switch (sort) {
      case "downloads":
        result.sort((a, b) => b.downloads - a.downloads);
        break;
      case "rating":
        result.sort((a, b) => Number(b.rating) - Number(a.rating));
        break;
      case "newest":
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [initialMods, search, category, type, sort]);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar - Categories */}
      <aside className="lg:w-64 flex-shrink-0">
        <div className="bg-surface rounded-xl border border-border p-4 sticky top-20">
          <h3 className="font-display font-semibold text-foreground mb-4">
            Categories
          </h3>
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
              <Link key={mod.id} href={`/mods/${mod.slug}`} className="block">
                <Card hover glow="primary" className="h-full cursor-pointer">
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={mod.thumbnail_url || "/images/hero/Hero.png"}
                      alt={mod.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Type Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge variant="default" className="backdrop-blur-sm bg-black/50 capitalize">
                        {mod.mod_type.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-display font-semibold text-lg text-foreground line-clamp-1">
                        {mod.name}
                      </h3>
                    </div>
                    <p className="text-foreground-muted text-sm mb-4 line-clamp-2">
                      {mod.tagline}
                    </p>

                    {/* Tags */}
                    {mod.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {mod.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" size="sm">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-foreground-muted">
                        <Download className="w-4 h-4" />
                        <span>{formatNumber(mod.downloads)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span>{Number(mod.rating).toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
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
  );
}

