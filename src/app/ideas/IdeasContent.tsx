"use client";

import { useState, useMemo } from "react";
import { ChevronUp, Search, Sparkles, Clock, Loader2, User, Lightbulb } from "lucide-react";
import { Card, Badge, Input } from "@/components/ui";
import { formatRelativeTime } from "@/lib/utils";

interface Idea {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  votes: number;
  status: string;
  is_featured: boolean;
  created_at: string;
  profiles: {
    id: string;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  } | null;
}

const CATEGORIES = [
  { value: "all", label: "All Ideas" },
  { value: "Mod", label: "Mod Ideas" },
  { value: "Plugin", label: "Plugin Ideas" },
  { value: "Feature", label: "Feature Requests" },
  { value: "Map", label: "Map Ideas" },
  { value: "Texture", label: "Texture Ideas" },
  { value: "General", label: "General" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

const SORT_OPTIONS = [
  { value: "votes", label: "Most Voted" },
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
];

interface IdeasContentProps {
  initialIdeas: Idea[];
}

export function IdeasContent({ initialIdeas }: IdeasContentProps) {
  const [ideas, setIdeas] = useState(initialIdeas);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("votes");
  const [votingId, setVotingId] = useState<string | null>(null);
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());

  const filteredIdeas = useMemo(() => {
    let result = [...ideas];

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (idea) =>
          idea.title.toLowerCase().includes(searchLower) ||
          idea.description.toLowerCase().includes(searchLower) ||
          idea.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    // Category filter
    if (category !== "all") {
      result = result.filter((idea) => idea.category === category);
    }

    // Status filter
    if (status !== "all") {
      result = result.filter((idea) => idea.status === status);
    }

    // Sort
    switch (sort) {
      case "newest":
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case "votes":
      default:
        result.sort((a, b) => b.votes - a.votes);
        break;
    }

    return result;
  }, [ideas, search, category, status, sort]);

  const handleVote = async (ideaId: string) => {
    if (votingId || votedIds.has(ideaId)) return;

    setVotingId(ideaId);

    try {
      const response = await fetch("/api/ideas/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ideaId }),
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setIdeas((prev) =>
          prev.map((idea) =>
            idea.id === ideaId ? { ...idea, votes: data.votes } : idea
          )
        );
        setVotedIds((prev) => new Set([...prev, ideaId]));
      } else if (data.error === "You have already voted for this idea") {
        setVotedIds((prev) => new Set([...prev, ideaId]));
      }
    } catch (error) {
      console.error("Vote error:", error);
    } finally {
      setVotingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in_progress":
        return <Badge variant="warning">In Progress</Badge>;
      case "completed":
        return <Badge variant="success">Completed</Badge>;
      default:
        return <Badge variant="default">Open</Badge>;
    }
  };

  return (
    <div>
      {/* Filters */}
      <div className="bg-surface rounded-xl border border-border p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ideas..."
              className="pl-10"
            />
          </div>

          {/* Category */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2.5 bg-surface border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>

          {/* Status */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-4 py-2.5 bg-surface border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-2.5 bg-surface border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-foreground-muted mb-6">
        Showing {filteredIdeas.length} idea{filteredIdeas.length !== 1 ? "s" : ""}
      </p>

      {/* Ideas List */}
      {filteredIdeas.length > 0 ? (
        <div className="space-y-4">
          {filteredIdeas.map((idea) => {
            const hasVoted = votedIds.has(idea.id);
            const isVoting = votingId === idea.id;

            return (
              <Card
                key={idea.id}
                className="p-4 sm:p-6 flex gap-4"
              >
                {/* Vote Button */}
                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => handleVote(idea.id)}
                    disabled={isVoting || hasVoted}
                    className={`
                      w-12 h-12 rounded-xl flex items-center justify-center transition-all
                      ${hasVoted
                        ? "bg-primary-500/20 text-primary-400 cursor-default"
                        : "bg-surface-elevated hover:bg-primary-500/20 hover:text-primary-400 text-foreground-muted"
                      }
                      ${isVoting ? "opacity-50" : ""}
                    `}
                  >
                    {isVoting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <ChevronUp className={`w-6 h-6 ${hasVoted ? "text-primary-400" : ""}`} />
                    )}
                  </button>
                  <span className={`text-lg font-bold ${hasVoted ? "text-primary-400" : "text-foreground"}`}>
                    {idea.votes}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-lg font-display font-semibold text-foreground">
                      {idea.title}
                    </h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {idea.is_featured && (
                        <Badge variant="accent">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      {getStatusBadge(idea.status)}
                    </div>
                  </div>

                  <p className="text-foreground-muted mb-3 line-clamp-2">
                    {idea.description}
                  </p>

                  {/* Tags */}
                  {idea.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      <Badge variant="secondary" size="sm">
                        {idea.category}
                      </Badge>
                      {idea.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="default" size="sm" className="bg-stone-800">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-sm text-foreground-subtle">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{idea.profiles?.display_name || idea.profiles?.username || "Anonymous"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatRelativeTime(idea.created_at)}</span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <Lightbulb className="w-16 h-16 text-foreground-muted mx-auto mb-4" />
          <p className="text-foreground-muted text-lg">
            No ideas found matching your criteria.
          </p>
          <p className="text-foreground-subtle mt-2">
            Be the first to share an idea!
          </p>
        </div>
      )}
    </div>
  );
}

