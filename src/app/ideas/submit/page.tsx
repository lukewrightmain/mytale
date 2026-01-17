"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { ArrowLeft, Lightbulb, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button, Card, Input, Badge } from "@/components/ui";
import { submitIdea, type IdeaSubmissionData } from "@/lib/supabase/actions";

const CATEGORIES = [
  { value: "Mod", label: "Mod Idea", description: "Ideas for game modifications" },
  { value: "Plugin", label: "Plugin Idea", description: "Ideas for server plugins" },
  { value: "Feature", label: "Feature Request", description: "Game or community features" },
  { value: "Map", label: "Map Idea", description: "Ideas for custom maps" },
  { value: "Texture", label: "Texture Idea", description: "Ideas for texture packs" },
  { value: "General", label: "General", description: "Other creative ideas" },
];

export default function SubmitIdeaPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<IdeaSubmissionData>({
    title: "",
    description: "",
    category: "Mod",
    tags: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await submitIdea(formData);

      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/ideas");
        }, 2000);
      } else {
        setError(result.error || "Something went wrong");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-400" />
      </div>
    );
  }

  // Not signed in
  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <h2 className="text-2xl font-display font-bold text-foreground mb-4">
            Sign In Required
          </h2>
          <p className="text-foreground-muted mb-6">
            You need to sign in to share an idea on Mytale.
          </p>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </Card>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">
            Idea Shared!
          </h2>
          <p className="text-foreground-muted mb-4">
            Your idea has been posted. Let&apos;s see how many votes it gets!
          </p>
          <Badge variant="primary">Live Now</Badge>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/ideas"
            className="inline-flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Ideas
          </Link>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-2">
            Share Your <span className="gradient-text">Idea</span>
          </h1>
          <p className="text-foreground-muted">
            Got a brilliant concept? Share it with the community and let developers bring it to life!
          </p>
        </div>

        {/* Form */}
        <Card className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Idea Title *
              </label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="A flying mount system with customizable creatures"
                required
              />
              <p className="text-xs text-foreground-muted mt-1">
                Make it catchy and descriptive
              </p>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Category *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {CATEGORIES.map((cat) => (
                  <label
                    key={cat.value}
                    className={`
                      flex flex-col p-4 rounded-lg border cursor-pointer transition-all
                      ${formData.category === cat.value
                        ? "border-primary-500 bg-primary-500/10"
                        : "border-border hover:border-primary-500/50"
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="category"
                      value={cat.value}
                      checked={formData.category === cat.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className="font-medium text-foreground">{cat.label}</span>
                    <span className="text-xs text-foreground-muted">{cat.description}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your idea in detail. What would it do? How would it work? What would make it awesome?"
                rows={8}
                className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                required
              />
              <p className="text-xs text-foreground-muted mt-1">
                The more detail you provide, the better developers can understand your vision
              </p>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tags
              </label>
              <Input
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="flying, mounts, creatures, travel"
              />
              <p className="text-xs text-foreground-muted mt-1">
                Comma-separated tags to help categorize your idea
              </p>
            </div>

            {/* Tips */}
            <div className="p-4 bg-accent-500/10 border border-accent-500/30 rounded-lg">
              <h4 className="font-medium text-accent-400 mb-2 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Tips for a Great Idea
              </h4>
              <ul className="text-sm text-foreground-muted space-y-1">
                <li>• Be specific about what you want to see</li>
                <li>• Explain why it would be fun or useful</li>
                <li>• Consider how it might work technically</li>
                <li>• Include examples or references if helpful</li>
              </ul>
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
                {error}
              </div>
            )}

            {/* Submit */}
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sharing...
                  </>
                ) : (
                  <>
                    <Lightbulb className="w-4 h-4" />
                    Share Idea
                  </>
                )}
              </Button>
            </div>

            <p className="text-xs text-foreground-muted text-center">
              Your idea will be immediately visible to the community for voting.
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}


