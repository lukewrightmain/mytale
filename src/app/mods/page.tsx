import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Upload } from "lucide-react";
import { getMods } from "@/lib/supabase/queries";
import { ModsContent } from "./ModsContent";
import { Button } from "@/components/ui";
import { SITE_URL, SEO_KEYWORDS, PAGE_DESCRIPTIONS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Hytale Mods - Download Free Mods & Addons",
  description: PAGE_DESCRIPTIONS.mods,
  keywords: SEO_KEYWORDS.mods,
  openGraph: {
    title: "Hytale Mods - Download Free Mods & Addons | Mytale",
    description: PAGE_DESCRIPTIONS.mods,
    url: `${SITE_URL}/mods`,
    type: "website",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "Mytale - Hytale Mods" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hytale Mods - Download Free Mods & Addons | Mytale",
    description: PAGE_DESCRIPTIONS.mods,
    images: ["/images/og-image.png"],
  },
  alternates: {
    canonical: `${SITE_URL}/mods`,
  },
};

export const revalidate = 60; // Revalidate every 60 seconds

export default async function ModsPage() {
  // Fetch all approved mods on the server
  const mods = await getMods({ limit: 100 });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero/Hero.png"
            alt="Mods"
            fill
            className="object-cover object-center opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-4">
            Mods & <span className="gradient-text">Plugins</span>
          </h1>
          <p className="text-xl text-foreground-muted max-w-2xl mx-auto mb-6">
            Enhance your Hytale experience with community-created mods, plugins, 
            resource packs, and more.
          </p>
          <Link href="/mods/submit">
            <Button size="lg">
              <Upload className="w-5 h-5" />
              Upload a Mod
            </Button>
          </Link>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<div className="animate-pulse h-96 bg-surface rounded-xl" />}>
            <ModsContent initialMods={mods} />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
