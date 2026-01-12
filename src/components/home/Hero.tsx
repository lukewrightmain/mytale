import Image from "next/image";
import Link from "next/link";
import { Sword, Server } from "lucide-react";
import { Button } from "@/components/ui";

export function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero/Hero.png"
          alt="Hytale landscape"
          fill
          className="object-cover object-center"
          priority
          quality={90}
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Launch Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/30 mb-8 animate-pulse-glow">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500" />
          </span>
          <span className="text-primary-400 text-sm font-medium">
            Hytale launches January 13, 2026!
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
          <span className="text-foreground">Your Adventure</span>
          <br />
          <span className="gradient-text">Awaits</span>
        </h1>

        {/* Subheading */}
        <p className="text-xl sm:text-2xl text-foreground-muted max-w-2xl mx-auto mb-10">
          Discover community-made mods, plugins, and servers. 
          Enhance your Hytale experience with endless possibilities.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/mods">
            <Button size="lg" className="min-w-[180px]">
              <Sword className="w-5 h-5" />
              Browse Mods
            </Button>
          </Link>
          <Link href="/servers">
            <Button size="lg" variant="outline" className="min-w-[180px]">
              <Server className="w-5 h-5" />
              Find Servers
            </Button>
          </Link>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
          <div className="w-6 h-10 rounded-full border-2 border-foreground-muted flex items-start justify-center p-2">
            <div className="w-1 h-2 rounded-full bg-foreground-muted animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}

