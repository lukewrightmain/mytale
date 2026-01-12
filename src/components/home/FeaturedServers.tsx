import Link from "next/link";
import { ArrowRight, Users, Globe } from "lucide-react";
import { Button, Card, Badge } from "@/components/ui";
import { getFeaturedServers } from "@/lib/supabase/queries";

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

export async function FeaturedServers() {
  const servers = await getFeaturedServers(4);

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
        {servers.length > 0 ? (
          <div className="space-y-4">
            {servers.map((server) => {
              const regionInfo = getRegionDisplay(server.region);
              return (
                <Link key={server.id} href={`/servers/${server.slug}`}>
                  <Card hover className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Status & Name */}
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        {/* Online Status */}
                        <div className="relative flex-shrink-0">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              server.is_online ? "status-online" : "status-offline"
                            }`}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-display font-semibold text-lg text-foreground truncate">
                              {server.name}
                            </h3>
                            {server.is_verified && (
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
                          <span>{regionInfo.flag} {regionInfo.label.split(" ")[0]}</span>
                        </div>

                        {/* Players */}
                        <div className="flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-foreground-muted" />
                          <span
                            className={getPlayerCountColor(
                              server.players_online,
                              server.max_players
                            )}
                          >
                            {server.players_online}
                          </span>
                          <span className="text-foreground-muted">
                            / {server.max_players}
                          </span>
                        </div>

                        {/* Game Modes */}
                        <div className="flex items-center gap-2">
                          {server.game_modes?.slice(0, 2).map((mode) => (
                            <Badge
                              key={mode}
                              size="sm"
                            >
                              {mode}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-surface rounded-xl border border-border">
            <p className="text-foreground-muted">No featured servers yet. Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  );
}
