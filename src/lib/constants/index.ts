import type { GameMode, Region, ModCategory, ModType, FilterOption } from "../types";

// ═══════════════════════════════════════════════════════════════════════════
// Mytale Constants
// ═══════════════════════════════════════════════════════════════════════════

// ─── Game Modes ───

export const GAME_MODES: Record<GameMode, { label: string; color: string }> = {
  survival: { label: "Survival", color: "bg-green-500/20 text-green-400" },
  creative: { label: "Creative", color: "bg-blue-500/20 text-blue-400" },
  adventure: { label: "Adventure", color: "bg-purple-500/20 text-purple-400" },
  pvp: { label: "PvP", color: "bg-red-500/20 text-red-400" },
  roleplay: { label: "Roleplay", color: "bg-pink-500/20 text-pink-400" },
  minigames: { label: "Minigames", color: "bg-yellow-500/20 text-yellow-400" },
};

export const GAME_MODE_OPTIONS: FilterOption[] = [
  { value: "all", label: "All Modes" },
  { value: "survival", label: "Survival" },
  { value: "creative", label: "Creative" },
  { value: "adventure", label: "Adventure" },
  { value: "pvp", label: "PvP" },
  { value: "roleplay", label: "Roleplay" },
  { value: "minigames", label: "Minigames" },
];

// ─── Regions ───

export const REGIONS: Record<Region, { label: string; flag: string }> = {
  NA: { label: "North America", flag: "🇺🇸" },
  EU: { label: "Europe", flag: "🇪🇺" },
  AS: { label: "Asia", flag: "🌏" },
  SA: { label: "South America", flag: "🇧🇷" },
  OC: { label: "Oceania", flag: "🇦🇺" },
};

export const REGION_OPTIONS: FilterOption[] = [
  { value: "all", label: "All Regions" },
  { value: "NA", label: "🇺🇸 North America" },
  { value: "EU", label: "🇪🇺 Europe" },
  { value: "AS", label: "🌏 Asia" },
  { value: "SA", label: "🇧🇷 South America" },
  { value: "OC", label: "🇦🇺 Oceania" },
];

// ─── Mod Categories ───

export const MOD_CATEGORIES: Record<ModCategory, { label: string; color: string; icon: string }> = {
  gameplay: { label: "Gameplay", color: "bg-primary-500/20 text-primary-400", icon: "⚔️" },
  worldgen: { label: "World Generation", color: "bg-green-500/20 text-green-400", icon: "🌍" },
  creatures: { label: "Creatures", color: "bg-red-500/20 text-red-400", icon: "🐉" },
  items: { label: "Items", color: "bg-purple-500/20 text-purple-400", icon: "💎" },
  ui: { label: "User Interface", color: "bg-blue-500/20 text-blue-400", icon: "🖥️" },
  tools: { label: "Tools", color: "bg-yellow-500/20 text-yellow-400", icon: "🔧" },
  library: { label: "Library", color: "bg-stone-500/20 text-stone-400", icon: "📚" },
};

export const MOD_CATEGORY_OPTIONS: FilterOption[] = [
  { value: "all", label: "All Categories" },
  { value: "gameplay", label: "⚔️ Gameplay" },
  { value: "worldgen", label: "🌍 World Generation" },
  { value: "creatures", label: "🐉 Creatures" },
  { value: "items", label: "💎 Items" },
  { value: "ui", label: "🖥️ User Interface" },
  { value: "tools", label: "🔧 Tools" },
  { value: "library", label: "📚 Library" },
];

// ─── Mod Types ───

export const MOD_TYPES: Record<ModType, { label: string; color: string }> = {
  mod: { label: "Mod", color: "bg-accent-500/20 text-accent-400" },
  plugin: { label: "Plugin", color: "bg-secondary-500/20 text-secondary-400" },
  resourcepack: { label: "Resource Pack", color: "bg-pink-500/20 text-pink-400" },
  map: { label: "Map", color: "bg-orange-500/20 text-orange-400" },
  modpack: { label: "Modpack", color: "bg-indigo-500/20 text-indigo-400" },
};

export const MOD_TYPE_OPTIONS: FilterOption[] = [
  { value: "all", label: "All Types" },
  { value: "mod", label: "Mods" },
  { value: "plugin", label: "Plugins" },
  { value: "resourcepack", label: "Resource Packs" },
  { value: "map", label: "Maps" },
  { value: "modpack", label: "Modpacks" },
];

// ─── Sort Options ───

export const SERVER_SORT_OPTIONS: FilterOption[] = [
  { value: "players", label: "Most Players" },
  { value: "newest", label: "Newest" },
  { value: "name", label: "Name A-Z" },
];

export const MOD_SORT_OPTIONS: FilterOption[] = [
  { value: "downloads", label: "Most Downloads" },
  { value: "rating", label: "Highest Rated" },
  { value: "updated", label: "Recently Updated" },
  { value: "newest", label: "Newest" },
  { value: "name", label: "Name A-Z" },
];

// ─── Site Info ───

export const SITE_NAME = "Mytale";
export const SITE_TAGLINE = "Your Ultimate Hytale Community Hub";
export const SITE_DESCRIPTION = "Mytale is the premier destination for Hytale mods, plugins, servers, maps, and textures. Discover, download, and share community-created content for Hytale.";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mytale.gg";

// ─── SEO Keywords ───

export const SEO_KEYWORDS = {
  global: [
    // Primary keywords
    "Hytale",
    "Hytale servers",
    "Hytale server list",
    "Hytale mods",
    "Hytale plugins",
    "Hytale maps",
    "Hytale worlds",
    "Hytale textures",
    "Hytale texture packs",
    "Hytale resource packs",
    // Secondary keywords
    "Hytale modding",
    "Hytale community",
    "Hytale download",
    "Hytale addons",
    "Hytale custom content",
    "Hytale modpack",
    "Hytale mod list",
    "Hytale mod download",
    "Hytale server IP",
    "Hytale multiplayer servers",
    "best Hytale servers",
    "best Hytale mods",
    "Hytale index",
    // Brand keywords
    "Mytale",
    "Hypixel Studios",
    "Riot Games Hytale",
    "Hytale 2026",
    "Hytale Early Access",
  ],
  mods: [
    "Hytale mods",
    "Hytale mod download",
    "best Hytale mods",
    "Hytale gameplay mods",
    "Hytale modding",
    "Hytale mod list",
    "free Hytale mods",
    "Hytale mod index",
  ],
  plugins: [
    "Hytale plugins",
    "Hytale server plugins",
    "Hytale plugin download",
    "best Hytale plugins",
    "Hytale plugin list",
    "Hytale API plugins",
  ],
  servers: [
    "Hytale servers",
    "Hytale server list",
    "best Hytale servers",
    "Hytale multiplayer",
    "Hytale server hosting",
    "Hytale PvP servers",
    "Hytale survival servers",
    "Hytale roleplay servers",
  ],
  maps: [
    "Hytale maps",
    "Hytale custom maps",
    "Hytale map download",
    "best Hytale maps",
    "Hytale adventure maps",
    "Hytale parkour maps",
    "Hytale world downloads",
  ],
  textures: [
    "Hytale textures",
    "Hytale texture packs",
    "Hytale resource packs",
    "Hytale texture download",
    "best Hytale textures",
    "Hytale HD textures",
  ],
  ideas: [
    "Hytale ideas",
    "Hytale suggestions",
    "Hytale feature requests",
    "Hytale mod ideas",
    "Hytale community ideas",
  ],
  guides: [
    "Hytale guide",
    "Hytale tutorial",
    "Hytale server setup",
    "how to run Hytale server",
    "Hytale server manual",
    "Hytale dedicated server",
    "Hytale server configuration",
    "Hytale Java 25",
    "Hytale QUIC",
    "Hytale multiserver",
    "Hytale server hosting guide",
    "Hytale port forwarding",
  ],
};

// ─── Page Descriptions ───

export const PAGE_DESCRIPTIONS = {
  home: "Mytale is your ultimate Hytale community hub. Browse the best Hytale server list, download Hytale mods, plugins, texture packs, resource packs, maps and worlds. Find Hytale multiplayer servers and join thousands of players. The #1 Hytale index for mods and servers.",
  mods: "Browse and download the best Hytale mods. Enhance your gameplay with community-created mods including gameplay tweaks, new creatures, items, and more. Free Hytale mod downloads.",
  plugins: "Find the best Hytale server plugins. Download plugins for your Hytale server including economy, permissions, minigames, and custom features. Free plugin downloads.",
  servers: "Find the perfect Hytale server for your playstyle. Browse our comprehensive Hytale server list featuring survival, PvP, creative, roleplay, and minigame servers worldwide.",
  maps: "Download custom Hytale maps and worlds. Explore adventure maps, parkour challenges, PvP arenas, and creative builds made by the Hytale community.",
  textures: "Browse and download Hytale texture packs and resource packs. Transform your Hytale visuals with HD textures, realistic packs, and unique art styles.",
  ideas: "Share and vote on Hytale mod ideas and feature suggestions. Help shape the future of Hytale modding by contributing your creative ideas to the community.",
  guides: "Comprehensive guides and tutorials for Hytale. Learn how to set up and run a dedicated Hytale server, install mods, configure multiserver architecture, and optimize performance.",
};

// ─── Navigation ───

export const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Servers", href: "/servers" },
  { label: "Mods", href: "/mods" },
  { label: "Plugins", href: "/plugins" },
  { label: "Maps", href: "/maps" },
  { label: "Textures", href: "/textures" },
  { label: "Ideas", href: "/ideas" },
  { label: "Guides", href: "/guides" },
];

// ─── Social Links ───

export const SOCIAL_LINKS = {
  discord: "https://discord.gg/RsAmEkzq7U",
  twitter: "https://x.com/MytaleHytale",
};

