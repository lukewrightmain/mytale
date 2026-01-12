"use client";

import { Search } from "lucide-react";
import { Input, Badge } from "@/components/ui";
import { REGION_OPTIONS, GAME_MODE_OPTIONS, SERVER_SORT_OPTIONS } from "@/lib/constants";

interface ServerFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  region: string;
  onRegionChange: (value: string) => void;
  gameMode: string;
  onGameModeChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  totalCount: number;
}

export function ServerFilters({
  search,
  onSearchChange,
  region,
  onRegionChange,
  gameMode,
  onGameModeChange,
  sort,
  onSortChange,
  totalCount,
}: ServerFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Search */}
      <Input
        placeholder="Search servers..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        icon={<Search className="w-4 h-4" />}
      />

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Region */}
        <select
          value={region}
          onChange={(e) => onRegionChange(e.target.value)}
          className="bg-surface-elevated border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/50"
        >
          {REGION_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Game Mode */}
        <select
          value={gameMode}
          onChange={(e) => onGameModeChange(e.target.value)}
          className="bg-surface-elevated border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/50"
        >
          {GAME_MODE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="bg-surface-elevated border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/50"
        >
          {SERVER_SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Count */}
        <div className="ml-auto">
          <Badge variant="default">{totalCount} servers</Badge>
        </div>
      </div>
    </div>
  );
}

