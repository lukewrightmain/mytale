"use client";

import { Search } from "lucide-react";
import { Input, Badge } from "@/components/ui";

const SORT_OPTIONS = [
  { value: "upvotes", label: "Most Upvoted" },
  { value: "newest", label: "Newest" },
];

interface BuilderFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  totalCount: number;
}

export function BuilderFilters({
  search,
  onSearchChange,
  sort,
  onSortChange,
  totalCount,
}: BuilderFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Search */}
      <Input
        placeholder="Search builders..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        icon={<Search className="w-4 h-4" />}
      />

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="bg-surface-elevated border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/50"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Count */}
        <div className="ml-auto">
          <Badge variant="default">{totalCount} builders</Badge>
        </div>
      </div>
    </div>
  );
}
