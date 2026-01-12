"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { ArrowLeft, Save, Loader2, Plus, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button, Card, Input, Badge, ImageUpload } from "@/components/ui";
import { updateMod, addModVersion } from "@/lib/supabase/actions";
import { uploadImage } from "@/lib/supabase/storage";
import type { ModUpdateData, NewVersionData } from "@/lib/supabase/actions";

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

interface ModData {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  category: string;
  mod_type: string;
  tags: string[];
  thumbnail_url: string | null;
  support_url: string | null;
  profiles: {
    clerk_id: string;
  } | null;
}

export default function EditModPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const { userId, isLoaded } = useAuth();
  
  const [mod, setMod] = useState<ModData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingVersion, setIsAddingVersion] = useState(false);
  const [showVersionForm, setShowVersionForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<ModUpdateData>({
    name: "",
    tagline: "",
    description: "",
    category: "Gameplay",
    modType: "mod",
    tags: "",
    thumbnailUrl: "",
    supportUrl: "",
  });

  const [versionData, setVersionData] = useState<NewVersionData>({
    versionNumber: "",
    gameVersion: "",
    downloadUrl: "",
    changelog: "",
  });

  // Fetch mod data
  useEffect(() => {
    async function fetchMod() {
      try {
        const response = await fetch(`/api/mods/${slug}`);
        if (!response.ok) {
          throw new Error("Failed to fetch mod");
        }
        const data = await response.json();
        setMod(data);
        setFormData({
          name: data.name,
          tagline: data.tagline || "",
          description: data.description || "",
          category: data.category,
          modType: data.mod_type,
          tags: data.tags.join(", "),
          thumbnailUrl: data.thumbnail_url || "",
          supportUrl: data.support_url || "",
        });
      } catch (err) {
        console.error("Error fetching mod:", err);
        setError("Failed to load mod data");
      } finally {
        setIsLoading(false);
      }
    }

    if (slug) {
      fetchMod();
    }
  }, [slug]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVersionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setVersionData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (file: File) => {
    return await uploadImage(file, "mods");
  };

  const handleImageChange = (url: string | null) => {
    setFormData((prev) => ({ ...prev, thumbnailUrl: url || "" }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mod) return;

    setError(null);
    setSuccess(null);
    setIsSaving(true);

    try {
      const result = await updateMod(mod.id, formData);

      if (result.success) {
        setSuccess("Mod updated successfully!");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.error || "Failed to update mod");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddVersion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mod) return;

    setError(null);
    setIsAddingVersion(true);

    try {
      const result = await addModVersion(mod.id, versionData);

      if (result.success) {
        setSuccess("New version added successfully!");
        setVersionData({
          versionNumber: "",
          gameVersion: "",
          downloadUrl: "",
          changelog: "",
        });
        setShowVersionForm(false);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.error || "Failed to add version");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsAddingVersion(false);
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
  if (!mod) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <h2 className="text-2xl font-display font-bold text-foreground mb-4">
            Mod Not Found
          </h2>
          <p className="text-foreground-muted mb-6">
            This mod doesn&apos;t exist or has been removed.
          </p>
          <Link href="/mods">
            <Button>Back to Mods</Button>
          </Link>
        </Card>
      </div>
    );
  }

  // Check ownership
  if (mod.profiles?.clerk_id !== userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <h2 className="text-2xl font-display font-bold text-foreground mb-4">
            Access Denied
          </h2>
          <p className="text-foreground-muted mb-6">
            You don&apos;t have permission to edit this mod.
          </p>
          <Link href={`/mods/${slug}`}>
            <Button>View Mod</Button>
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
            href={`/mods/${slug}`}
            className="inline-flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Mod
          </Link>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-2">
            Edit <span className="gradient-text">{mod.name}</span>
          </h1>
          <p className="text-foreground-muted">
            Update your mod&apos;s information
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

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Type *
                </label>
                <select
                  name="modType"
                  value={formData.modType}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                placeholder="Describe your mod in detail..."
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

        {/* Add New Version Section */}
        <Card className="p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display font-bold text-foreground">
              Release New Version
            </h2>
            {!showVersionForm && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowVersionForm(true)}
              >
                <Plus className="w-4 h-4" />
                Add Version
              </Button>
            )}
          </div>

          {showVersionForm ? (
            <form onSubmit={handleAddVersion} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Version Number *
                  </label>
                  <Input
                    name="versionNumber"
                    value={versionData.versionNumber}
                    onChange={handleVersionChange}
                    placeholder="1.1.0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Hytale Version *
                  </label>
                  <Input
                    name="gameVersion"
                    value={versionData.gameVersion}
                    onChange={handleVersionChange}
                    placeholder="1.0"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Download URL *
                </label>
                <Input
                  name="downloadUrl"
                  value={versionData.downloadUrl}
                  onChange={handleVersionChange}
                  placeholder="https://github.com/..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Changelog
                </label>
                <textarea
                  name="changelog"
                  value={versionData.changelog}
                  onChange={handleVersionChange}
                  placeholder="What's new in this version?"
                  rows={3}
                  className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowVersionForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isAddingVersion} className="flex-1">
                  {isAddingVersion ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Release Version
                    </>
                  )}
                </Button>
              </div>
            </form>
          ) : (
            <p className="text-foreground-muted text-sm">
              Add a new version when you have updates to your mod. Each version is stored
              in the version history so users can access older versions if needed.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}

