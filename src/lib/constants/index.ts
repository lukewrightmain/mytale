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
  "na-east": { label: "North America (East)", flag: "🇺🇸" },
  "na-west": { label: "North America (West)", flag: "🇺🇸" },
  eu: { label: "Europe", flag: "🇪🇺" },
  asia: { label: "Asia", flag: "🌏" },
  oceania: { label: "Oceania", flag: "🇦🇺" },
  sa: { label: "South America", flag: "🇧🇷" },
};

export const REGION_OPTIONS: FilterOption[] = [
  { value: "all", label: "All Regions" },
  { value: "na-east", label: "🇺🇸 NA East" },
  { value: "na-west", label: "🇺🇸 NA West" },
  { value: "eu", label: "🇪🇺 Europe" },
  { value: "asia", label: "🌏 Asia" },
  { value: "oceania", label: "🇦🇺 Oceania" },
  { value: "sa", label: "🇧🇷 South America" },
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
export const SITE_DESCRIPTION = "The premier destination for Hytale mods, plugins, and server discovery.";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// ─── Navigation ───

export const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Servers", href: "/servers" },
  { label: "Mods", href: "/mods" },
];

// ─── Social Links ───

export const SOCIAL_LINKS = {
  discord: "https://discord.gg/mytale",
  twitter: "https://twitter.com/mytale",
  github: "https://github.com/mytale",
};

