"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { ArrowLeft, Save, Loader2, Plus, X, Trash2, Youtube, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { Button, Card, Input, ImageUpload } from "@/components/ui";
import { updateBuilder, addPortfolioItem, deletePortfolioItem, type BuilderSubmissionData, type PortfolioItemData } from "@/lib/supabase/actions";
import { uploadImage } from "@/lib/supabase/storage";

interface BuilderData {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  thumbnail_url: string | null;
  banner_url: string | null;
  discord_url: string | null;
  twitter_url: string | null;
  youtube_url: string | null;
  website_url: string | null;
  portfolio_items: Array<{
    id: string;
    type: "image" | "video";
    url: string;
    thumbnail_url: string | null;
    title: string | null;
    description: string | null;
    display_order: number;
  }>;
}

export default function EditBuilderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const { userId, isLoaded } = useAuth();
  
  const [builder, setBuilder] = useState<BuilderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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

  const [newItem, setNewItem] = useState<PortfolioItemData>({
    type: "image",
    url: "",
    thumbnailUrl: "",
    title: "",
    description: "",
    displayOrder: 0,
  });

  // Fetch builder data
  useEffect(() => {
    async function fetchBuilder() {
      try {
        const response = await fetch(`/api/builders/${slug}`);
        if (!response.ok) {
          throw new Error("Failed to fetch builder");
        }
        const data = await response.json();
        setBuilder(data);
        setFormData({
          name: data.name,
          tagline: data.tagline || "",
          description: data.description || "",
          thumbnailUrl: data.thumbnail_url || "",
          bannerUrl: data.banner_url || "",
          discordUrl: data.discord_url || "",
          twitterUrl: data.twitter_url || "",
          youtubeUrl: data.youtube_url || "",
          websiteUrl: data.website_url || "",
        });
      } catch (err) {
        console.error("Error fetching builder:", err);
        setError("Failed to load builder profile");
      } finally {
        setIsLoading(false);
      }
    }

    if (isLoaded && userId) {
      fetchBuilder();
    }
  }, [slug, isLoaded, userId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSaving(true);

    try {
      if (!builder) return;
      
      const result = await updateBuilder(builder.id, formData);

      if (result.success) {
        setSuccess("Profile updated successfully!");
        setTimeout(() => {
          router.push(`/builders/${slug}`);
        }, 1500);
      } else {
        setError(result.error || "Failed to update profile");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddItem = async () => {
    if (!builder || !newItem.url) {
      setError("Please provide a URL for the portfolio item");
      return;
    }

    setIsAddingItem(true);
    setError(null);

    try {
      const result = await addPortfolioItem(builder.id, {
        ...newItem,
        displayOrder: builder.portfolio_items?.length || 0,
      });

      if (result.success) {
        // Refresh builder data
        const response = await fetch(`/api/builders/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setBuilder(data);
        }
        setNewItem({
          type: "image",
          url: "",
          thumbnailUrl: "",
          title: "",
          description: "",
          displayOrder: 0,
        });
        setSuccess("Portfolio item added!");
      } else {
        setError(result.error || "Failed to add portfolio item");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsAddingItem(false);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!builder) return;
    if (!confirm("Are you sure you want to delete this portfolio item?")) return;

    try {
      const result = await deletePortfolioItem(itemId, builder.id);

      if (result.success) {
        // Refresh builder data
        const response = await fetch(`/api/builders/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setBuilder(data);
        }
        setSuccess("Portfolio item deleted!");
      } else {
        setError(result.error || "Failed to delete portfolio item");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    }
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-400" />
      </div>
    );
  }

  if (!builder) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <h2 className="text-2xl font-display font-bold text-foreground mb-4">
            Builder Not Found
          </h2>
          <Link href="/builders">
            <Button>Back to Builders</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/builders/${slug}`}
            className="inline-flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </Link>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-2">
            Edit <span className="gradient-text">Builder Profile</span>
          </h1>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Profile Form */}
        <Card className="p-6 sm:p-8 mb-8">
          <h2 className="text-xl font-display font-bold text-foreground mb-6">
            Profile Information
          </h2>
          <form onSubmit={handleSave} className="space-y-6">
            {/* Thumbnail */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Profile Thumbnail
              </label>
              <ImageUpload
                value={formData.thumbnailUrl}
                onChange={handleThumbnailChange}
                onUpload={handleImageUpload}
              />
            </div>

            {/* Banner */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Banner Image
              </label>
              <ImageUpload
                value={formData.bannerUrl}
                onChange={handleBannerChange}
                onUpload={handleImageUpload}
              />
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
              />
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
                rows={6}
                className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Discord URL
                </label>
                <Input
                  name="discordUrl"
                  value={formData.discordUrl}
                  onChange={handleChange}
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
                  type="url"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  YouTube URL
                </label>
                <Input
                  name="youtubeUrl"
                  value={formData.youtubeUrl}
                  onChange={handleChange}
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
                  type="url"
                />
              </div>
            </div>

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

        {/* Portfolio Items */}
        <Card className="p-6 sm:p-8">
          <h2 className="text-xl font-display font-bold text-foreground mb-6">
            Portfolio Items
          </h2>

          {/* Add New Item Form */}
          <div className="border border-border rounded-lg p-4 mb-6 bg-surface-elevated">
            <h3 className="text-lg font-display font-semibold text-foreground mb-4">
              Add Portfolio Item
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Type *
                </label>
                <select
                  name="type"
                  value={newItem.type}
                  onChange={handleItemChange}
                  className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="image">Image</option>
                  <option value="video">Video (YouTube URL)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {newItem.type === "video" ? "YouTube URL *" : "Image URL *"}
                </label>
                <Input
                  name="url"
                  value={newItem.url}
                  onChange={handleItemChange}
                  placeholder={newItem.type === "video" ? "https://youtube.com/watch?v=..." : "Image URL"}
                  required
                />
                {newItem.type === "video" && (
                  <p className="text-xs text-foreground-muted mt-1">
                    Paste the full YouTube video URL. We&apos;ll embed it automatically.
                  </p>
                )}
              </div>

              {newItem.type === "video" && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Thumbnail URL (Optional)
                  </label>
                  <Input
                    name="thumbnailUrl"
                    value={newItem.thumbnailUrl}
                    onChange={handleItemChange}
                    placeholder="Custom thumbnail URL"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Title (Optional)
                </label>
                <Input
                  name="title"
                  value={newItem.title}
                  onChange={handleItemChange}
                  placeholder="Item title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description (Optional)
                </label>
                <textarea
                  name="description"
                  value={newItem.description}
                  onChange={handleItemChange}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  placeholder="Describe this portfolio item..."
                />
              </div>

              <Button
                type="button"
                onClick={handleAddItem}
                disabled={isAddingItem || !newItem.url}
              >
                {isAddingItem ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Add Item
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Existing Items */}
          {builder.portfolio_items && builder.portfolio_items.length > 0 ? (
            <div className="space-y-4">
              {builder.portfolio_items.map((item) => (
                <div
                  key={item.id}
                  className="border border-border rounded-lg p-4 bg-surface-elevated"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {item.type === "video" ? (
                        <Youtube className="w-5 h-5 text-red-400" />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-primary-400" />
                      )}
                      <span className="font-medium text-foreground">
                        {item.title || `Portfolio ${item.type}`}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  {item.description && (
                    <p className="text-sm text-foreground-muted mb-2">
                      {item.description}
                    </p>
                  )}
                  <p className="text-xs text-foreground-subtle break-all">
                    {item.url}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-foreground-muted text-center py-8">
              No portfolio items yet. Add your first one above!
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
