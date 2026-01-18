"use client";

import { useState } from "react";
import { ChevronUp, Loader2 } from "lucide-react";

interface VoteButtonProps {
  creatorId: string;
  initialVotes: number;
}

export function VoteButton({ creatorId, initialVotes }: VoteButtonProps) {
  const [votes, setVotes] = useState(initialVotes);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = async () => {
    if (isVoting || hasVoted) return;

    setIsVoting(true);

    try {
      const response = await fetch("/api/creators/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creatorId }),
      });

      const data = await response.json();

      if (data.success) {
        setVotes(data.upvotes);
        setHasVoted(true);
      } else if (data.error === "already_voted") {
        setHasVoted(true);
      }
    } catch (error) {
      console.error("Error voting:", error);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <button
      onClick={handleVote}
      disabled={isVoting || hasVoted}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
        ${hasVoted
          ? "bg-primary-500/20 text-primary-400 cursor-default"
          : "bg-surface-elevated hover:bg-primary-500/20 hover:text-primary-400 text-foreground-muted"
        }
        ${isVoting ? "opacity-50" : ""}
      `}
    >
      {isVoting ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <ChevronUp className="w-4 h-4" />
      )}
      <span>{votes}</span>
      <span className="text-sm">upvote{votes !== 1 ? "s" : ""}</span>
    </button>
  );
}

