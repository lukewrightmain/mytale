"use client";

import { useState } from "react";
import { ChevronUp, Loader2 } from "lucide-react";

interface VoteButtonProps {
  ideaId: string;
  initialVotes: number;
}

export function VoteButton({ ideaId, initialVotes }: VoteButtonProps) {
  const [votes, setVotes] = useState(initialVotes);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = async () => {
    if (isVoting || hasVoted) return;

    setIsVoting(true);

    try {
      const response = await fetch("/api/ideas/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ideaId }),
      });

      const data = await response.json();

      if (data.success) {
        setVotes(data.votes);
        setHasVoted(true);
      } else if (data.error === "You have already voted for this idea") {
        setHasVoted(true);
      }
    } catch (error) {
      console.error("Vote error:", error);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleVote}
        disabled={isVoting || hasVoted}
        className={`
          w-16 h-16 rounded-xl flex items-center justify-center transition-all
          ${hasVoted
            ? "bg-primary-500/20 text-primary-400 cursor-default"
            : "bg-surface-elevated hover:bg-primary-500/20 hover:text-primary-400 text-foreground-muted"
          }
          ${isVoting ? "opacity-50" : ""}
        `}
      >
        {isVoting ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          <ChevronUp className={`w-8 h-8 ${hasVoted ? "text-primary-400" : ""}`} />
        )}
      </button>
      <span className={`text-2xl font-bold ${hasVoted ? "text-primary-400" : "text-foreground"}`}>
        {votes}
      </span>
      <span className="text-xs text-foreground-muted">votes</span>
    </div>
  );
}

