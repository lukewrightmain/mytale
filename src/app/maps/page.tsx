import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Upload } from "lucide-react";
import { getMaps } from "@/lib/supabase/queries";
import { MapsContent } from "./MapsContent";
import { Button } from "@/components/ui";
import { SITE_URL, SEO_KEYWORDS, PAGE_DESCRIPTIONS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Hytale Maps - Download Custom Maps & Worlds",
  description: PAGE_DESCRIPTIONS.maps,
  keywords: SEO_KEYWORDS.maps,
  openGraph: {
    title: "Hytale Maps - Download Custom Maps & Worlds | Mytale",
    description: PAGE_DESCRIPTIONS.maps,
    url: `${SITE_URL}/maps`,
    type: "website",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "Mytale - Hytale Maps" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hytale Maps - Download Custom Maps & Worlds | Mytale",
    description: PAGE_DESCRIPTIONS.maps,
    images: ["/images/og-image.png"],
  },
  alternates: {
    canonical: `${SITE_URL}/maps`,
  },
};

export const revalidate = 60;

export default async function MapsPage() {
  const maps = await getMaps({ limit: 100 });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero/Hero3.png"
            alt="Maps"
            fill
            className="object-cover object-center opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-4">
            Hytale <span className="gradient-text">Maps</span>
          </h1>
          <p className="text-xl text-foreground-muted max-w-2xl mx-auto mb-6">
            Explore custom worlds, adventure maps, parkour challenges, and more 
            created by the community.
          </p>
          <Link href="/maps/submit">
            <Button size="lg">
              <Upload className="w-5 h-5" />
              Upload a Map
            </Button>
          </Link>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<div className="animate-pulse h-96 bg-surface rounded-xl" />}>
            <MapsContent initialMaps={maps} />
          </Suspense>
        </div>
      </section>
    </div>
  );
}

