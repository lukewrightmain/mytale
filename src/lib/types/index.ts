// ═══════════════════════════════════════════════════════════════════════════
// Mytale Type Definitions
// ═══════════════════════════════════════════════════════════════════════════

// ─── Server Types ───

export type GameMode =
  | "survival"
  | "creative"
  | "adventure"
  | "pvp"
  | "roleplay"
  | "minigames";

export type Region =
  | "na-east"
  | "na-west"
  | "eu"
  | "asia"
  | "oceania"
  | "sa";

export type ServerStatus = "online" | "offline" | "maintenance";

export interface Server {
  id: string;
  name: string;
  slug: string;
  description: string;
  banner: string;
  ip: string;
  port: number;
  discord?: string;
  website?: string;
  gameModes: GameMode[];
  region: Region;
  players: {
    online: number;
    max: number;
  };
  status: ServerStatus;
  featured: boolean;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Mod Types ───

export type ModCategory =
  | "gameplay"
  | "worldgen"
  | "creatures"
  | "items"
  | "ui"
  | "tools"
  | "library";

export type ModType =
  | "mod"
  | "plugin"
  | "resourcepack"
  | "map"
  | "modpack";

export interface ModVersion {
  id: string;
  number: string;
  gameVersion: string;
  downloadUrl: string;
  fileSize: number;
  changelog: string;
  downloads: number;
  releaseDate: Date;
}

export interface Author {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
}

export interface Mod {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  thumbnail: string;
  screenshots: string[];
  author: Author;
  category: ModCategory;
  type: ModType;
  tags: string[];
  downloads: number;
  rating: number;
  ratingCount: number;
  versions: ModVersion[];
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ─── User Types ───

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  discordId?: string;
  createdAt: Date;
}

// ─── UI Types ───

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

