import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { Lightbulb } from "lucide-react";
import { getIdeas } from "@/lib/supabase/queries";
import { IdeasContent } from "./IdeasContent";
import { Button } from "@/components/ui";

export const revalidate = 30; // Revalidate more often for votes

export default async function IdeasPage() {
  const ideas = await getIdeas({ limit: 100, sortBy: "votes" });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero/Hero6.png"
            alt="Ideas"
            fill
            className="object-cover object-center opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-600 shadow-lg shadow-accent-500/30 mb-6">
            <Lightbulb className="w-8 h-8 text-stone-900" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-4">
            Share Your <span className="gradient-text">Ideas</span>
          </h1>
          <p className="text-xl text-foreground-muted max-w-2xl mx-auto mb-6">
            Have a great idea for a mod, plugin, or feature? Share it with the community! 
            Upvote ideas you love and help developers know what to build.
          </p>
          <Link href="/ideas/submit">
            <Button size="lg">
              <Lightbulb className="w-5 h-5" />
              Share an Idea
            </Button>
          </Link>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<div className="animate-pulse h-96 bg-surface rounded-xl" />}>
            <IdeasContent initialIdeas={ideas} />
          </Suspense>
        </div>
      </section>
    </div>
  );
}

