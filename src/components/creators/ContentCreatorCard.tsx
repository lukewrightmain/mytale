import Link from "next/link";
import Image from "next/image";
import { ChevronUp, User, Globe, Clock } from "lucide-react";
import { Card, Badge } from "@/components/ui";
import { formatNumber } from "@/lib/utils";
import type { ContentCreatorWithProfile } from "@/lib/supabase/queries";

// Platform icons/colors
const PLATFORM_CONFIG = {
  twitch: { label: "Twitch", color: "bg-purple-500", icon: "🟣" },
  youtube: { label: "YouTube", color: "bg-red-500", icon: "🔴" },
  tiktok: { label: "TikTok", color: "bg-pink-500", icon: "🎵" },
  kick: { label: "Kick", color: "bg-green-500", icon: "🟢" },
  other: { label: "Other", color: "bg-gray-500", icon: "📺" },
};

// Language display names
const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  pt: "Portuguese",
  it: "Italian",
  ru: "Russian",
  ja: "Japanese",
  ko: "Korean",
  zh: "Chinese",
  ar: "Arabic",
  hi: "Hindi",
  pl: "Polish",
  nl: "Dutch",
  sv: "Swedish",
  no: "Norwegian",
  da: "Danish",
  fi: "Finnish",
  tr: "Turkish",
  th: "Thai",
  vi: "Vietnamese",
  id: "Indonesian",
};

interface ContentCreatorCardProps {
  creator: ContentCreatorWithProfile;
}

export function ContentCreatorCard({ creator }: ContentCreatorCardProps) {
  const platform = PLATFORM_CONFIG[creator.primary_platform] || PLATFORM_CONFIG.other;
  const languageName = LANGUAGE_NAMES[creator.language] || creator.language.toUpperCase();

  return (
    <Link href={`/creators/${creator.slug}`}>
      <Card hover glow="primary" className="h-full overflow-hidden">
        {/* Banner */}
        <div className="relative h-24 overflow-hidden">
          {creator.banner_url ? (
            <Image
              src={creator.banner_url}
              alt={`${creator.name} banner`}
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-500/20 to-accent-500/20" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
          
          {/* Platform Badge */}
          <div className="absolute top-2 right-2">
            <Badge className={`${platform.color} text-white`}>
              {platform.icon} {platform.label}
            </Badge>
          </div>
        </div>

        {/* Avatar overlapping banner */}
        <div className="relative px-4 -mt-10">
          <div className="relative w-20 h-20 rounded-xl overflow-hidden border-4 border-surface bg-surface-elevated">
            {creator.thumbnail_url ? (
              <Image
                src={creator.thumbnail_url}
                alt={creator.name}
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-surface-elevated">
                <User className="w-8 h-8 text-foreground-muted" />
              </div>
            )}
          </div>
          
          {creator.is_featured && (
            <Badge variant="accent" className="absolute top-2 left-28">
              Featured
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="p-4 pt-2">
          <h3 className="font-display font-semibold text-lg text-foreground mb-1 line-clamp-1">
            {creator.name}
          </h3>
          
          {creator.profiles && (
            <p className="text-foreground-subtle text-sm mb-2 flex items-center gap-1">
              <User className="w-3 h-3" />
              {creator.profiles.display_name || creator.profiles.username}
            </p>
          )}

          {/* Info Pills */}
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-surface-elevated text-foreground-muted">
              <Globe className="w-3 h-3" />
              {languageName}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-surface-elevated text-foreground-muted">
              <Clock className="w-3 h-3" />
              {creator.timezone.replace(/_/g, " ").split("/").pop()}
            </span>
          </div>

          {creator.bio && (
            <p className="text-foreground-muted text-sm mb-4 line-clamp-2">
              {creator.bio}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between text-sm pt-3 border-t border-border">
            <div className="flex items-center gap-1 text-foreground-muted">
              <ChevronUp className="w-4 h-4" />
              <span>{formatNumber(creator.upvotes || 0)}</span>
              <span className="text-foreground-subtle">upvotes</span>
            </div>
            {creator.schedule && creator.schedule.length > 0 && (
              <span className="text-xs text-primary-400">
                {creator.schedule.length} stream days
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}

