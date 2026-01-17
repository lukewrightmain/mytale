import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Download, Star } from "lucide-react";
import { Button, Card, Badge } from "@/components/ui";
import { formatNumber } from "@/lib/utils";
import { getFeaturedMods } from "@/lib/supabase/queries";

export async function FeaturedMods() {
  const mods = await getFeaturedMods(4);

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
        {mods.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mods.map((mod) => (
              <Link key={mod.id} href={`/mods/${mod.slug}`}>
                <Card hover glow="primary" className="h-full">
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={mod.thumbnail_url || "/images/hero/Hero.png"}
                      alt={mod.name}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge variant="default" className="backdrop-blur-sm bg-black/50">
                        {mod.category}
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
          <div className="text-center py-12 bg-surface rounded-xl border border-border">
            <p className="text-foreground-muted">No featured mods yet. Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  );
}
