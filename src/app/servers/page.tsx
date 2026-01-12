"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { ServerCard, ServerFilters } from "@/components/servers";
import type { Server, GameMode, Region } from "@/lib/types";

// Mock data - will be replaced with Supabase
const mockServers: Server[] = [
  {
    id: "1",
    name: "Realm of Adventures",
    slug: "realm-of-adventures",
    description: "Epic survival adventure with custom quests, dungeons, and a friendly community. Join thousands of players!",
    banner: "/images/hero/Hero2.png",
    ip: "play.realmofadventures.com",
    port: 25565,
    discord: "https://discord.gg/roa",
    gameModes: ["survival", "adventure"],
    region: "na-east",
    players: { online: 145, max: 200 },
    status: "online",
    featured: true,
    verified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Creative Paradise",
    slug: "creative-paradise",
    description: "Unlimited creative building with WorldEdit tools and plot system. Perfect for builders!",
    banner: "/images/hero/Hero3.png",
    ip: "creative.paradise.net",
    port: 25565,
    gameModes: ["creative"],
    region: "eu",
    players: { online: 89, max: 150 },
    status: "online",
    featured: true,
    verified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "Battle Royale Arena",
    slug: "battle-royale-arena",
    description: "Fast-paced PvP action with custom weapons and weekly tournaments. Compete for glory!",
    banner: "/images/hero/Hero4.png",
    ip: "pvp.brarena.com",
    port: 25565,
    gameModes: ["pvp", "minigames"],
    region: "na-west",
    players: { online: 234, max: 300 },
    status: "online",
    featured: false,
    verified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    name: "Roleplay Kingdom",
    slug: "roleplay-kingdom",
    description: "Immersive medieval roleplay with jobs, economy, and player-run towns. Create your story!",
    banner: "/images/hero/Hero5.png",
    ip: "rp.kingdom.net",
    port: 25565,
    discord: "https://discord.gg/rpk",
    gameModes: ["roleplay"],
    region: "eu",
    players: { online: 67, max: 100 },
    status: "online",
    featured: true,
    verified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "5",
    name: "Skyblock Masters",
    slug: "skyblock-masters",
    description: "The ultimate skyblock experience with custom islands, challenges, and competitions.",
    banner: "/images/hero/Hero6.png",
    ip: "sky.masters.gg",
    port: 25565,
    gameModes: ["survival"],
    region: "asia",
    players: { online: 156, max: 250 },
    status: "online",
    featured: false,
    verified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "6",
    name: "Minigame Central",
    slug: "minigame-central",
    description: "50+ unique minigames including parkour, spleef, and more. Fun for everyone!",
    banner: "/images/hero/Hero7.png",
    ip: "play.minigamecentral.com",
    port: 25565,
    gameModes: ["minigames"],
    region: "na-east",
    players: { online: 312, max: 500 },
    status: "online",
    featured: true,
    verified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function ServersPage() {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("all");
  const [gameMode, setGameMode] = useState("all");
  const [sort, setSort] = useState("players");

  const filteredServers = useMemo(() => {
    let result = [...mockServers];

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (server) =>
          server.name.toLowerCase().includes(searchLower) ||
          server.description.toLowerCase().includes(searchLower)
      );
    }

    // Filter by region
    if (region !== "all") {
      result = result.filter((server) => server.region === region);
    }

    // Filter by game mode
    if (gameMode !== "all") {
      result = result.filter((server) =>
        server.gameModes.includes(gameMode as GameMode)
      );
    }

    // Sort
    switch (sort) {
      case "players":
        result.sort((a, b) => b.players.online - a.players.online);
        break;
      case "newest":
        result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [search, region, gameMode, sort]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero/Hero2.png"
            alt="Servers"
            fill
            className="object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-4">
            Hytale <span className="gradient-text">Servers</span>
          </h1>
          <p className="text-xl text-foreground-muted max-w-2xl mx-auto">
            Find the perfect server for your playstyle. From survival to creative, 
            PvP to roleplay — your adventure starts here.
          </p>
        </div>
      </section>

      {/* Filters & List */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              {filteredServers.map((server) => (
                <ServerCard key={server.id} server={server} />
              ))}
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
        </div>
      </section>
    </div>
  );
}

