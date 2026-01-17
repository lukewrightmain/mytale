import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronUp, User, ExternalLink, Edit, Youtube, Image as ImageIcon } from "lucide-react";
import { Button, Card, Badge } from "@/components/ui";
import { getBuilderBySlug } from "@/lib/supabase/queries";
import { formatNumber } from "@/lib/utils";
import { checkBuilderOwnership } from "@/lib/supabase/actions";
import { EditButton } from "./EditButton";
import { UpvoteButton } from "./UpvoteButton";
import { PortfolioGallery } from "./PortfolioGallery";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BuilderDetailPage({ params }: Props) {
  const { slug } = await params;
  const builder = await getBuilderBySlug(slug);

  if (!builder) {
    notFound();
  }

  const isOwner = await checkBuilderOwnership(builder.id);

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/builders"
          className="inline-flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Builders
        </Link>

        {/* Banner */}
        {builder.banner_url && (
          <div className="relative h-64 rounded-xl overflow-hidden mb-8 border border-border">
            <Image
              src={builder.banner_url}
              alt={builder.name}
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        )}

        {/* Header */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Thumbnail */}
          <div className="lg:col-span-1">
            <div className="relative aspect-video rounded-xl overflow-hidden border border-border">
              <Image
                src={builder.thumbnail_url || "/images/hero/Hero.png"}
                alt={builder.name}
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
                {builder.is_featured && (
                  <Badge variant="accent" className="mb-2">
                    Featured
                  </Badge>
                )}
                <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
                  {builder.name}
                </h1>
              </div>
              {/* Edit Button (only visible to owner) */}
              {isOwner && (
                <EditButton slug={builder.slug} />
              )}
            </div>

            {/* Builder Info */}
            {builder.profiles && (
              <div className="flex items-center gap-2 mb-4">
                <User className="w-4 h-4 text-foreground-muted" />
                <span className="text-foreground-muted">by</span>
                <span className="text-foreground font-medium">
                  {builder.profiles.display_name || builder.profiles.username}
                </span>
              </div>
            )}

            {builder.tagline && (
              <p className="text-lg text-foreground-muted mb-6">
                {builder.tagline}
              </p>
            )}

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-6 mb-6">
              <UpvoteButton builderId={builder.id} initialUpvotes={builder.upvotes || 0} />
              <div className="flex items-center gap-2">
                <span className="text-foreground-muted">
                  {builder.portfolio_items?.length || 0} portfolio items
                </span>
              </div>
            </div>

            {/* Social Links */}
            {(builder.discord_url || builder.twitter_url || builder.youtube_url || builder.website_url) && (
              <div className="flex flex-wrap gap-3 mb-6">
                {builder.discord_url && (
                  <a href={builder.discord_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      Discord
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </Button>
                  </a>
                )}
                {builder.twitter_url && (
                  <a href={builder.twitter_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      Twitter
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </Button>
                  </a>
                )}
                {builder.youtube_url && (
                  <a href={builder.youtube_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      <Youtube className="w-4 h-4 mr-1" />
                      YouTube
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </Button>
                  </a>
                )}
                {builder.website_url && (
                  <a href={builder.website_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      Website
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </Button>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Description & Portfolio */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            {builder.description && (
              <Card className="p-6">
                <h2 className="text-xl font-display font-bold text-foreground mb-4">
                  About
                </h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-foreground-muted whitespace-pre-wrap">
                    {builder.description}
                  </p>
                </div>
              </Card>
            )}

            {/* Portfolio Gallery */}
            <Card className="p-6">
              <h2 className="text-xl font-display font-bold text-foreground mb-4">
                Portfolio
              </h2>
              {builder.portfolio_items && builder.portfolio_items.length > 0 ? (
                <PortfolioGallery items={builder.portfolio_items} />
              ) : (
                <div className="text-center py-12 text-foreground-muted">
                  <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No portfolio items yet.</p>
                  {isOwner && (
                    <Link href={`/builders/${builder.slug}/edit`}>
                      <Button variant="outline" className="mt-4">
                        <Edit className="w-4 h-4 mr-2" />
                        Add Portfolio Items
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Stats Card */}
            <Card className="p-4">
              <h3 className="text-lg font-display font-bold text-foreground mb-3">
                Stats
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-foreground-muted">Upvotes</span>
                  <span className="text-foreground font-medium">{formatNumber(builder.upvotes || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground-muted">Portfolio Items</span>
                  <span className="text-foreground">{builder.portfolio_items?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground-muted">Created</span>
                  <span className="text-foreground">
                    {new Date(builder.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Card>

            {/* Contact Card */}
            {(builder.discord_url || builder.twitter_url || builder.youtube_url || builder.website_url) && (
              <Card className="p-4">
                <h3 className="text-lg font-display font-bold text-foreground mb-3">
                  Contact & Socials
                </h3>
                <div className="space-y-2">
                  {builder.discord_url && (
                    <a
                      href={builder.discord_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300"
                    >
                      Discord
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {builder.twitter_url && (
                    <a
                      href={builder.twitter_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300"
                    >
                      Twitter/X
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {builder.youtube_url && (
                    <a
                      href={builder.youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300"
                    >
                      YouTube
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {builder.website_url && (
                    <a
                      href={builder.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300"
                    >
                      Website
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
