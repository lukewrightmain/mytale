import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Download, Star, Calendar, Tag, ExternalLink, Heart, User } from "lucide-react";
import { Button, Card, Badge } from "@/components/ui";
import { getMapWithVersions } from "@/lib/supabase/queries";
import { formatNumber } from "@/lib/utils";
import { DownloadButton } from "./DownloadButton";
import { EditButton } from "./EditButton";

interface Props {
  params: Promise<{ slug: string }>;
}

interface MapVersion {
  id: string;
  version_number: string;
  game_version: string;
  changelog: string | null;
  download_url: string;
  file_size: number | null;
  downloads: number;
  created_at: string;
}

export default async function MapDetailPage({ params }: Props) {
  const { slug } = await params;
  const map = await getMapWithVersions(slug);

  if (!map) {
    notFound();
  }

  const latestVersion = map.versions[0];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/maps"
          className="inline-flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Maps
        </Link>

        {/* Header */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Thumbnail */}
          <div className="lg:col-span-1">
            <div className="relative aspect-video rounded-xl overflow-hidden border border-border">
              <Image
                src={map.thumbnail_url || "/images/hero/Hero3.png"}
                alt={map.name}
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          </div>

          {/* Info */}
          <div className="lg:col-span-2">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="default">{map.category}</Badge>
                  {map.is_featured && (
                    <Badge variant="accent">Featured</Badge>
                  )}
                </div>
                <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
                  {map.name}
                </h1>
              </div>
              {/* Edit Button (only visible to owner) */}
              <EditButton
                slug={map.slug}
                ownerClerkId={(map.profiles as { clerk_id: string } | null)?.clerk_id || null}
              />
            </div>

            {/* Author */}
            {map.profiles && (
              <div className="flex items-center gap-2 mb-4">
                <User className="w-4 h-4 text-foreground-muted" />
                <span className="text-foreground-muted">by</span>
                <span className="text-foreground font-medium">
                  {(map.profiles as { display_name: string | null; username: string }).display_name || 
                   (map.profiles as { username: string }).username}
                </span>
              </div>
            )}

            {map.tagline && (
              <p className="text-lg text-foreground-muted mb-6">
                {map.tagline}
              </p>
            )}

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-foreground-muted" />
                <span className="text-foreground font-medium">{formatNumber(map.downloads)}</span>
                <span className="text-foreground-muted">downloads</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="text-foreground font-medium">{Number(map.rating).toFixed(1)}</span>
                <span className="text-foreground-muted">({map.rating_count} ratings)</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-foreground-muted" />
                <span className="text-foreground-muted">
                  {new Date(map.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Tags */}
            {map.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {map.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary" size="sm" className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {latestVersion && (
                <DownloadButton
                  type="map"
                  contentId={map.id}
                  versionId={latestVersion.id}
                  downloadUrl={latestVersion.download_url}
                  versionNumber={latestVersion.version_number}
                />
              )}
              {map.support_url && (
                <a href={map.support_url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="lg">
                    <Heart className="w-5 h-5 text-pink-400" />
                    Support Creator
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Description */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-6">
              <h2 className="text-xl font-display font-bold text-foreground mb-4">
                About this Map
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-foreground-muted whitespace-pre-wrap">
                  {map.description || "No description provided."}
                </p>
              </div>
            </Card>
          </div>

          {/* Sidebar - Versions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Latest Version Card */}
            {latestVersion && (
              <Card className="p-4">
                <h3 className="text-lg font-display font-bold text-foreground mb-3">
                  Latest Version
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-foreground-muted">Version</span>
                    <span className="text-foreground font-medium">{latestVersion.version_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-muted">Game Version</span>
                    <span className="text-foreground">{latestVersion.game_version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-muted">Released</span>
                    <span className="text-foreground">
                      {new Date(latestVersion.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {latestVersion.file_size && (
                    <div className="flex justify-between">
                      <span className="text-foreground-muted">Size</span>
                      <span className="text-foreground">
                        {(latestVersion.file_size / 1024 / 1024).toFixed(1)} MB
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Version History */}
            {map.versions.length > 0 && (
              <Card className="p-4">
                <h3 className="text-lg font-display font-bold text-foreground mb-3">
                  Version History
                </h3>
                <div className="space-y-3">
                  {map.versions.slice(0, 5).map((version: MapVersion) => (
                    <div
                      key={version.id}
                      className="pb-3 border-b border-border last:border-0 last:pb-0"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-foreground font-medium">
                          v{version.version_number}
                        </span>
                        <span className="text-xs text-foreground-muted">
                          {new Date(version.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {version.changelog && (
                        <p className="text-sm text-foreground-muted line-clamp-2">
                          {version.changelog}
                        </p>
                      )}
                      <a
                        href={version.download_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300 mt-1"
                      >
                        <Download className="w-3 h-3" />
                        Download
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Support Card */}
            {map.support_url && (
              <Card className="p-4 bg-gradient-to-br from-pink-900/20 to-transparent border-pink-500/30">
                <h3 className="text-lg font-display font-bold text-foreground mb-2">
                  Support the Creator
                </h3>
                <p className="text-sm text-foreground-muted mb-4">
                  If you enjoy this map, consider supporting the creator!
                </p>
                <a href={map.support_url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full border-pink-500/50 hover:bg-pink-500/10">
                    <Heart className="w-4 h-4 text-pink-400" />
                    Support
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </a>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

