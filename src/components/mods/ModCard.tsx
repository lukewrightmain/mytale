import Link from "next/link";
import Image from "next/image";
import { Download, Star } from "lucide-react";
import { Card, Badge } from "@/components/ui";
import { formatNumber } from "@/lib/utils";
import { MOD_CATEGORIES, MOD_TYPES } from "@/lib/constants";
import type { Mod } from "@/lib/types";

interface ModCardProps {
  mod: Mod;
}

export function ModCard({ mod }: ModCardProps) {
  return (
    <Link href={`/mods/${mod.slug}`}>
      <Card hover glow="primary" className="h-full">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={mod.thumbnail || "/images/placeholder/mod-thumb.png"}
            alt={mod.name}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <Badge variant="default" className="backdrop-blur-sm bg-black/60">
              {MOD_CATEGORIES[mod.category]?.icon} {MOD_CATEGORIES[mod.category]?.label}
            </Badge>
          </div>
          {/* Type Badge */}
          <div className="absolute top-3 right-3">
            <Badge className={`backdrop-blur-sm ${MOD_TYPES[mod.type]?.color}`}>
              {MOD_TYPES[mod.type]?.label}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-display font-semibold text-lg text-foreground mb-1 line-clamp-1">
            {mod.name}
          </h3>
          <p className="text-foreground-subtle text-sm mb-2">
            by {mod.author.displayName || mod.author.username}
          </p>
          <p className="text-foreground-muted text-sm mb-4 line-clamp-2">
            {mod.tagline}
          </p>

          {/* Tags */}
          {mod.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {mod.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="default" size="sm">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between text-sm pt-3 border-t border-border">
            <div className="flex items-center gap-1 text-foreground-muted">
              <Download className="w-4 h-4" />
              <span>{formatNumber(mod.downloads)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-yellow-400">{mod.rating.toFixed(1)}</span>
              <span className="text-foreground-subtle">
                ({formatNumber(mod.ratingCount)})
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

