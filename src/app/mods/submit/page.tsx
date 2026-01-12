"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { ArrowLeft, Upload, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button, Card, Input, Badge, ImageUpload } from "@/components/ui";
import { submitMod, type ModSubmissionData } from "@/lib/supabase/actions";
import { uploadImage } from "@/lib/supabase/storage";

const CATEGORIES = [
  { value: "Gameplay", label: "Gameplay" },
  { value: "Graphics", label: "Graphics" },
  { value: "Server", label: "Server" },
  { value: "Building", label: "Building" },
  { value: "Creatures", label: "Creatures" },
  { value: "UI", label: "UI" },
  { value: "Adventure", label: "Adventure" },
  { value: "Tools", label: "Tools" },
];

const MOD_TYPES = [
  { value: "mod", label: "Mod" },
  { value: "plugin", label: "Plugin" },
  { value: "resource_pack", label: "Resource Pack" },
  { value: "shader", label: "Shader" },
  { value: "modpack", label: "Modpack" },
];

export default function SubmitModPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<ModSubmissionData>({
    name: "",
    tagline: "",
    description: "",
    category: "Gameplay",
    modType: "mod",
    tags: "",
    thumbnailUrl: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (file: File) => {
    return await uploadImage(file, "mods");
  };

  const handleImageChange = (url: string | null) => {
    setFormData((prev) => ({ ...prev, thumbnailUrl: url || "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await submitMod(formData);

      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/mods");
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
            You need to sign in to submit a mod to Mytale.
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
            Mod Submitted!
          </h2>
          <p className="text-foreground-muted mb-4">
            Your mod has been submitted for review. We&apos;ll notify you once it&apos;s approved.
          </p>
          <Badge variant="warning">Pending Review</Badge>
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
            href="/mods"
            className="inline-flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Mods
          </Link>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-2">
            Upload a <span className="gradient-text">Mod</span>
          </h1>
          <p className="text-foreground-muted">
            Share your creation with the Hytale community
          </p>
        </div>

        {/* Form */}
        <Card className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Thumbnail Image */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Thumbnail Image
              </label>
              <ImageUpload
                value={formData.thumbnailUrl}
                onChange={handleImageChange}
                onUpload={handleImageUpload}
              />
              <p className="text-xs text-foreground-muted mt-2">
                Recommended: 1280×720 pixels (16:9 ratio). Max 5MB.
              </p>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Mod Name *
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="My Awesome Mod"
                required
              />
            </div>

            {/* Tagline */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tagline *
              </label>
              <Input
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                placeholder="A short description of what your mod does"
                required
              />
              <p className="text-xs text-foreground-muted mt-1">
                A brief one-liner that describes your mod (max 100 characters)
              </p>
            </div>

            {/* Category & Type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Type *
                </label>
                <select
                  name="modType"
                  value={formData.modType}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  {MOD_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
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
                placeholder="combat, magic, rpg"
              />
              <p className="text-xs text-foreground-muted mt-1">
                Comma-separated tags to help users find your mod
              </p>
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
                placeholder="Describe your mod in detail. What does it add? How does it work? Any installation instructions?"
                rows={6}
                className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                required
              />
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
                    Submitting...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Submit Mod
                  </>
                )}
              </Button>
            </div>

            <p className="text-xs text-foreground-muted text-center">
              By submitting, you agree to our terms of service and content guidelines.
              All submissions are reviewed before being published.
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}
