import Link from "next/link";
import Image from "next/image";
import { ChevronUp, User } from "lucide-react";
import { Card, Badge } from "@/components/ui";
import { formatNumber } from "@/lib/utils";
import type { BuilderWithProfile } from "@/lib/supabase/queries";

interface BuilderCardProps {
  builder: BuilderWithProfile;
}

export function BuilderCard({ builder }: BuilderCardProps) {
  return (
    <Link href={`/builders/${builder.slug}`}>
      <Card hover glow="primary" className="h-full">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={builder.thumbnail_url || "/images/hero/Hero.png"}
            alt={builder.name}
            fill
            unoptimized
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
          {builder.is_featured && (
            <div className="absolute top-3 left-3">
              <Badge variant="accent" className="backdrop-blur-sm bg-black/60">
                Featured
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-display font-semibold text-lg text-foreground mb-1 line-clamp-1">
            {builder.name}
          </h3>
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
          <div className="flex items-center justify-between text-sm pt-3 border-t border-border">
            <div className="flex items-center gap-1 text-foreground-muted">
              <ChevronUp className="w-4 h-4" />
              <span>{formatNumber(builder.upvotes || 0)}</span>
              <span className="text-foreground-subtle">upvotes</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
