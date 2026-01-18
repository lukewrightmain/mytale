"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { MessageSquare, Send, Loader2, Trash2, User } from "lucide-react";
import { Button, Card } from "@/components/ui";
import { formatRelativeTime } from "@/lib/utils";

interface Comment {
  id: string;
  idea_id: string;
  author_id: string;
  content: string;
  created_at: string;
  profiles: {
    id: string;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  } | null;
}

interface CommentsSectionProps {
  ideaId: string;
  initialComments: Comment[];
}

export function CommentsSection({ ideaId, initialComments }: CommentsSectionProps) {
  const { isSignedIn, user } = useUser();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/ideas/${ideaId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      });

      const data = await response.json();

      if (data.success && data.comment) {
        setComments((prev) => [...prev, data.comment]);
        setNewComment("");
      } else {
        setError(data.error || "Failed to submit comment");
      }
    } catch (err) {
      console.error("Error submitting comment:", err);
      setError("Failed to submit comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (deletingId) return;

    setDeletingId(commentId);

    try {
      const response = await fetch(`/api/ideas/${ideaId}/comments`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId }),
      });

      const data = await response.json();

      if (data.success) {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
      } else {
        setError(data.error || "Failed to delete comment");
      }
    } catch (err) {
      console.error("Error deleting comment:", err);
      setError("Failed to delete comment. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Card className="p-6 mt-8">
      <h2 className="text-xl font-display font-bold text-foreground mb-6 flex items-center gap-2">
        <MessageSquare className="w-5 h-5" />
        Discussion ({comments.length})
      </h2>

      {/* Comment Form */}
      {isSignedIn ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              {user?.imageUrl ? (
                <Image
                  src={user.imageUrl}
                  alt="Your avatar"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-surface-elevated flex items-center justify-center">
                  <User className="w-5 h-5 text-foreground-muted" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts, suggestions, or progress updates..."
                className="w-full px-4 py-3 bg-surface-elevated border border-border rounded-lg text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                rows={3}
                maxLength={2000}
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-foreground-subtle">
                  {newComment.length}/2000 characters
                </span>
                <Button
                  type="submit"
                  disabled={!newComment.trim() || isSubmitting}
                  size="sm"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Post Comment
                </Button>
              </div>
            </div>
          </div>
          {error && (
            <p className="text-red-400 text-sm mt-2">{error}</p>
          )}
        </form>
      ) : (
        <div className="bg-surface-elevated rounded-lg p-4 mb-6 text-center">
          <p className="text-foreground-muted mb-2">
            Sign in to join the discussion
          </p>
          <a href="/sign-in">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </a>
        </div>
      )}

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => {
            const isAuthor = user?.id && comment.profiles?.id;
            
            return (
              <div
                key={comment.id}
                className="flex gap-3 p-4 bg-surface-elevated rounded-lg"
              >
                <div className="flex-shrink-0">
                  {comment.profiles?.avatar_url ? (
                    <Image
                      src={comment.profiles.avatar_url}
                      alt={comment.profiles.display_name || comment.profiles.username}
                      width={36}
                      height={36}
                      className="rounded-full"
                      unoptimized
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-surface flex items-center justify-center">
                      <User className="w-4 h-4 text-foreground-muted" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">
                        {comment.profiles?.display_name || comment.profiles?.username || "Anonymous"}
                      </span>
                      <span className="text-xs text-foreground-subtle">
                        {formatRelativeTime(comment.created_at)}
                      </span>
                    </div>
                    {isAuthor && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        disabled={deletingId === comment.id}
                        className="p-1 text-foreground-subtle hover:text-red-400 transition-colors"
                        title="Delete comment"
                      >
                        {deletingId === comment.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                  <p className="text-foreground-muted whitespace-pre-wrap break-words">
                    {comment.content}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <MessageSquare className="w-12 h-12 text-foreground-subtle mx-auto mb-3" />
          <p className="text-foreground-muted">
            No comments yet. Be the first to share your thoughts!
          </p>
        </div>
      )}
    </Card>
  );
}

