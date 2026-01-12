import Link from "next/link";
import Image from "next/image";
import { Users, Globe, Copy, ExternalLink } from "lucide-react";
import { Card, Badge, Button } from "@/components/ui";
import { GAME_MODES, REGIONS } from "@/lib/constants";
import type { Server, GameMode, Region } from "@/lib/types";

interface ServerCardProps {
  server: Server;
}

function getPlayerCountColor(online: number, max: number): string {
  const ratio = online / max;
  if (ratio >= 0.8) return "text-red-400";
  if (ratio >= 0.5) return "text-yellow-400";
  return "text-secondary-400";
}

export function ServerCard({ server }: ServerCardProps) {
  return (
    <Card hover glow="accent" className="overflow-hidden">
      {/* Banner */}
      <div className="relative h-32 sm:h-40">
        <Image
          src={server.banner || "/images/hero/Hero2.png"}
          alt={server.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <Badge
            variant={server.status === "online" ? "success" : "default"}
            className="backdrop-blur-sm"
          >
            <span className={`w-2 h-2 rounded-full mr-1.5 ${
              server.status === "online" ? "bg-green-400 animate-pulse" : "bg-stone-400"
            }`} />
            {server.status === "online" ? "Online" : "Offline"}
          </Badge>
        </div>

        {/* Verified Badge */}
        {server.verified && (
          <div className="absolute top-3 right-3">
            <Badge variant="primary" className="backdrop-blur-sm">
              ✓ Verified
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="font-display font-semibold text-xl text-foreground mb-2">
          {server.name}
        </h3>
        <p className="text-foreground-muted text-sm mb-4 line-clamp-2">
          {server.description}
        </p>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
          {/* Region */}
          <div className="flex items-center gap-1.5 text-foreground-muted">
            <Globe className="w-4 h-4" />
            <span>{REGIONS[server.region]?.flag} {REGIONS[server.region]?.label.split("(")[0]}</span>
          </div>

          {/* Players */}
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-foreground-muted" />
            <span className={getPlayerCountColor(server.players.online, server.players.max)}>
              {server.players.online}
            </span>
            <span className="text-foreground-muted">/ {server.players.max}</span>
          </div>
        </div>

        {/* Game Modes */}
        <div className="flex flex-wrap gap-2 mb-4">
          {server.gameModes.map((mode) => (
            <Badge key={mode} className={GAME_MODES[mode]?.color} size="sm">
              {GAME_MODES[mode]?.label}
            </Badge>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link href={`/servers/${server.slug}`} className="flex-1">
            <Button variant="outline" className="w-full" size="sm">
              <ExternalLink className="w-4 h-4" />
              View Details
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              navigator.clipboard.writeText(`${server.ip}:${server.port}`);
            }}
            title="Copy server IP"
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

