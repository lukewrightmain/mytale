import { Suspense } from "react";
import Image from "next/image";
import { getServers } from "@/lib/supabase/queries";
import { ServersContent } from "./ServersContent";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function ServersPage() {
  // Fetch all approved servers on the server
  const servers = await getServers({ limit: 100 });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero/Hero2.png"
            alt="Servers"
            fill
            className="object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-4">
            Hytale <span className="gradient-text">Servers</span>
          </h1>
          <p className="text-xl text-foreground-muted max-w-2xl mx-auto">
            Find the perfect server for your playstyle. From survival to creative, 
            PvP to roleplay — your adventure starts here.
          </p>
        </div>
      </section>

      {/* Filters & List */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<div className="animate-pulse h-96 bg-surface rounded-xl" />}>
            <ServersContent initialServers={servers} />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
