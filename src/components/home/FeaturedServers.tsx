import Link from "next/link";
import { ArrowRight, Users, Globe } from "lucide-react";
import { Button, Card, Badge } from "@/components/ui";
import { GAME_MODES, REGIONS } from "@/lib/constants";
import type { Server, GameMode, Region } from "@/lib/types";

// Mock data - will be replaced with real data from Supabase
const featuredServers: Partial<Server>[] = [
  {
    id: "1",
    name: "Realm of Adventures",
    slug: "realm-of-adventures",
    description: "Epic survival adventure with custom quests, dungeons, and a friendly community",
    gameModes: ["survival", "adventure"] as GameMode[],
    region: "na-east" as Region,
    players: { online: 145, max: 200 },
    status: "online",
    verified: true,
  },
  {
    id: "2",
    name: "Creative Paradise",
    slug: "creative-paradise",
    description: "Unlimited creative building with WorldEdit tools and plot system",
    gameModes: ["creative"] as GameMode[],
    region: "eu" as Region,
    players: { online: 89, max: 150 },
    status: "online",
    verified: true,
  },
  {
    id: "3",
    name: "Battle Royale Arena",
    slug: "battle-royale-arena",
    description: "Fast-paced PvP action with custom weapons and weekly tournaments",
    gameModes: ["pvp", "minigames"] as GameMode[],
    region: "na-west" as Region,
    players: { online: 234, max: 300 },
    status: "online",
    verified: false,
  },
  {
    id: "4",
    name: "Roleplay Kingdom",
    slug: "roleplay-kingdom",
    description: "Immersive medieval roleplay with jobs, economy, and player-run towns",
    gameModes: ["roleplay"] as GameMode[],
    region: "eu" as Region,
    players: { online: 67, max: 100 },
    status: "online",
    verified: true,
  },
];

function getPlayerCountColor(online: number, max: number): string {
  const ratio = online / max;
  if (ratio >= 0.8) return "text-red-400";
  if (ratio >= 0.5) return "text-yellow-400";
  return "text-secondary-400";
}

export function FeaturedServers() {
  return (
    <section className="py-20 bg-surface-elevated">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-2">
              Top Servers
            </h2>
            <p className="text-foreground-muted">
              Popular servers with active communities
            </p>
          </div>
          <Link href="/servers">
            <Button variant="ghost">
              View All Servers
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Servers List */}
        <div className="space-y-4">
          {featuredServers.map((server) => (
            <Link key={server.id} href={`/servers/${server.slug}`}>
              <Card hover className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Status & Name */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Online Status */}
                    <div className="relative flex-shrink-0">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          server.status === "online" ? "status-online" : "status-offline"
                        }`}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-display font-semibold text-lg text-foreground truncate">
                          {server.name}
                        </h3>
                        {server.verified && (
                          <Badge variant="primary" size="sm">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-foreground-muted text-sm line-clamp-1">
                        {server.description}
                      </p>
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-sm">
                    {/* Region */}
                    <div className="flex items-center gap-1.5 text-foreground-muted">
                      <Globe className="w-4 h-4" />
                      <span>{REGIONS[server.region as Region]?.flag} {REGIONS[server.region as Region]?.label.split(" ")[0]}</span>
                    </div>

                    {/* Players */}
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-foreground-muted" />
                      <span
                        className={getPlayerCountColor(
                          server.players?.online || 0,
                          server.players?.max || 1
                        )}
                      >
                        {server.players?.online}
                      </span>
                      <span className="text-foreground-muted">
                        / {server.players?.max}
                      </span>
                    </div>

                    {/* Game Modes */}
                    <div className="flex items-center gap-2">
                      {server.gameModes?.slice(0, 2).map((mode) => (
                        <Badge
                          key={mode}
                          className={GAME_MODES[mode]?.color}
                          size="sm"
                        >
                          {GAME_MODES[mode]?.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

