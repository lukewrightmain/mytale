import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft, 
  Users, 
  Globe, 
  MapPin, 
  ExternalLink, 
  Copy, 
  User,
  Gamepad2,
  CheckCircle
} from "lucide-react";
import { Button, Card, Badge } from "@/components/ui";
import { getServerBySlug } from "@/lib/supabase/queries";
import { formatNumber } from "@/lib/utils";
import { EditButton } from "./EditButton";
import { CopyButton } from "./CopyButton";

interface Props {
  params: Promise<{ slug: string }>;
}

const REGION_NAMES: Record<string, string> = {
  NA: "North America",
  EU: "Europe",
  AS: "Asia",
  SA: "South America",
  OC: "Oceania",
  AF: "Africa",
};

export default async function ServerDetailPage({ params }: Props) {
  const { slug } = await params;
  const server = await getServerBySlug(slug);

  if (!server) {
    notFound();
  }

  const serverAddress = server.port === 5520 
    ? server.ip_address 
    : `${server.ip_address}:${server.port}`;

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/servers"
          className="inline-flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Servers
        </Link>

        {/* Header */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Banner */}
          <div className="lg:col-span-2">
            <div className="relative aspect-video rounded-xl overflow-hidden border border-border">
              <Image
                src={server.banner_url || "/images/hero/Hero.png"}
                alt={server.name}
                fill
                unoptimized
                className="object-cover"
              />
              {/* Status Badge */}
              <div className="absolute top-4 left-4">
                <Badge 
                  variant={server.is_online ? "success" : "default"}
                  className="backdrop-blur-sm"
                >
                  {server.is_online ? "Online" : "Offline"}
                </Badge>
              </div>
              {server.is_verified && (
                <div className="absolute top-4 right-4">
                  <Badge variant="default" className="backdrop-blur-sm bg-blue-500/80">
                    <CheckCircle className="w-3 h-3" />
                    Verified
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Quick Info */}
          <div className="lg:col-span-1">
            <Card className="p-4 h-full">
              <h3 className="text-lg font-display font-bold text-foreground mb-4">
                Quick Info
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-foreground-muted flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Players
                  </span>
                  <span className="text-foreground font-medium">
                    {formatNumber(server.players_online)} / {formatNumber(server.max_players)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground-muted flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Region
                  </span>
                  <span className="text-foreground">
                    {REGION_NAMES[server.region] || server.region}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground-muted flex items-center gap-2">
                    <Gamepad2 className="w-4 h-4" />
                    Game Modes
                  </span>
                  <span className="text-foreground text-right">
                    {server.game_modes.length > 0 ? server.game_modes.slice(0, 2).join(", ") : "—"}
                  </span>
                </div>
              </div>

              {/* Connect Box */}
              <div className="mt-6 pt-4 border-t border-border">
                <p className="text-sm text-foreground-muted mb-2">Server Address</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 bg-stone-900 rounded-lg text-primary-400 font-mono text-sm overflow-hidden text-ellipsis">
                    {serverAddress}
                  </code>
                  <CopyButton text={serverAddress} />
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-2">
              {server.name}
            </h1>
            {/* Owner */}
            {server.profiles && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-foreground-muted" />
                <span className="text-foreground-muted">Owned by</span>
                <span className="text-foreground font-medium">
                  {(server.profiles as { display_name: string | null; username: string }).display_name || 
                   (server.profiles as { username: string }).username}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <EditButton
              slug={server.slug}
              ownerClerkId={(server.profiles as { clerk_id: string } | null)?.clerk_id || null}
            />
            {server.discord_url && (
              <a href={server.discord_url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                  <Globe className="w-4 h-4" />
                  Discord
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </a>
            )}
            {server.website_url && (
              <a href={server.website_url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                  <Globe className="w-4 h-4" />
                  Website
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </a>
            )}
          </div>
        </div>

        {/* Game Modes */}
        {server.game_modes.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {server.game_modes.map((mode) => (
              <Badge key={mode} variant="outline" size="sm">
                {mode}
              </Badge>
            ))}
          </div>
        )}

        {/* Description */}
        <Card className="p-6">
          <h2 className="text-xl font-display font-bold text-foreground mb-4">
            About this Server
          </h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-foreground-muted whitespace-pre-wrap">
              {server.description || "No description provided."}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

