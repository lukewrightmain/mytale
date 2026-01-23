import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Clock, Tag, Sparkles, FileText } from "lucide-react";
import { Button, Card, Badge } from "@/components/ui";
import { getIdeaById, getIdeaComments } from "@/lib/supabase/queries";
import { formatRelativeTime } from "@/lib/utils";
import { SITE_URL } from "@/lib/constants";
import { VoteButton } from "./VoteButton";
import { CommentsSection } from "./CommentsSection";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const idea = await getIdeaById(id);

  if (!idea) {
    return {
      title: "Idea Not Found",
      description: "The requested idea could not be found.",
    };
  }

  const title = `${idea.title} - Hytale ${idea.category} Idea`;
  const description = idea.description?.substring(0, 160) || `A Hytale community idea: ${idea.title}`;

  return {
    title,
    description,
    keywords: [idea.category, "Hytale idea", "Hytale suggestion", ...(idea.tags || [])].filter(Boolean),
    openGraph: {
      title: `${idea.title} | Mytale Ideas`,
      description,
      url: `${SITE_URL}/ideas/${id}`,
      type: "article",
    },
    twitter: {
      card: "summary",
      title: `${idea.title} | Mytale Ideas`,
      description,
    },
    alternates: {
      canonical: `${SITE_URL}/ideas/${id}`,
    },
  };
}

export default async function IdeaDetailPage({ params }: Props) {
  const { id } = await params;
  const [idea, comments] = await Promise.all([
    getIdeaById(id),
    getIdeaComments(id),
  ]);

  if (!idea) {
    notFound();
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in_progress":
        return <Badge variant="warning">In Progress</Badge>;
      case "completed":
        return <Badge variant="success">Completed</Badge>;
      case "closed":
        return <Badge variant="default">Closed</Badge>;
      default:
        return <Badge variant="primary">Open</Badge>;
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/ideas"
          className="inline-flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Ideas
        </Link>

        {/* Main Card */}
        <Card className="p-6 sm:p-8">
          <div className="flex gap-6">
            {/* Vote Section */}
            <div className="flex flex-col items-center gap-2">
              <VoteButton ideaId={idea.id} initialVotes={idea.votes} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Badge variant="secondary">{idea.category}</Badge>
                    {idea.is_featured && (
                      <Badge variant="accent">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    {getStatusBadge(idea.status)}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                    {idea.title}
                  </h1>
                </div>
              </div>

              {/* Author & Date */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-foreground-muted mb-6 pb-6 border-b border-border">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>
                    Submitted by{" "}
                    <span className="text-foreground font-medium">
                      {idea.profiles?.display_name || idea.profiles?.username || "Anonymous"}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{formatRelativeTime(idea.created_at)}</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-lg font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Description
                </h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-foreground-muted whitespace-pre-wrap leading-relaxed">
                    {idea.description}
                  </p>
                </div>
              </div>

              {/* Tags */}
              {idea.tags && idea.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {idea.tags.map((tag: string) => (
                      <Badge key={tag} variant="default" className="bg-stone-800">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Comments Section */}
        <CommentsSection ideaId={idea.id} initialComments={comments} />

        {/* Call to Action */}
        <div className="mt-8 text-center">
          <p className="text-foreground-muted mb-4">
            Have a similar idea or want to add more details?
          </p>
          <Link href="/ideas/submit">
            <Button variant="outline">
              Share Your Own Idea
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

