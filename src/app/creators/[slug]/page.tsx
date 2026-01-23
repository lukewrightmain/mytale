import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowLeft, User, Globe, Clock, Calendar, 
  ExternalLink, Video
} from "lucide-react";
import { Button, Card, Badge } from "@/components/ui";
import { getContentCreatorBySlug } from "@/lib/supabase/queries";
import { SITE_URL } from "@/lib/constants";
import { VoteButton } from "./VoteButton";
import { EditButton } from "./EditButton";
import { ScheduleDisplay } from "./ScheduleDisplay";

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
  en: "English", es: "Spanish", fr: "French", de: "German",
  pt: "Portuguese", it: "Italian", ru: "Russian", ja: "Japanese",
  ko: "Korean", zh: "Chinese", ar: "Arabic", hi: "Hindi",
  pl: "Polish", nl: "Dutch", sv: "Swedish", no: "Norwegian",
  da: "Danish", fi: "Finnish", tr: "Turkish", th: "Thai",
  vi: "Vietnamese", id: "Indonesian",
};

// Social link components
const SOCIAL_LINKS = [
  { key: "twitch_url", label: "Twitch", icon: "🟣", color: "hover:bg-purple-500/20" },
  { key: "youtube_url", label: "YouTube", icon: "🔴", color: "hover:bg-red-500/20" },
  { key: "twitter_url", label: "X/Twitter", icon: "𝕏", color: "hover:bg-blue-500/20" },
  { key: "tiktok_url", label: "TikTok", icon: "🎵", color: "hover:bg-pink-500/20" },
  { key: "discord_url", label: "Discord", icon: "💬", color: "hover:bg-indigo-500/20" },
  { key: "website_url", label: "Website", icon: "🌐", color: "hover:bg-primary-500/20" },
] as const;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const creator = await getContentCreatorBySlug(slug);

  if (!creator) {
    return {
      title: "Creator Not Found",
      description: "The requested content creator could not be found.",
    };
  }

  const platform = PLATFORM_CONFIG[creator.primary_platform]?.label || "Content";
  const title = `${creator.name} - Hytale ${platform} Creator`;
  const description = creator.bio?.substring(0, 160) || `Follow ${creator.name}, a Hytale ${platform.toLowerCase()} content creator.`;

  return {
    title,
    description,
    keywords: [creator.name, `Hytale ${platform.toLowerCase()}`, "Hytale content creator", "Hytale streamer"].filter(Boolean),
    openGraph: {
      title: `${creator.name} | Mytale`,
      description,
      url: `${SITE_URL}/creators/${slug}`,
      type: "profile",
      images: creator.thumbnail_url ? [{ url: creator.thumbnail_url, width: 1200, height: 630, alt: creator.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${creator.name} | Mytale`,
      description,
      images: creator.thumbnail_url ? [creator.thumbnail_url] : undefined,
    },
    alternates: {
      canonical: `${SITE_URL}/creators/${slug}`,
    },
  };
}

export default async function ContentCreatorDetailPage({ params }: Props) {
  const { slug } = await params;
  const creator = await getContentCreatorBySlug(slug);

  if (!creator) {
    notFound();
  }

  const platform = PLATFORM_CONFIG[creator.primary_platform] || PLATFORM_CONFIG.other;
  const languageName = LANGUAGE_NAMES[creator.language] || creator.language.toUpperCase();

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back Button */}
        <Link
          href="/creators"
          className="inline-flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Creators
        </Link>

        {/* Banner */}
        <div className="relative h-48 sm:h-64 rounded-xl overflow-hidden mb-8">
          {creator.banner_url ? (
            <Image
              src={creator.banner_url}
              alt={`${creator.name} banner`}
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-500/30 via-accent-500/20 to-primary-600/30" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 -mt-24 relative z-10">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Creator Header */}
            <Card className="p-6">
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Avatar */}
                <div className="relative w-32 h-32 rounded-xl overflow-hidden border-4 border-surface bg-surface-elevated shrink-0">
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
                      <User className="w-12 h-12 text-foreground-muted" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className={`${platform.color} text-white`}>
                      {platform.icon} {platform.label}
                    </Badge>
                    {creator.is_featured && (
                      <Badge variant="accent">Featured</Badge>
                    )}
                  </div>

                  <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
                    {creator.name}
                  </h1>

                  {creator.profiles && (
                    <p className="text-foreground-subtle mb-3 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      by {creator.profiles.display_name || creator.profiles.username}
                    </p>
                  )}

                  {/* Quick Stats */}
                  <div className="flex flex-wrap gap-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full bg-surface-elevated text-foreground-muted">
                      <Globe className="w-4 h-4" />
                      {languageName}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full bg-surface-elevated text-foreground-muted">
                      <Clock className="w-4 h-4" />
                      {creator.timezone.replace(/_/g, " ")}
                    </span>
                    {creator.schedule && creator.schedule.length > 0 && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full bg-primary-500/20 text-primary-400">
                        <Calendar className="w-4 h-4" />
                        {creator.schedule.length} stream days/week
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col gap-2">
                  <VoteButton creatorId={creator.id} initialVotes={creator.upvotes || 0} />
                  <EditButton creatorId={creator.id} slug={creator.slug} />
                </div>
              </div>
            </Card>

            {/* Bio */}
            {creator.bio && (
              <Card className="p-6">
                <h2 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
                  <Video className="w-5 h-5 text-primary-500" />
                  About
                </h2>
                <p className="text-foreground-muted whitespace-pre-wrap">
                  {creator.bio}
                </p>
              </Card>
            )}

            {/* Schedule */}
            {creator.schedule && creator.schedule.length > 0 && (
              <ScheduleDisplay schedule={creator.schedule} timezone={creator.timezone} />
            )}

            {/* Servers They Play On */}
            {creator.servers && creator.servers.length > 0 && (
              <Card className="p-6">
                <h2 className="font-display font-semibold text-lg text-foreground mb-4">
                  Servers They Play On
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {creator.servers.map((server) => (
                    <Link
                      key={server.id}
                      href={`/servers/${server.slug}`}
                      className="flex items-center gap-3 p-3 rounded-lg bg-surface-elevated hover:bg-surface-elevated/80 transition-colors"
                    >
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                        {server.thumbnail_url ? (
                          <Image
                            src={server.thumbnail_url}
                            alt={server.name}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-surface flex items-center justify-center">
                            <Globe className="w-6 h-6 text-foreground-muted" />
                          </div>
                        )}
                      </div>
                      <span className="font-medium text-foreground">{server.name}</span>
                    </Link>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Right Column - Social Links */}
          <div className="space-y-6">
            {/* Social Links */}
            <Card className="p-6">
              <h2 className="font-display font-semibold text-lg text-foreground mb-4">
                Links & Social
              </h2>
              <div className="space-y-2">
                {SOCIAL_LINKS.map((social) => {
                  const url = creator[social.key as keyof typeof creator] as string | null;
                  if (!url) return null;

                  return (
                    <a
                      key={social.key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-3 p-3 rounded-lg bg-surface-elevated ${social.color} transition-colors`}
                    >
                      <span className="text-xl">{social.icon}</span>
                      <span className="font-medium text-foreground flex-1">
                        {social.label}
                      </span>
                      <ExternalLink className="w-4 h-4 text-foreground-muted" />
                    </a>
                  );
                })}
              </div>
            </Card>

            {/* Quick Info */}
            <Card className="p-6">
              <h2 className="font-display font-semibold text-lg text-foreground mb-4">
                Quick Info
              </h2>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-foreground-muted">Platform</dt>
                  <dd className="text-foreground font-medium">{platform.label}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-foreground-muted">Language</dt>
                  <dd className="text-foreground font-medium">{languageName}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-foreground-muted">Timezone</dt>
                  <dd className="text-foreground font-medium">
                    {creator.timezone.split("/").pop()?.replace(/_/g, " ")}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-foreground-muted">Upvotes</dt>
                  <dd className="text-primary-400 font-medium">{creator.upvotes || 0}</dd>
                </div>
              </dl>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

