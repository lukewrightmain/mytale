"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { ArrowLeft, Server, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button, Card, Input, Badge, ImageUpload } from "@/components/ui";
import { submitServer, type ServerSubmissionData } from "@/lib/supabase/actions";
import { uploadImage } from "@/lib/supabase/storage";

const REGIONS = [
  { value: "NA", label: "🇺🇸 North America" },
  { value: "EU", label: "🇪🇺 Europe" },
  { value: "AS", label: "🌏 Asia" },
  { value: "SA", label: "🇧🇷 South America" },
  { value: "OC", label: "🇦🇺 Oceania" },
];

const GAME_MODE_SUGGESTIONS = [
  "Survival",
  "Creative",
  "PvP",
  "Minigames",
  "Roleplay",
  "Adventure",
  "Economy",
  "Factions",
];

export default function SubmitServerPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<ServerSubmissionData>({
    name: "",
    description: "",
    ipAddress: "",
    port: "5520",
    region: "NA",
    gameModes: "",
    discordUrl: "",
    websiteUrl: "",
    bannerUrl: "",
    bannerStripUrl: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (file: File) => {
    return await uploadImage(file, "servers");
  };

  const handleImageChange = (url: string | null) => {
    setFormData((prev) => ({ ...prev, bannerUrl: url || "" }));
  };

  const handleBannerStripChange = (url: string | null) => {
    setFormData((prev) => ({ ...prev, bannerStripUrl: url || "" }));
  };

  const addGameMode = (mode: string) => {
    const currentModes = formData.gameModes
      .split(",")
      .map((m) => m.trim())
      .filter((m) => m.length > 0);

    if (!currentModes.includes(mode)) {
      const newModes = [...currentModes, mode].join(", ");
      setFormData((prev) => ({ ...prev, gameModes: newModes }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await submitServer(formData);

      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/servers");
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
            You need to sign in to list a server on Mytale.
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
            Server Submitted!
          </h2>
          <p className="text-foreground-muted mb-4">
            Your server has been submitted for review. We&apos;ll verify it and make it live soon.
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
            href="/servers"
            className="inline-flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Servers
          </Link>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-2">
            List Your <span className="gradient-text">Server</span>
          </h1>
          <p className="text-foreground-muted">
            Get your server discovered by thousands of Hytale players
          </p>
        </div>

        {/* Form */}
        <Card className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Banner Image */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Banner Image
              </label>
              <ImageUpload
                value={formData.bannerUrl}
                onChange={handleImageChange}
                onUpload={handleImageUpload}
              />
              <p className="text-xs text-foreground-muted mt-2">
                Recommended: 1280×720 pixels (16:9 ratio). Max 5MB.
              </p>
            </div>

            {/* Banner Strip */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Banner Strip <Badge variant="outline" size="sm" className="ml-2">Optional</Badge>
              </label>
              <div className="p-4 bg-surface-elevated border border-border rounded-lg mb-3">
                <p className="text-sm text-foreground-muted mb-2">
                  <strong className="text-foreground">What&apos;s a Banner Strip?</strong>
                </p>
                <p className="text-xs text-foreground-muted mb-3">
                  A banner strip is a classic server listing banner (468×60 pixels) displayed in the &quot;Banners&quot; view. 
                  It&apos;s the traditional Minecraft server list style — a horizontal strip that shows your server branding at a glance.
                  <strong className="text-primary-400"> GIFs are supported!</strong>
                </p>
                <div className="bg-stone-900 border border-stone-700 rounded p-2 text-center">
                  <div className="inline-block bg-stone-800 border border-dashed border-stone-600 text-stone-500 text-xs px-8 py-3 rounded">
                    468 × 60 pixels (example size)
                  </div>
                </div>
              </div>
              <ImageUpload
                value={formData.bannerStripUrl}
                onChange={handleBannerStripChange}
                onUpload={handleImageUpload}
                aspectRatio="468/60"
                allowGif={true}
              />
              <p className="text-xs text-foreground-muted mt-2">
                Recommended: 468×60 pixels. Supports PNG, JPG, GIF (animated). Max 5MB.
              </p>
            </div>

            {/* Server Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Server Name *
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="My Awesome Server"
                required
              />
            </div>

            {/* IP Address & Port */}
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  IP Address *
                </label>
                <Input
                  name="ipAddress"
                  value={formData.ipAddress}
                  onChange={handleChange}
                  placeholder="play.myserver.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Port
                </label>
                <Input
                  name="port"
                  value={formData.port}
                  onChange={handleChange}
                  placeholder="5520"
                />
              </div>
            </div>

            {/* Region */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Region *
              </label>
              <select
                name="region"
                value={formData.region}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                {REGIONS.map((region) => (
                  <option key={region.value} value={region.value}>
                    {region.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Game Modes */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Game Modes *
              </label>
              <Input
                name="gameModes"
                value={formData.gameModes}
                onChange={handleChange}
                placeholder="Survival, PvP, Minigames"
                required
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {GAME_MODE_SUGGESTIONS.map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => addGameMode(mode)}
                    className="px-2 py-1 text-xs bg-surface-elevated border border-border rounded hover:border-primary-500/50 transition-colors text-foreground-muted hover:text-foreground"
                  >
                    + {mode}
                  </button>
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
                placeholder="Tell players what makes your server special. What can they expect when they join?"
                rows={4}
                className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                required
              />
            </div>

            {/* Optional Links */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-foreground">
                Optional Links
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-foreground-muted mb-1">
                    Discord
                  </label>
                  <Input
                    name="discordUrl"
                    value={formData.discordUrl}
                    onChange={handleChange}
                    placeholder="https://discord.gg/..."
                  />
                </div>
                <div>
                  <label className="block text-xs text-foreground-muted mb-1">
                    Website
                  </label>
                  <Input
                    name="websiteUrl"
                    value={formData.websiteUrl}
                    onChange={handleChange}
                    placeholder="https://..."
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
                    <Server className="w-4 h-4" />
                    List Server
                  </>
                )}
              </Button>
            </div>

            <p className="text-xs text-foreground-muted text-center">
              By submitting, you confirm that you own or operate this server.
              All submissions are verified before being listed.
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}
