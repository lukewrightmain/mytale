import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Upload } from "lucide-react";
import { getBuilders } from "@/lib/supabase/queries";
import { BuildersContent } from "./BuildersContent";
import { Button } from "@/components/ui";
import { SITE_URL, SEO_KEYWORDS, PAGE_DESCRIPTIONS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Hytale Builders - Find Talented Builders & Portfolios",
  description: PAGE_DESCRIPTIONS.builders || "Browse talented Hytale builders and their portfolios. Find builders for your projects, view their work, and connect with the community.",
  keywords: SEO_KEYWORDS.builders || ["Hytale builders", "Hytale building", "Hytale portfolios", "Hytale construction"],
  openGraph: {
    title: "Hytale Builders - Find Talented Builders & Portfolios | Mytale",
    description: PAGE_DESCRIPTIONS.builders || "Browse talented Hytale builders and their portfolios.",
    url: `${SITE_URL}/builders`,
    type: "website",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "Mytale - Hytale Builders" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hytale Builders - Find Talented Builders & Portfolios | Mytale",
    description: PAGE_DESCRIPTIONS.builders || "Browse talented Hytale builders and their portfolios.",
    images: ["/images/og-image.png"],
  },
  alternates: {
    canonical: `${SITE_URL}/builders`,
  },
};

export const revalidate = 60; // Revalidate every 60 seconds

export default async function BuildersPage() {
  // Fetch all approved builders on the server
  const builders = await getBuilders({ limit: 100 });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero/Hero3.png"
            alt="Builders"
            fill
            className="object-cover object-center opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-4">
            Builder <span className="gradient-text">Profiles</span>
          </h1>
          <p className="text-xl text-foreground-muted max-w-2xl mx-auto mb-6">
            Showcase your building skills and connect with the Hytale community. 
            Browse talented builders and their amazing creations.
          </p>
          <Link href="/builders/submit">
            <Button size="lg">
              <Upload className="w-5 h-5" />
              Create Your Profile
            </Button>
          </Link>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<div className="animate-pulse h-96 bg-surface rounded-xl" />}>
            <BuildersContent initialBuilders={builders} />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
