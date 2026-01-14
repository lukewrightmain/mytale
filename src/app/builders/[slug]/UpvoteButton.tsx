"use client";

import { useState, useEffect } from "react";
import { ChevronUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui";

interface UpvoteButtonProps {
  builderId: string;
  initialUpvotes: number;
}

export function UpvoteButton({ builderId, initialUpvotes }: UpvoteButtonProps) {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [isUpvoting, setIsUpvoting] = useState(false);
  const [hasUpvoted, setHasUpvoted] = useState(false);

  // Check if user has already upvoted on mount
  useEffect(() => {
    const checkUpvote = async () => {
      try {
        const response = await fetch(`/api/builders/vote?builderId=${builderId}`);
        const data = await response.json();
        if (data.success && data.hasUpvoted) {
          setHasUpvoted(true);
        }
      } catch (error) {
        console.error("Failed to check upvote status:", error);
      }
    };

    checkUpvote();
  }, [builderId]);

  const handleUpvote = async () => {
    if (isUpvoting || hasUpvoted) return;

    setIsUpvoting(true);

    try {
      const response = await fetch("/api/builders/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ builderId }),
      });

      const data = await response.json();

      if (data.success) {
        setUpvotes(data.upvotes);
        setHasUpvoted(true);
      } else if (data.error === "You have already upvoted this builder") {
        setHasUpvoted(true);
      }
    } catch (error) {
      console.error("Upvote error:", error);
    } finally {
      setIsUpvoting(false);
    }
  };

  return (
    <button
      onClick={handleUpvote}
      disabled={isUpvoting || hasUpvoted}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg transition-all
        ${hasUpvoted
          ? "bg-primary-500/20 text-primary-400 cursor-default"
          : "bg-surface-elevated hover:bg-primary-500/20 hover:text-primary-400 text-foreground-muted border border-border"
        }
        ${isUpvoting ? "opacity-50" : ""}
      `}
    >
      {isUpvoting ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <ChevronUp className={`w-5 h-5 ${hasUpvoted ? "text-primary-400" : ""}`} />
      )}
      <span className={`font-medium ${hasUpvoted ? "text-primary-400" : ""}`}>
        {upvotes}
      </span>
      <span className="text-foreground-muted text-sm">upvotes</span>
    </button>
  );
}
