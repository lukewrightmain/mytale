"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { ArrowLeft, Upload, Loader2, CheckCircle, Plus, X, Youtube, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button, Card, Input, ImageUpload } from "@/components/ui";
import { submitBuilder, type BuilderSubmissionData } from "@/lib/supabase/actions";
import { uploadImage } from "@/lib/supabase/storage";

interface PortfolioItemInput {
  id: string;
  type: "image" | "video";
  url: string;
  title: string;
  description: string;
}

export default function SubmitBuilderPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploadingPortfolioImage, setIsUploadingPortfolioImage] = useState(false);

  const [formData, setFormData] = useState<BuilderSubmissionData>({
    name: "",
    tagline: "",
    description: "",
    thumbnailUrl: "",
    bannerUrl: "",
    discordUrl: "",
    twitterUrl: "",
    youtubeUrl: "",
    websiteUrl: "",
  });

  const [portfolioItems, setPortfolioItems] = useState<PortfolioItemInput[]>([]);
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [newVideoTitle, setNewVideoTitle] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (file: File) => {
    return await uploadImage(file, "builders");
  };

  const handleThumbnailChange = (url: string | null) => {
    setFormData((prev) => ({ ...prev, thumbnailUrl: url || "" }));
  };

  const handleBannerChange = (url: string | null) => {
    setFormData((prev) => ({ ...prev, bannerUrl: url || "" }));
  };

  // Portfolio image upload
  const handlePortfolioImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPortfolioImage(true);
    try {
      const result = await uploadImage(file, "builders");
      if (result.success && result.url) {
        const uploadedUrl = result.url; // Capture for TypeScript narrowing
        setPortfolioItems((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            type: "image" as const,
            url: uploadedUrl,
            title: "",
            description: "",
          },
        ]);
      } else {
        setError(result.error || "Failed to upload image");
      }
    } catch {
      setError("Failed to upload image");
    } finally {
      setIsUploadingPortfolioImage(false);
      // Reset the input
      e.target.value = "";
    }
  };

  // Add YouTube video
  const handleAddVideo = () => {
    if (!newVideoUrl) return;

    // Validate YouTube URL
    const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    if (!youtubeRegex.test(newVideoUrl)) {
      setError("Please enter a valid YouTube URL");
      return;
    }

    setPortfolioItems((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: "video",
        url: newVideoUrl,
        title: newVideoTitle,
        description: "",
      },
    ]);
    setNewVideoUrl("");
    setNewVideoTitle("");
    setError(null);
  };

  // Remove portfolio item
  const handleRemovePortfolioItem = (id: string) => {
    setPortfolioItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Update portfolio item title
  const handleUpdatePortfolioTitle = (id: string, title: string) => {
    setPortfolioItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, title } : item))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await submitBuilder(formData, portfolioItems.map((item, index) => ({
        type: item.type,
        url: item.url,
        title: item.title || undefined,
        description: item.description || undefined,
        displayOrder: index,
      })));

      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/builders");
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

  // Extract YouTube thumbnail
  const getYouTubeThumbnail = (url: string) => {
    if (!url) return null;
    
    const patterns = [
      /(?:youtube\.com\/watch\?v=)([^&\n?#]+)/,
      /(?:youtu\.be\/)([^&\n?#]+)/,
      /(?:youtube\.com\/embed\/)([^&\n?#]+)/,
      /(?:youtube\.com\/v\/)([^&\n?#]+)/,
      /(?:youtube\.com\/shorts\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/,
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`;
      }
    }
    return null;
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
            You need to sign in to create a builder profile on Mytale.
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
            Profile Submitted!
          </h2>
          <p className="text-foreground-muted mb-4">
            Your builder profile has been submitted for review. We&apos;ll notify you once it&apos;s approved.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/builders"
            className="inline-flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Builders
          </Link>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-2">
            Create Your <span className="gradient-text">Builder Profile</span>
          </h1>
          <p className="text-foreground-muted">
            Showcase your building skills and connect with the Hytale community
          </p>
        </div>

        {/* Form */}
        <Card className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Thumbnail Image */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Profile Thumbnail
              </label>
              <ImageUpload
                value={formData.thumbnailUrl}
                onChange={handleThumbnailChange}
                onUpload={handleImageUpload}
              />
              <p className="text-xs text-foreground-muted mt-2">
                Recommended: 1280×720 pixels (16:9 ratio). Max 5MB.
              </p>
            </div>

            {/* Banner Image */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Banner Image (Optional)
              </label>
              <ImageUpload
                value={formData.bannerUrl}
                onChange={handleBannerChange}
                onUpload={handleImageUpload}
              />
              <p className="text-xs text-foreground-muted mt-2">
                A wide banner image for your profile header. Max 5MB.
              </p>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Builder Name *
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Builder Name"
                required
              />
            </div>

            {/* Tagline */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tagline
              </label>
              <Input
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                placeholder="A short description of your building style"
              />
              <p className="text-xs text-foreground-muted mt-1">
                A brief one-liner that describes your building style
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                About You
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell us about your building experience, specialties, and what you love to build in Hytale..."
                rows={6}
                className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Portfolio Section */}
            <div className="border-t border-border pt-6">
              <h3 className="text-lg font-display font-bold text-foreground mb-2">
                Portfolio
              </h3>
              <p className="text-sm text-foreground-muted mb-4">
                Add images and YouTube videos to showcase your work. You can add more after your profile is approved.
              </p>

              {/* Current Portfolio Items */}
              {portfolioItems.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                  {portfolioItems.map((item) => (
                    <div
                      key={item.id}
                      className="relative group rounded-lg overflow-hidden border border-border bg-surface-elevated"
                    >
                      <div className="aspect-video relative">
                        {item.type === "video" ? (
                          <>
                            {getYouTubeThumbnail(item.url) ? (
                              <Image
                                src={getYouTubeThumbnail(item.url)!}
                                alt={item.title || "Video thumbnail"}
                                fill
                                unoptimized
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-surface">
                                <Youtube className="w-8 h-8 text-red-500" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <Youtube className="w-8 h-8 text-white" />
                            </div>
                          </>
                        ) : (
                          <Image
                            src={item.url}
                            alt={item.title || "Portfolio image"}
                            fill
                            className="object-cover"
                          />
                        )}
                        {/* Remove button */}
                        <button
                          type="button"
                          onClick={() => handleRemovePortfolioItem(item.id)}
                          className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      {/* Title input */}
                      <div className="p-2">
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handleUpdatePortfolioTitle(item.id, e.target.value)}
                          placeholder="Title (optional)"
                          className="w-full px-2 py-1 text-xs bg-surface border border-border rounded text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-1 focus:ring-primary-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Portfolio Items */}
              <div className="space-y-4">
                {/* Add Image */}
                <div className="flex items-center gap-4">
                  <label className="flex-1">
                    <div className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary-500/50 hover:bg-primary-500/5 transition-colors">
                      {isUploadingPortfolioImage ? (
                        <Loader2 className="w-5 h-5 animate-spin text-primary-400" />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-foreground-muted" />
                      )}
                      <span className="text-sm text-foreground-muted">
                        {isUploadingPortfolioImage ? "Uploading..." : "Add Image"}
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePortfolioImageUpload}
                      className="hidden"
                      disabled={isUploadingPortfolioImage}
                    />
                  </label>
                </div>

                {/* Add YouTube Video */}
                <div className="p-4 border border-border rounded-lg bg-surface-elevated">
                  <div className="flex items-center gap-2 mb-3">
                    <Youtube className="w-5 h-5 text-red-500" />
                    <span className="text-sm font-medium text-foreground">Add YouTube Video</span>
                  </div>
                  <div className="space-y-3">
                    <Input
                      value={newVideoUrl}
                      onChange={(e) => setNewVideoUrl(e.target.value)}
                      placeholder="https://youtube.com/watch?v=... (unlisted videos work too!)"
                    />
                    <Input
                      value={newVideoTitle}
                      onChange={(e) => setNewVideoTitle(e.target.value)}
                      placeholder="Video title (optional)"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddVideo}
                      disabled={!newVideoUrl}
                    >
                      <Plus className="w-4 h-4" />
                      Add Video
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="border-t border-border pt-6">
              <h3 className="text-lg font-display font-bold text-foreground mb-4">
                Social Links (Optional)
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Discord URL
                  </label>
                  <Input
                    name="discordUrl"
                    value={formData.discordUrl}
                    onChange={handleChange}
                    placeholder="https://discord.gg/your-server"
                    type="url"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Twitter/X URL
                  </label>
                  <Input
                    name="twitterUrl"
                    value={formData.twitterUrl}
                    onChange={handleChange}
                    placeholder="https://twitter.com/yourusername"
                    type="url"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    YouTube Channel URL
                  </label>
                  <Input
                    name="youtubeUrl"
                    value={formData.youtubeUrl}
                    onChange={handleChange}
                    placeholder="https://youtube.com/@yourchannel"
                    type="url"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Website URL
                  </label>
                  <Input
                    name="websiteUrl"
                    value={formData.websiteUrl}
                    onChange={handleChange}
                    placeholder="https://yourwebsite.com"
                    type="url"
                  />
                </div>
              </div>
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
                    Submit Profile
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
