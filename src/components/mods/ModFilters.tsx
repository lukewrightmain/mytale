"use client";

import { Search } from "lucide-react";
import { Input, Badge } from "@/components/ui";
import { MOD_CATEGORY_OPTIONS, MOD_TYPE_OPTIONS, MOD_SORT_OPTIONS } from "@/lib/constants";

interface ModFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  type: string;
  onTypeChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  totalCount: number;
}

export function ModFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  type,
  onTypeChange,
  sort,
  onSortChange,
  totalCount,
}: ModFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Search */}
      <Input
        placeholder="Search mods, plugins, and more..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        icon={<Search className="w-4 h-4" />}
      />

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Category */}
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="bg-surface-elevated border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/50"
        >
          {MOD_CATEGORY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Type */}
        <select
          value={type}
          onChange={(e) => onTypeChange(e.target.value)}
          className="bg-surface-elevated border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/50"
        >
          {MOD_TYPE_OPTIONS.map((option) => (
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
          {MOD_SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Count */}
        <div className="ml-auto">
          <Badge variant="default">{totalCount} results</Badge>
        </div>
      </div>
    </div>
  );
}


