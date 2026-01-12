import Link from "next/link";
import { Upload, Server, Sparkles } from "lucide-react";
import { Button } from "@/components/ui";

export function CallToAction() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-900/50 via-surface to-accent-900/50 border border-border p-8 sm:p-12">
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl" />

          <div className="relative z-10 text-center max-w-2xl mx-auto">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/30 mb-6">
              <Sparkles className="w-8 h-8 text-stone-900" />
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
              Share Your Creations
            </h2>
            <p className="text-lg text-foreground-muted mb-8">
              Got a mod, plugin, or server? Share it with thousands of Hytale players 
              and grow your community.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/mods/submit">
                <Button size="lg" className="min-w-[200px]">
                  <Upload className="w-5 h-5" />
                  Upload a Mod
                </Button>
              </Link>
              <Link href="/servers/submit">
                <Button size="lg" variant="outline" className="min-w-[200px]">
                  <Server className="w-5 h-5" />
                  List Your Server
                </Button>
              </Link>
            </div>

            {/* Note */}
            <p className="mt-6 text-sm text-foreground-subtle">
              Free to submit • Quick approval process • Reach thousands of players
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

