"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { ArrowLeft, Save, Loader2, Plus, CheckCircle, X, Youtube } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button, Card, Input, Badge, ImageUpload } from "@/components/ui";
import { updateMap } from "@/lib/supabase/actions";
import { uploadImage } from "@/lib/supabase/storage";
import type { MapUpdateData } from "@/lib/supabase/actions";

const CATEGORIES = [
  { value: "Adventure", label: "Adventure" },
  { value: "Survival", label: "Survival" },
  { value: "Parkour", label: "Parkour" },
  { value: "PvP", label: "PvP Arena" },
  { value: "Puzzle", label: "Puzzle" },
  { value: "Horror", label: "Horror" },
  { value: "Roleplay", label: "Roleplay" },
  { value: "Creative", label: "Creative Build" },
  { value: "Minigame", label: "Minigame" },
  { value: "Recreation", label: "Recreation" },
];

interface MapData {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  category: string;
  tags: string[];
  thumbnail_url: string | null;
  gallery_images: string[] | null;
  video_url: string | null;
  support_url: string | null;
  profiles: {
    clerk_id: string;
  } | null;
}

export default function EditMapPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const { userId, isLoaded } = useAuth();
  
  const [map, setMap] = useState<MapData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<MapUpdateData>({
    name: "",
    tagline: "",
    description: "",
    category: "Adventure",
    tags: "",
    thumbnailUrl: "",
    galleryImages: [],
    videoUrl: "",
    supportUrl: "",
  });

  // Fetch map data
  useEffect(() => {
    async function fetchMap() {
      try {
        const response = await fetch(`/api/maps/${slug}`);
        if (!response.ok) {
          throw new Error("Failed to fetch map");
        }
        const data = await response.json();
        setMap(data);
        setFormData({
          name: data.name,
          tagline: data.tagline || "",
          description: data.description || "",
          category: data.category,
          tags: data.tags.join(", "),
          thumbnailUrl: data.thumbnail_url || "",
          galleryImages: data.gallery_images || [],
          videoUrl: data.video_url || "",
          supportUrl: data.support_url || "",
        });
      } catch (err) {
        console.error("Error fetching map:", err);
        setError("Failed to load map data");
      } finally {
        setIsLoading(false);
      }
    }

    if (slug) {
      fetchMap();
    }
  }, [slug]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (file: File) => {
    return await uploadImage(file, "maps");
  };

  const handleImageChange = (url: string | null) => {
    setFormData((prev) => ({ ...prev, thumbnailUrl: url || "" }));
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if ((formData.galleryImages?.length || 0) >= 5) {
      return;
    }

    setIsUploadingGallery(true);
    try {
      const result = await uploadImage(file, "maps");
      if (result.success && result.url) {
        setFormData((prev) => ({
          ...prev,
          galleryImages: [...(prev.galleryImages || []), result.url!],
        }));
      }
    } catch (error) {
      console.error("Gallery upload error:", error);
    } finally {
      setIsUploadingGallery(false);
      e.target.value = "";
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages?.filter((_, i) => i !== index) || [],
    }));
  };

  const getYouTubeVideoId = (url: string) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) return match[1];
    }
    return null;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!map) return;

    setError(null);
    setSuccess(null);
    setIsSaving(true);

    try {
      const result = await updateMap(map.id, formData);

      if (result.success) {
        setSuccess("Map updated successfully!");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.error || "Failed to update map");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  // Loading state
  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-400" />
      </div>
    );
  }

  // Not found or not owner
  if (!map) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <h2 className="text-2xl font-display font-bold text-foreground mb-4">
            Map Not Found
          </h2>
          <p className="text-foreground-muted mb-6">
            This map doesn&apos;t exist or has been removed.
          </p>
          <Link href="/maps">
            <Button>Back to Maps</Button>
          </Link>
        </Card>
      </div>
    );
  }

  // Check ownership
  if (map.profiles?.clerk_id !== userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <h2 className="text-2xl font-display font-bold text-foreground mb-4">
            Access Denied
          </h2>
          <p className="text-foreground-muted mb-6">
            You don&apos;t have permission to edit this map.
          </p>
          <Link href={`/maps/${slug}`}>
            <Button>View Map</Button>
          </Link>
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
            href={`/maps/${slug}`}
            className="inline-flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Map
          </Link>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-2">
            Edit <span className="gradient-text">{map.name}</span>
          </h1>
          <p className="text-foreground-muted">
            Update your map&apos;s information
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Main Form */}
        <Card className="p-6 sm:p-8 mb-8">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Thumbnail Image */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Thumbnail Image
              </label>
              <ImageUpload
                value={formData.thumbnailUrl || undefined}
                onChange={handleImageChange}
                onUpload={handleImageUpload}
              />
            </div>

            {/* Gallery Images */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Gallery Images
              </label>
              <p className="text-xs text-foreground-muted mb-3">
                Add up to 5 additional screenshots to showcase your map
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                {formData.galleryImages?.map((url, index) => (
                  <div key={index} className="relative aspect-video rounded-lg overflow-hidden border border-border group">
                    <Image
                      src={url}
                      alt={`Gallery image ${index + 1}`}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                {(formData.galleryImages?.length || 0) < 5 && (
                  <label className="aspect-video rounded-lg border-2 border-dashed border-border hover:border-primary-500/50 cursor-pointer flex flex-col items-center justify-center gap-2 transition-colors">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleGalleryUpload}
                      className="hidden"
                      disabled={isUploadingGallery}
                    />
                    {isUploadingGallery ? (
                      <Loader2 className="w-6 h-6 text-primary-400 animate-spin" />
                    ) : (
                      <>
                        <Plus className="w-6 h-6 text-foreground-muted" />
                        <span className="text-xs text-foreground-muted">Add Image</span>
                      </>
                    )}
                  </label>
                )}
              </div>
              <p className="text-xs text-foreground-muted">
                {formData.galleryImages?.length || 0}/5 images added
              </p>
            </div>

            {/* YouTube Video */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                YouTube Video (Optional)
              </label>
              <Input
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleChange}
                placeholder="https://www.youtube.com/watch?v=..."
              />
              {formData.videoUrl && getYouTubeVideoId(formData.videoUrl) && (
                <div className="mt-3 relative aspect-video rounded-lg overflow-hidden border border-border">
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeVideoId(formData.videoUrl)}`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
              <p className="text-xs text-foreground-muted mt-2">
                <Youtube className="w-3 h-3 inline mr-1" />
                Paste a YouTube video URL to embed a trailer or showcase video
              </p>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Map Name *
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="My Awesome Map"
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
                placeholder="A short description of your map"
                required
              />
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
                className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
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
                placeholder="fantasy, medieval, castle"
              />
              <p className="text-xs text-foreground-muted mt-1">
                Comma-separated tags
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
                placeholder="Describe your map in detail..."
                rows={6}
                className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                required
              />
            </div>

            {/* Support Link */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Support Link (Optional)
              </label>
              <Input
                name="supportUrl"
                value={formData.supportUrl}
                onChange={handleChange}
                placeholder="https://ko-fi.com/yourusername"
              />
            </div>

            {/* Save Button */}
            <Button type="submit" disabled={isSaving} className="w-full">
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

