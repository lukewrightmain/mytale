"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sword, Server, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui";

// All hero images to rotate through
const HERO_IMAGES = [
  "/images/assets/5e7b9ea850cbcd001176c5b1_3___helipack_cruising.jpg",
  "/images/assets/5e7a961e5e334000189a2a7a_1__1_.jpg",
  "/images/assets/5e7b9eab50cbcd001176c5b3_4___fight_with_skeleton_archer.jpg",
  "/images/assets/5e7b9ead50cbcd001176c5b5_5___zone_3_exploration.jpg",
  "/images/assets/5e7b9eb050cbcd001176c5b7_6___watering_corn.png",
  "/images/assets/5e7b9eb350cbcd001176c5b9_7___zone_2_shadows_2.jpg",
  "/images/assets/5e7b9eb650cbcd001176c5bb_8___fleeing_from_scaraks.png",
  "/images/assets/5e7b9ebd50cbcd001176c5bd_9___goblin_fight.png",
  "/images/assets/5e7b9ec650cbcd001176c5bf_10___exploring_sunken_ship.png",
  "/images/assets/5e7b9ecb50cbcd001176c5c1_11___z2_camels.png",
  "/images/assets/5e7b9f7e50cbcd001176c5d3_14___zone_3_sunshaft_and_bloom.jpg",
  "/images/assets/5e7b9f8450cbcd001176c5d5_15___trork_camp_objective.png",
  "/images/assets/5e7b92a950cbcd001176c4e9_5___temple_of_gaia_dungeon.jpg",
  "/images/assets/5e7b92a950cbcd001176c4f0_8___world_zones_research.jpg",
  "/images/assets/5e7b92a950cbcd001176c4f3_4___dungeon_entrances_research.jpg",
  "/images/assets/5e7b92a950cbcd001176c4f7_7___trork_archetypes.jpg",
];

const IMAGE_DURATION = 8000; // 8 seconds per image

export function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
      setIsTransitioning(false);
    }, 300);
  }, [isTransitioning]);

  const goToPrev = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);
      setIsTransitioning(false);
    }, 300);
  }, [isTransitioning]);

  const goToIndex = useCallback((index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, 300);
  }, [isTransitioning, currentIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, IMAGE_DURATION);

    return () => clearInterval(interval);
  }, [goToNext]);

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Images with crossfade */}
      <div className="absolute inset-0 z-0">
        {HERO_IMAGES.map((src, index) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex && !isTransitioning
                ? "opacity-100"
                : "opacity-0"
            }`}
          >
            <Image
              src={src}
              alt="Hytale landscape"
              fill
              className="object-cover object-center"
              priority={index === 0}
              quality={90}
            />
          </div>
        ))}
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80" />
      </div>

      {/* Left click zone */}
      <button
        onClick={goToPrev}
        className="absolute left-0 top-0 bottom-0 w-1/4 z-15 cursor-w-resize group"
        aria-label="Previous image"
      >
        <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 rounded-full bg-background/50 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-background/70 transition-colors">
            <ChevronLeft className="w-6 h-6 text-white" />
          </div>
        </div>
      </button>

      {/* Right click zone */}
      <button
        onClick={goToNext}
        className="absolute right-0 top-0 bottom-0 w-1/4 z-15 cursor-e-resize group"
        aria-label="Next image"
      >
        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 rounded-full bg-background/50 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-background/70 transition-colors">
            <ChevronRight className="w-6 h-6 text-white" />
          </div>
        </div>
      </button>

      {/* Image indicator dots */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 hidden md:flex gap-1.5">
        {HERO_IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => goToIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-primary-400 w-6"
                : "bg-foreground-muted/50 hover:bg-foreground-muted"
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pointer-events-none">
        {/* Launch Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/30 mb-8 animate-pulse-glow pointer-events-auto">
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
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pointer-events-auto">
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
