"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { 
  ArrowLeft, Video, Image as ImageIcon, Globe, Clock, Calendar,
  Plus, Trash2, Loader2, AlertCircle
} from "lucide-react";
import { Button, Card, Input } from "@/components/ui";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { updateContentCreator } from "@/lib/supabase/actions";

// Platform options
const PLATFORMS = [
  { value: "twitch", label: "Twitch", icon: "🟣" },
  { value: "youtube", label: "YouTube", icon: "🔴" },
  { value: "tiktok", label: "TikTok", icon: "🎵" },
  { value: "kick", label: "Kick", icon: "🟢" },
  { value: "other", label: "Other", icon: "📺" },
];

// Language options
const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "pt", label: "Portuguese" },
  { value: "ru", label: "Russian" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "zh", label: "Chinese" },
  { value: "pl", label: "Polish" },
  { value: "it", label: "Italian" },
  { value: "nl", label: "Dutch" },
  { value: "tr", label: "Turkish" },
  { value: "ar", label: "Arabic" },
  { value: "hi", label: "Hindi" },
];

// Common timezones
const TIMEZONES = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "America/Sao_Paulo", label: "Brasilia Time (BRT)" },
  { value: "Europe/London", label: "London (GMT/BST)" },
  { value: "Europe/Paris", label: "Central European (CET)" },
  { value: "Europe/Moscow", label: "Moscow Time (MSK)" },
  { value: "Asia/Dubai", label: "Gulf Time (GST)" },
  { value: "Asia/Kolkata", label: "India (IST)" },
  { value: "Asia/Singapore", label: "Singapore (SGT)" },
  { value: "Asia/Tokyo", label: "Japan (JST)" },
  { value: "Asia/Seoul", label: "Korea (KST)" },
  { value: "Australia/Sydney", label: "Sydney (AEST)" },
  { value: "Pacific/Auckland", label: "New Zealand (NZST)" },
  { value: "UTC", label: "UTC" },
];

const DAYS = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
];

type ScheduleSlot = {
  day: string;
  start: string;
  end: string;
};

interface Props {
  params: Promise<{ slug: string }>;
}

export default function EditCreatorPage({ params }: Props) {
  const { slug } = use(params);
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();

  const [creatorId, setCreatorId] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [primaryPlatform, setPrimaryPlatform] = useState<string>("twitch");
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("UTC");
  
  // Social links
  const [twitchUrl, setTwitchUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [tiktokUrl, setTiktokUrl] = useState("");
  const [discordUrl, setDiscordUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");

  // Schedule
  const [schedule, setSchedule] = useState<ScheduleSlot[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Load existing data
  useEffect(() => {
    async function loadCreator() {
      try {
        const response = await fetch(`/api/creators/${slug}`);
        if (!response.ok) {
          router.push("/creators");
          return;
        }

        const data = await response.json();
        
        setCreatorId(data.id);
        setName(data.name || "");
        setBio(data.bio || "");
        setThumbnailUrl(data.thumbnail_url || "");
        setBannerUrl(data.banner_url || "");
        setPrimaryPlatform(data.primary_platform || "twitch");
        setLanguage(data.language || "en");
        setTimezone(data.timezone || "UTC");
        setTwitchUrl(data.twitch_url || "");
        setYoutubeUrl(data.youtube_url || "");
        setTwitterUrl(data.twitter_url || "");
        setTiktokUrl(data.tiktok_url || "");
        setDiscordUrl(data.discord_url || "");
        setWebsiteUrl(data.website_url || "");
        setSchedule(data.schedule || []);
      } catch (err) {
        console.error("Error loading creator:", err);
        router.push("/creators");
      } finally {
        setIsLoading(false);
      }
    }

    if (isLoaded && isSignedIn) {
      loadCreator();
    } else if (isLoaded && !isSignedIn) {
      router.push("/creators");
    }
  }, [slug, isLoaded, isSignedIn, router]);

  const addScheduleSlot = () => {
    setSchedule([...schedule, { day: "monday", start: "18:00", end: "22:00" }]);
  };

  const removeScheduleSlot = (index: number) => {
    setSchedule(schedule.filter((_, i) => i !== index));
  };

  const updateScheduleSlot = (index: number, field: keyof ScheduleSlot, value: string) => {
    const updated = [...schedule];
    updated[index] = { ...updated[index], [field]: value };
    setSchedule(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Creator/Channel name is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await updateContentCreator(creatorId, {
        name: name.trim(),
        bio: bio.trim() || undefined,
        thumbnailUrl: thumbnailUrl || undefined,
        bannerUrl: bannerUrl || undefined,
        primaryPlatform: primaryPlatform as "twitch" | "youtube" | "tiktok" | "kick" | "other",
        language,
        timezone,
        twitchUrl: twitchUrl || undefined,
        youtubeUrl: youtubeUrl || undefined,
        twitterUrl: twitterUrl || undefined,
        tiktokUrl: tiktokUrl || undefined,
        discordUrl: discordUrl || undefined,
        websiteUrl: websiteUrl || undefined,
        schedule: schedule.length > 0 ? schedule : undefined,
      });

      if (result.success) {
        router.push(`/creators/${slug}`);
      } else {
        setError(result.error || "Failed to update. Please try again.");
      }
    } catch (err) {
      console.error("Error updating creator:", err);
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <Link
          href={`/creators/${slug}`}
          className="inline-flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Profile
        </Link>

        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
            <Video className="w-8 h-8 text-primary-500" />
            Edit Creator Profile
          </h1>
          <p className="text-foreground-muted">
            Update your content creator profile
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <Card className="p-6">
            <h2 className="font-display font-semibold text-lg text-foreground mb-6">
              Basic Information
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Creator/Channel Name *
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your channel or creator name"
                  maxLength={100}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Bio / About
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell viewers about yourself and your content..."
                  className="w-full px-4 py-3 bg-surface-elevated border border-border rounded-lg text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[120px] resize-y"
                  maxLength={2000}
                />
                <p className="text-xs text-foreground-subtle mt-1">
                  {bio.length}/2000 characters
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Primary Platform *
                  </label>
                  <select
                    value={primaryPlatform}
                    onChange={(e) => setPrimaryPlatform(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-elevated border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {PLATFORMS.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.icon} {p.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Language *
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-elevated border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l.value} value={l.value}>
                        {l.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Timezone *
                  </label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-elevated border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {TIMEZONES.map((tz) => (
                      <option key={tz.value} value={tz.value}>
                        {tz.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </Card>

          {/* Images */}
          <Card className="p-6">
            <h2 className="font-display font-semibold text-lg text-foreground mb-6 flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Profile Images
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Profile Picture
                </label>
                <ImageUpload
                  value={thumbnailUrl}
                  onChange={setThumbnailUrl}
                  aspectRatio="square"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Banner Image
                </label>
                <ImageUpload
                  value={bannerUrl}
                  onChange={setBannerUrl}
                  aspectRatio="banner"
                />
              </div>
            </div>
          </Card>

          {/* Social Links */}
          <Card className="p-6">
            <h2 className="font-display font-semibold text-lg text-foreground mb-6 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Social Links
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  🟣 Twitch URL
                </label>
                <Input
                  value={twitchUrl}
                  onChange={(e) => setTwitchUrl(e.target.value)}
                  placeholder="https://twitch.tv/yourchannel"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  🔴 YouTube URL
                </label>
                <Input
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://youtube.com/@yourchannel"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  𝕏 Twitter/X URL
                </label>
                <Input
                  value={twitterUrl}
                  onChange={(e) => setTwitterUrl(e.target.value)}
                  placeholder="https://twitter.com/yourhandle"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  🎵 TikTok URL
                </label>
                <Input
                  value={tiktokUrl}
                  onChange={(e) => setTiktokUrl(e.target.value)}
                  placeholder="https://tiktok.com/@yourhandle"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  💬 Discord URL
                </label>
                <Input
                  value={discordUrl}
                  onChange={(e) => setDiscordUrl(e.target.value)}
                  placeholder="https://discord.gg/yourserver"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  🌐 Website URL
                </label>
                <Input
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </Card>

          {/* Streaming Schedule */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-semibold text-lg text-foreground flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Streaming Schedule
              </h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addScheduleSlot}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Time Slot
              </Button>
            </div>

            {schedule.length === 0 ? (
              <p className="text-foreground-muted text-center py-8">
                No schedule added yet.
              </p>
            ) : (
              <div className="space-y-4">
                {schedule.map((slot, index) => (
                  <div
                    key={index}
                    className="flex flex-wrap items-center gap-4 p-4 bg-surface-elevated rounded-lg"
                  >
                    <select
                      value={slot.day}
                      onChange={(e) => updateScheduleSlot(index, "day", e.target.value)}
                      className="px-3 py-2 bg-surface border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {DAYS.map((d) => (
                        <option key={d.value} value={d.value}>
                          {d.label}
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-foreground-muted" />
                      <input
                        type="time"
                        value={slot.start}
                        onChange={(e) => updateScheduleSlot(index, "start", e.target.value)}
                        className="px-3 py-2 bg-surface border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <span className="text-foreground-muted">to</span>
                      <input
                        type="time"
                        value={slot.end}
                        onChange={(e) => updateScheduleSlot(index, "end", e.target.value)}
                        className="px-3 py-2 bg-surface border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => removeScheduleSlot(index)}
                      className="p-2 text-error-500 hover:bg-error-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-error-500/10 border border-error-500/30 rounded-lg text-error-500 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Link href={`/creators/${slug}`}>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="min-w-[150px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

