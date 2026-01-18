"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Filter, Plus, Video, Sparkles, Clock } from "lucide-react";
import { Button, Input, Card } from "@/components/ui";
import { ContentCreatorCard } from "@/components/creators/ContentCreatorCard";
import type { ContentCreatorWithProfile, ScheduleSlot } from "@/lib/supabase/queries";

interface CreatorsContentProps {
  initialCreators: ContentCreatorWithProfile[];
}

// Platform options
const PLATFORMS = [
  { value: "all", label: "All Platforms" },
  { value: "twitch", label: "Twitch" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "kick", label: "Kick" },
  { value: "other", label: "Other" },
];

// Language options
const LANGUAGES = [
  { value: "all", label: "All Languages" },
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "pt", label: "Portuguese" },
  { value: "ru", label: "Russian" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "zh", label: "Chinese" },
  { value: "pl", label: "Polish" },
  { value: "it", label: "Italian" },
  { value: "nl", label: "Dutch" },
  { value: "tr", label: "Turkish" },
  { value: "ar", label: "Arabic" },
];

// Timezone groups for filtering
const TIMEZONE_GROUPS = [
  { value: "all", label: "All Timezones" },
  { value: "americas", label: "Americas (UTC-10 to UTC-3)" },
  { value: "europe", label: "Europe/Africa (UTC-1 to UTC+3)" },
  { value: "asia", label: "Asia/Pacific (UTC+4 to UTC+12)" },
];

// Day of week options
const DAYS = [
  { value: "all", label: "Any Day" },
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
];

// Helper to check if a timezone is in a group
function isTimezoneInGroup(timezone: string, group: string): boolean {
  if (group === "all") return true;
  
  const americasZones = ["America/", "Pacific/", "US/"];
  const europeZones = ["Europe/", "Africa/", "Atlantic/"];
  const asiaZones = ["Asia/", "Australia/", "Indian/"];

  switch (group) {
    case "americas":
      return americasZones.some((z) => timezone.startsWith(z));
    case "europe":
      return europeZones.some((z) => timezone.startsWith(z));
    case "asia":
      return asiaZones.some((z) => timezone.startsWith(z));
    default:
      return true;
  }
}

// Helper to check if creator streams on a specific day
function streamsOnDay(schedule: ScheduleSlot[] | null | undefined, day: string): boolean {
  if (day === "all") return true;
  if (!schedule || !Array.isArray(schedule)) return false;
  return schedule.some((slot) => slot.day === day);
}

export function CreatorsContent({ initialCreators }: CreatorsContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [platform, setPlatform] = useState("all");
  const [language, setLanguage] = useState("all");
  const [timezoneGroup, setTimezoneGroup] = useState("all");
  const [streamDay, setStreamDay] = useState("all");
  const [sortBy, setSortBy] = useState<"upvotes" | "newest">("upvotes");
  const [showFilters, setShowFilters] = useState(false);

  const filteredCreators = useMemo(() => {
    let filtered = [...initialCreators];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (creator) =>
          creator.name.toLowerCase().includes(query) ||
          creator.bio?.toLowerCase().includes(query)
      );
    }

    // Platform filter
    if (platform !== "all") {
      filtered = filtered.filter((c) => c.primary_platform === platform);
    }

    // Language filter
    if (language !== "all") {
      filtered = filtered.filter((c) => c.language === language);
    }

    // Timezone group filter
    if (timezoneGroup !== "all") {
      filtered = filtered.filter((c) => isTimezoneInGroup(c.timezone, timezoneGroup));
    }

    // Stream day filter
    if (streamDay !== "all") {
      filtered = filtered.filter((c) => streamsOnDay(c.schedule, streamDay));
    }

    // Sort
    if (sortBy === "newest") {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else {
      filtered.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
    }

    return filtered;
  }, [initialCreators, searchQuery, platform, language, timezoneGroup, streamDay, sortBy]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
            <Video className="w-8 h-8 text-primary-500" />
            Content Creators
          </h1>
          <p className="text-foreground-muted">
            Discover Hytale streamers, YouTubers, and content creators
          </p>
        </div>
        <Link href="/creators/submit">
          <Button variant="primary" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Your Profile
          </Button>
        </Link>
      </div>

      {/* Search & Filters */}
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col gap-4">
          {/* Search Bar */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" />
              <Input
                type="text"
                placeholder="Search creators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-4 border-t border-border">
              {/* Platform */}
              <div>
                <label className="block text-sm font-medium text-foreground-muted mb-2">
                  Platform
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-elevated border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {PLATFORMS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Language */}
              <div>
                <label className="block text-sm font-medium text-foreground-muted mb-2">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-elevated border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.value} value={l.value}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Timezone Group */}
              <div>
                <label className="block text-sm font-medium text-foreground-muted mb-2">
                  Region
                </label>
                <select
                  value={timezoneGroup}
                  onChange={(e) => setTimezoneGroup(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-elevated border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {TIMEZONE_GROUPS.map((tz) => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stream Day */}
              <div>
                <label className="block text-sm font-medium text-foreground-muted mb-2">
                  Streams On
                </label>
                <select
                  value={streamDay}
                  onChange={(e) => setStreamDay(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-elevated border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {DAYS.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-foreground-muted mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "upvotes" | "newest")}
                  className="w-full px-3 py-2 bg-surface-elevated border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="upvotes">Most Popular</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-foreground-muted">
          {filteredCreators.length} creator{filteredCreators.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Creators Grid */}
      {filteredCreators.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCreators.map((creator) => (
            <ContentCreatorCard key={creator.id} creator={creator} />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <Sparkles className="w-12 h-12 text-foreground-muted" />
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No creators found
              </h3>
              <p className="text-foreground-muted mb-4">
                {searchQuery || platform !== "all" || language !== "all"
                  ? "Try adjusting your filters or search query"
                  : "Be the first to add your creator profile!"}
              </p>
              <Link href="/creators/submit">
                <Button variant="primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your Profile
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

