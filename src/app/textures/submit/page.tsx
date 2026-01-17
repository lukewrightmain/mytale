"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { ArrowLeft, Upload, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button, Card, Input, Badge, ImageUpload } from "@/components/ui";
import { submitTexture, type TextureSubmissionData } from "@/lib/supabase/actions";
import { uploadImage } from "@/lib/supabase/storage";

const CATEGORIES = [
  { value: "Realistic", label: "Realistic" },
  { value: "Fantasy", label: "Fantasy" },
  { value: "Medieval", label: "Medieval" },
  { value: "Modern", label: "Modern" },
  { value: "Cartoon", label: "Cartoon" },
  { value: "Minimalist", label: "Minimalist" },
  { value: "Sci-Fi", label: "Sci-Fi" },
  { value: "Nature", label: "Nature" },
  { value: "Dark", label: "Dark/Gothic" },
  { value: "Faithful", label: "Faithful/Vanilla+" },
];

const RESOLUTIONS = [
  { value: "16x", label: "16x (Vanilla)" },
  { value: "32x", label: "32x" },
  { value: "64x", label: "64x" },
  { value: "128x", label: "128x" },
  { value: "256x", label: "256x" },
  { value: "512x", label: "512x (High-End)" },
];

export default function SubmitTexturePage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<TextureSubmissionData>({
    name: "",
    tagline: "",
    description: "",
    category: "Realistic",
    resolution: "32x",
    tags: "",
    thumbnailUrl: "",
    // Version info
    versionNumber: "1.0.0",
    gameVersion: "1.0",
    downloadUrl: "",
    changelog: "",
    supportUrl: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (file: File) => {
    return await uploadImage(file, "textures");
  };

  const handleImageChange = (url: string | null) => {
    setFormData((prev) => ({ ...prev, thumbnailUrl: url || "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await submitTexture(formData);

      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/textures");
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
            You need to sign in to submit a texture pack to Mytale.
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
            Texture Pack Submitted!
          </h2>
          <p className="text-foreground-muted mb-4">
            Your texture pack has been submitted for review. We&apos;ll notify you once it&apos;s approved.
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
            href="/textures"
            className="inline-flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Textures
          </Link>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-2">
            Upload a <span className="gradient-text">Texture Pack</span>
          </h1>
          <p className="text-foreground-muted">
            Share your visual creation with the Hytale community
          </p>
        </div>

        {/* Form */}
        <Card className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Thumbnail Image */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Preview Image
              </label>
              <ImageUpload
                value={formData.thumbnailUrl}
                onChange={handleImageChange}
                onUpload={handleImageUpload}
              />
              <p className="text-xs text-foreground-muted mt-2">
                Recommended: 1280×720 pixels (16:9 ratio). Show a comparison or showcase!
              </p>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Texture Pack Name *
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Crystal Clear HD"
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
                placeholder="A vibrant, high-resolution texture overhaul"
                required
              />
              <p className="text-xs text-foreground-muted mt-1">
                A brief one-liner that describes your texture pack (max 100 characters)
              </p>
            </div>

            {/* Category & Resolution */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Style *
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
                  Resolution *
                </label>
                <select
                  name="resolution"
                  value={formData.resolution}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  {RESOLUTIONS.map((res) => (
                    <option key={res.value} value={res.value}>
                      {res.label}
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
                placeholder="realistic, detailed, PBR, shaders-compatible"
              />
              <p className="text-xs text-foreground-muted mt-1">
                Comma-separated tags to help users find your texture pack
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
                placeholder="Describe your texture pack in detail. What's the visual style? What blocks/items are covered? Is it shader-compatible?"
                rows={6}
                className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                required
              />
            </div>

            {/* Divider - Version Info */}
            <div className="border-t border-border pt-6">
              <h3 className="text-lg font-display font-bold text-foreground mb-4">
                Version & Download
              </h3>
              
              {/* Version Number & Game Version */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Version Number *
                  </label>
                  <Input
                    name="versionNumber"
                    value={formData.versionNumber}
                    onChange={handleChange}
                    placeholder="1.0.0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Hytale Version *
                  </label>
                  <Input
                    name="gameVersion"
                    value={formData.gameVersion}
                    onChange={handleChange}
                    placeholder="1.0"
                    required
                  />
                </div>
              </div>

              {/* Download URL */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Download URL *
                </label>
                <Input
                  name="downloadUrl"
                  value={formData.downloadUrl}
                  onChange={handleChange}
                  placeholder="https://drive.google.com/file/d/.../view"
                  required
                />
                <p className="text-xs text-foreground-muted mt-1">
                  Direct link to your texture pack file (Google Drive, Dropbox, MediaFire, etc.)
                </p>
              </div>

              {/* Changelog */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Changelog
                </label>
                <textarea
                  name="changelog"
                  value={formData.changelog}
                  onChange={handleChange}
                  placeholder="Initial release"
                  rows={3}
                  className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
              </div>
            </div>

            {/* Divider - Support Link */}
            <div className="border-t border-border pt-6">
              <h3 className="text-lg font-display font-bold text-foreground mb-2">
                Support Link (Optional)
              </h3>
              <p className="text-sm text-foreground-muted mb-4">
                Add a link where users can support you (Patreon, Ko-fi, Buy Me a Coffee, PayPal, etc.)
              </p>
              <Input
                name="supportUrl"
                value={formData.supportUrl}
                onChange={handleChange}
                placeholder="https://ko-fi.com/yourusername"
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
                    Submit Texture Pack
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


