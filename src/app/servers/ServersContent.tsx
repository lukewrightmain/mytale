"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Users, Globe, Copy, Check, ExternalLink } from "lucide-react";
import { Card, Badge, Button } from "@/components/ui";
import { ServerFilters } from "@/components/servers";
import type { Database } from "@/lib/supabase/types";

type Server = Database["public"]["Tables"]["servers"]["Row"];

function getPlayerCountColor(online: number, max: number): string {
  const ratio = online / max;
  if (ratio >= 0.8) return "text-red-400";
  if (ratio >= 0.5) return "text-yellow-400";
  return "text-secondary-400";
}

function getRegionDisplay(region: string): { flag: string; label: string } {
  const regions: Record<string, { flag: string; label: string }> = {
    NA: { flag: "🇺🇸", label: "North America" },
    EU: { flag: "🇪🇺", label: "Europe" },
    AS: { flag: "🌏", label: "Asia" },
    SA: { flag: "🇧🇷", label: "South America" },
    OC: { flag: "🇦🇺", label: "Oceania" },
  };
  return regions[region] || { flag: "🌍", label: region };
}

interface ServersContentProps {
  initialServers: Server[];
}

export function ServersContent({ initialServers }: ServersContentProps) {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("all");
  const [gameMode, setGameMode] = useState("all");
  const [sort, setSort] = useState("players");
  const [copiedIp, setCopiedIp] = useState<string | null>(null);

  const filteredServers = useMemo(() => {
    let result = [...initialServers];

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (server) =>
          server.name.toLowerCase().includes(searchLower) ||
          (server.description && server.description.toLowerCase().includes(searchLower))
      );
    }

    // Filter by region
    if (region !== "all") {
      result = result.filter((server) => server.region === region);
    }

    // Filter by game mode
    if (gameMode !== "all") {
      result = result.filter((server) =>
        server.game_modes.some((mode) => mode.toLowerCase() === gameMode.toLowerCase())
      );
    }

    // Sort
    switch (sort) {
      case "players":
        result.sort((a, b) => b.players_online - a.players_online);
        break;
      case "newest":
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [initialServers, search, region, gameMode, sort]);

  const handleCopyIp = async (e: React.MouseEvent, ip: string) => {
    e.preventDefault();
    e.stopPropagation();
    await navigator.clipboard.writeText(ip);
    setCopiedIp(ip);
    setTimeout(() => setCopiedIp(null), 2000);
  };

  return (
    <>
      {/* Filters */}
      <div className="mb-8">
        <ServerFilters
          search={search}
          onSearchChange={setSearch}
          region={region}
          onRegionChange={setRegion}
          gameMode={gameMode}
          onGameModeChange={setGameMode}
          sort={sort}
          onSortChange={setSort}
          totalCount={filteredServers.length}
        />
      </div>

      {/* Server Grid */}
      {filteredServers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServers.map((server) => {
            const regionInfo = getRegionDisplay(server.region);
            return (
              <Link key={server.id} href={`/servers/${server.slug}`} className="block">
                <Card hover className="h-full flex flex-col overflow-hidden cursor-pointer">
                {/* Banner */}
                <div className="relative h-32 overflow-hidden">
                  <Image
                    src={server.banner_url || "/images/hero/Hero.png"}
                    alt={server.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  
                  {/* Status indicator */}
                  <div className="absolute top-3 right-3">
                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full backdrop-blur-sm ${
                      server.is_online ? "bg-green-500/20" : "bg-red-500/20"
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        server.is_online ? "bg-green-400 animate-pulse" : "bg-red-400"
                      }`} />
                      <span className={`text-xs font-medium ${
                        server.is_online ? "text-green-400" : "text-red-400"
                      }`}>
                        {server.is_online ? "Online" : "Offline"}
                      </span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="absolute bottom-3 left-3 flex gap-2">
                    {server.is_verified && (
                      <Badge variant="primary" size="sm">Verified</Badge>
                    )}
                    {server.is_featured && (
                      <Badge variant="accent" size="sm">Featured</Badge>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                    {server.name}
                  </h3>
                  <p className="text-foreground-muted text-sm mb-4 line-clamp-2 flex-1">
                    {server.description}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-sm mb-4">
                    <div className="flex items-center gap-1.5 text-foreground-muted">
                      <Globe className="w-4 h-4" />
                      <span>{regionInfo.flag} {regionInfo.label}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-foreground-muted" />
                      <span className={getPlayerCountColor(server.players_online, server.max_players)}>
                        {server.players_online}
                      </span>
                      <span className="text-foreground-muted">/ {server.max_players}</span>
                    </div>
                  </div>

                  {/* Game Modes */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {server.game_modes.slice(0, 3).map((mode) => (
                      <Badge key={mode} variant="outline" size="sm">
                        {mode}
                      </Badge>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => handleCopyIp(e, server.ip_address)}
                    >
                      {copiedIp === server.ip_address ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy IP
                        </>
                      )}
                    </Button>
                    <Button size="sm">
                      <ExternalLink className="w-4 h-4" />
                      View
                    </Button>
                  </div>
                </div>
              </Card>
            </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-foreground-muted text-lg">
            No servers found matching your criteria.
          </p>
          <p className="text-foreground-subtle mt-2">
            Try adjusting your filters or search query.
          </p>
        </div>
      )}
    </>
  );
}

