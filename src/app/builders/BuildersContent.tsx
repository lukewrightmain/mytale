"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronUp, User } from "lucide-react";
import { Card, Badge } from "@/components/ui";
import { BuilderFilters } from "@/components/builders";
import { formatNumber } from "@/lib/utils";
import type { BuilderWithProfile } from "@/lib/supabase/queries";

interface BuildersContentProps {
  initialBuilders: BuilderWithProfile[];
}

export function BuildersContent({ initialBuilders }: BuildersContentProps) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("upvotes");

  const filteredBuilders = useMemo(() => {
    let result = [...initialBuilders];

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (builder) =>
          builder.name.toLowerCase().includes(searchLower) ||
          (builder.tagline && builder.tagline.toLowerCase().includes(searchLower)) ||
          (builder.description && builder.description.toLowerCase().includes(searchLower))
      );
    }

    // Sort
    switch (sort) {
      case "newest":
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case "upvotes":
      default:
        result.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
        break;
    }

    return result;
  }, [initialBuilders, search, sort]);

  return (
    <div>
      {/* Filters */}
      <div className="mb-8">
        <BuilderFilters
          search={search}
          onSearchChange={setSearch}
          sort={sort}
          onSortChange={setSort}
          totalCount={filteredBuilders.length}
        />
      </div>

      {/* Builders Grid */}
      {filteredBuilders.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredBuilders.map((builder) => (
            <Link key={builder.id} href={`/builders/${builder.slug}`} className="block">
              <Card hover glow="primary" className="h-full cursor-pointer">
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={builder.thumbnail_url || "/images/hero/Hero.png"}
                    alt={builder.name}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {builder.is_featured && (
                    <div className="absolute top-3 left-3">
                      <Badge variant="accent" className="backdrop-blur-sm bg-black/50">
                        Featured
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-display font-semibold text-lg text-foreground line-clamp-1">
                      {builder.name}
                    </h3>
                  </div>
                  {builder.profiles && (
                    <p className="text-foreground-subtle text-sm mb-2">
                      <User className="w-3 h-3 inline mr-1" />
                      {builder.profiles.display_name || builder.profiles.username}
                    </p>
                  )}
                  {builder.tagline && (
                    <p className="text-foreground-muted text-sm mb-4 line-clamp-2">
                      {builder.tagline}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-foreground-muted">
                      <ChevronUp className="w-4 h-4" />
                      <span>{formatNumber(builder.upvotes || 0)}</span>
                      <span className="text-foreground-subtle">upvotes</span>
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
            No builders found matching your criteria.
          </p>
          <p className="text-foreground-subtle mt-2">
            Try adjusting your filters or search query.
          </p>
        </div>
      )}
    </div>
  );
}
