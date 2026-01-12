"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { ArrowLeft, Save, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button, Card, Input, Badge, ImageUpload } from "@/components/ui";
import { updateServer } from "@/lib/supabase/actions";
import { uploadImage } from "@/lib/supabase/storage";
import type { ServerUpdateData } from "@/lib/supabase/actions";

const REGIONS = [
  { value: "NA", label: "North America" },
  { value: "EU", label: "Europe" },
  { value: "AS", label: "Asia" },
  { value: "SA", label: "South America" },
  { value: "OC", label: "Oceania" },
  { value: "AF", label: "Africa" },
];

const GAME_MODES = [
  "Survival",
  "Creative",
  "Adventure",
  "PvP",
  "Minigames",
  "RPG",
  "Factions",
  "Economy",
  "Building",
  "Parkour",
];

interface ServerData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  ip_address: string;
  port: number;
  region: string;
  game_modes: string[];
  discord_url: string | null;
  website_url: string | null;
  banner_url: string | null;
  profiles: {
    clerk_id: string;
  } | null;
}

export default function EditServerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const { userId, isLoaded } = useAuth();
  
  const [server, setServer] = useState<ServerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<ServerUpdateData>({
    name: "",
    description: "",
    ipAddress: "",
    port: "25565",
    region: "NA",
    gameModes: "",
    discordUrl: "",
    websiteUrl: "",
    bannerUrl: "",
  });

  // Fetch server data
  useEffect(() => {
    async function fetchServer() {
      try {
        const response = await fetch(`/api/servers/${slug}`);
        if (!response.ok) {
          throw new Error("Failed to fetch server");
        }
        const data = await response.json();
        setServer(data);
        setFormData({
          name: data.name,
          description: data.description || "",
          ipAddress: data.ip_address,
          port: data.port.toString(),
          region: data.region,
          gameModes: data.game_modes.join(", "),
          discordUrl: data.discord_url || "",
          websiteUrl: data.website_url || "",
          bannerUrl: data.banner_url || "",
        });
      } catch (err) {
        console.error("Error fetching server:", err);
        setError("Failed to load server data");
      } finally {
        setIsLoading(false);
      }
    }

    if (slug) {
      fetchServer();
    }
  }, [slug]);

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

  const handleGameModeToggle = (mode: string) => {
    setFormData((prev) => {
      const currentModes = prev.gameModes
        ? prev.gameModes.split(",").map((m) => m.trim()).filter(Boolean)
        : [];
      if (currentModes.includes(mode)) {
        return { ...prev, gameModes: currentModes.filter((m) => m !== mode).join(", ") };
      } else {
        return { ...prev, gameModes: [...currentModes, mode].join(", ") };
      }
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!server) return;

    setError(null);
    setSuccess(null);
    setIsSaving(true);

    try {
      const result = await updateServer(server.id, formData);

      if (result.success) {
        setSuccess("Server updated successfully!");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.error || "Failed to update server");
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

  // Not found
  if (!server) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <h2 className="text-2xl font-display font-bold text-foreground mb-4">
            Server Not Found
          </h2>
          <p className="text-foreground-muted mb-6">
            This server doesn&apos;t exist or has been removed.
          </p>
          <Link href="/servers">
            <Button>Back to Servers</Button>
          </Link>
        </Card>
      </div>
    );
  }

  // Check ownership
  if (server.profiles?.clerk_id !== userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <h2 className="text-2xl font-display font-bold text-foreground mb-4">
            Access Denied
          </h2>
          <p className="text-foreground-muted mb-6">
            You don&apos;t have permission to edit this server.
          </p>
          <Link href={`/servers/${slug}`}>
            <Button>View Server</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const selectedModes = formData.gameModes
    ? formData.gameModes.split(",").map((m) => m.trim()).filter(Boolean)
    : [];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/servers/${slug}`}
            className="inline-flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Server
          </Link>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-2">
            Edit <span className="gradient-text">{server.name}</span>
          </h1>
          <p className="text-foreground-muted">
            Update your server&apos;s information
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
        <Card className="p-6 sm:p-8">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Banner Image */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Server Banner
              </label>
              <ImageUpload
                value={formData.bannerUrl || undefined}
                onChange={handleImageChange}
                onUpload={handleImageUpload}
              />
            </div>

            {/* Name */}
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

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your server..."
                rows={4}
                className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                required
              />
            </div>

            {/* IP & Port */}
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
                  placeholder="25565"
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
                className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                Game Modes
              </label>
              <div className="flex flex-wrap gap-2">
                {GAME_MODES.map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => handleGameModeToggle(mode)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      selectedModes.includes(mode)
                        ? "bg-primary-500 text-stone-900"
                        : "bg-surface border border-border text-foreground-muted hover:border-primary-500/50"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Discord & Website */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Discord URL
                </label>
                <Input
                  name="discordUrl"
                  value={formData.discordUrl}
                  onChange={handleChange}
                  placeholder="https://discord.gg/..."
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
                  placeholder="https://myserver.com"
                />
              </div>
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

