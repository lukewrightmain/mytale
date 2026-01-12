"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { ArrowLeft, Upload, Loader2, CheckCircle, Server, Monitor } from "lucide-react";
import Link from "next/link";
import { Button, Card, Input, Badge, ImageUpload } from "@/components/ui";
import { submitPlugin, type PluginSubmissionData } from "@/lib/supabase/actions";
import { uploadImage } from "@/lib/supabase/storage";

const CATEGORIES = [
  { value: "Utility", label: "Utility" },
  { value: "Admin", label: "Admin & Management" },
  { value: "Economy", label: "Economy" },
  { value: "Chat", label: "Chat & Social" },
  { value: "Protection", label: "Protection" },
  { value: "Teleportation", label: "Teleportation" },
  { value: "World", label: "World Management" },
  { value: "Minigames", label: "Minigames" },
  { value: "RPG", label: "RPG & Mechanics" },
  { value: "API", label: "API & Libraries" },
];

export default function SubmitPluginPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<PluginSubmissionData>({
    name: "",
    tagline: "",
    description: "",
    category: "Utility",
    tags: "",
    thumbnailUrl: "",
    serverSide: true,
    clientSide: false,
    apiVersion: "",
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
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (file: File) => {
    return await uploadImage(file, "plugins");
  };

  const handleImageChange = (url: string | null) => {
    setFormData((prev) => ({ ...prev, thumbnailUrl: url || "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await submitPlugin(formData);

      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/plugins");
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
            You need to sign in to submit a plugin to Mytale.
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
            Plugin Submitted!
          </h2>
          <p className="text-foreground-muted mb-4">
            Your plugin has been submitted for review. We&apos;ll notify you once it&apos;s approved.
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
            href="/plugins"
            className="inline-flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Plugins
          </Link>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-2">
            Upload a <span className="gradient-text">Plugin</span>
          </h1>
          <p className="text-foreground-muted">
            Share your server plugin with the Hytale community
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
                Plugin Name *
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="My Awesome Plugin"
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
                placeholder="A short description of what your plugin does"
                required
              />
              <p className="text-xs text-foreground-muted mt-1">
                A brief one-liner that describes your plugin (max 100 characters)
              </p>
            </div>

            {/* Category */}
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

            {/* Server/Client Side */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Plugin Type *
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-3 p-4 bg-surface border border-border rounded-lg cursor-pointer hover:border-primary-500/50 transition-colors flex-1">
                  <input
                    type="checkbox"
                    name="serverSide"
                    checked={formData.serverSide}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-border bg-surface text-primary-500 focus:ring-primary-500"
                  />
                  <div className="flex items-center gap-2">
                    <Server className="w-5 h-5 text-primary-400" />
                    <span className="text-foreground font-medium">Server-Side</span>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-4 bg-surface border border-border rounded-lg cursor-pointer hover:border-primary-500/50 transition-colors flex-1">
                  <input
                    type="checkbox"
                    name="clientSide"
                    checked={formData.clientSide}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-border bg-surface text-primary-500 focus:ring-primary-500"
                  />
                  <div className="flex items-center gap-2">
                    <Monitor className="w-5 h-5 text-accent-400" />
                    <span className="text-foreground font-medium">Client-Side</span>
                  </div>
                </label>
              </div>
              <p className="text-xs text-foreground-muted mt-2">
                Select where your plugin runs. Most plugins are server-side only.
              </p>
            </div>

            {/* API Version */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                API Version
              </label>
              <Input
                name="apiVersion"
                value={formData.apiVersion}
                onChange={handleChange}
                placeholder="e.g., 1.0.0"
              />
              <p className="text-xs text-foreground-muted mt-1">
                The Hytale Plugin API version your plugin targets
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
                placeholder="economy, permissions, admin"
              />
              <p className="text-xs text-foreground-muted mt-1">
                Comma-separated tags to help users find your plugin
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
                placeholder="Describe your plugin in detail. What does it do? How do you configure it? What commands are available?"
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
                  placeholder="https://github.com/you/plugin/releases/download/v1.0.0/plugin.jar"
                  required
                />
                <p className="text-xs text-foreground-muted mt-1">
                  Direct link to your plugin file (GitHub, Google Drive, Dropbox, etc.)
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
                    Submit Plugin
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

