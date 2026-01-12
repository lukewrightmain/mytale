import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { Upload } from "lucide-react";
import { getPlugins } from "@/lib/supabase/queries";
import { PluginsContent } from "./PluginsContent";
import { Button } from "@/components/ui";

export const revalidate = 60;

export default async function PluginsPage() {
  const plugins = await getPlugins({ limit: 100 });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero/Hero5.png"
            alt="Plugins"
            fill
            className="object-cover object-center opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-4">
            Server <span className="gradient-text">Plugins</span>
          </h1>
          <p className="text-xl text-foreground-muted max-w-2xl mx-auto mb-6">
            Extend your Hytale server with powerful plugins. From admin tools to 
            economy systems, find everything you need.
          </p>
          <Link href="/plugins/submit">
            <Button size="lg">
              <Upload className="w-5 h-5" />
              Upload a Plugin
            </Button>
          </Link>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<div className="animate-pulse h-96 bg-surface rounded-xl" />}>
            <PluginsContent initialPlugins={plugins} />
          </Suspense>
        </div>
      </section>
    </div>
  );
}

