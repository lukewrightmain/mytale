import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Book, Server, Puzzle, Settings, Zap, Globe } from "lucide-react";
import { Card } from "@/components/ui";

export const metadata: Metadata = {
  title: "Hytale Guides & Tutorials",
  description:
    "Comprehensive guides for Hytale server setup, modding, plugin development, and more. Learn how to run a Hytale server, install mods, and optimize performance.",
  keywords: [
    "Hytale guide",
    "Hytale tutorial",
    "Hytale server setup",
    "how to run Hytale server",
    "Hytale modding guide",
    "Hytale server manual",
    "Hytale server configuration",
  ],
};

const guides = [
  {
    title: "Hytale Server Manual",
    description:
      "Complete guide to setting up, configuring, and running a dedicated Hytale server. Covers Java installation, authentication, ports, firewall, and more.",
    href: "/guides/server-manual",
    icon: Server,
    category: "Server",
    difficulty: "Intermediate",
  },
  {
    title: "Installing Mods",
    description:
      "Learn how to download and install mods on your Hytale server. Includes tips for mod management and troubleshooting.",
    href: "/guides/server-manual#installing-mods",
    icon: Puzzle,
    category: "Mods",
    difficulty: "Beginner",
  },
  {
    title: "Multiserver Architecture",
    description:
      "Advanced guide to building server networks with player referral, connection redirects, and custom proxies using QUIC.",
    href: "/guides/server-manual#multiserver-architecture",
    icon: Globe,
    category: "Server",
    difficulty: "Advanced",
  },
  {
    title: "Performance Optimization",
    description:
      "Tips and tricks for optimizing your Hytale server performance, including view distance, AOT cache, and resource management.",
    href: "/guides/server-manual#tips-tricks",
    icon: Zap,
    category: "Server",
    difficulty: "Intermediate",
  },
];

export default function GuidesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/assets/5e7b92a950cbcd001176c4f0_8___world_zones_research.jpg"
            alt="Hytale Guides"
            fill
            className="object-cover object-center opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/30 mb-6">
            <Book className="w-4 h-4 text-primary-400" />
            <span className="text-primary-400 text-sm font-medium">
              Learn Hytale
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-foreground">Hytale </span>
            <span className="gradient-text">Guides & Tutorials</span>
          </h1>

          <p className="text-xl text-foreground-muted max-w-2xl mx-auto">
            Everything you need to know about running servers, installing mods,
            and mastering Hytale.
          </p>
        </div>
      </section>

      {/* Guides Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guides.map((guide) => (
              <Link key={guide.href} href={guide.href}>
                <Card className="h-full hover:border-primary-500/50 transition-all group">
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-500/20 transition-colors">
                        <guide.icon className="w-6 h-6 text-primary-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-surface-lighter text-foreground-muted">
                            {guide.category}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${
                              guide.difficulty === "Beginner"
                                ? "bg-green-500/10 text-green-400"
                                : guide.difficulty === "Intermediate"
                                  ? "bg-yellow-500/10 text-yellow-400"
                                  : "bg-red-500/10 text-red-400"
                            }`}
                          >
                            {guide.difficulty}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary-400 transition-colors mb-2">
                          {guide.title}
                        </h3>
                        <p className="text-foreground-muted text-sm">
                          {guide.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Guide CTA */}
      <section className="py-16 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-br from-primary-500/10 to-accent-500/10 border-primary-500/30">
            <div className="p-8 text-center">
              <Server className="w-16 h-16 text-primary-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Ready to Run Your Own Hytale Server?
              </h2>
              <p className="text-foreground-muted mb-6 max-w-xl mx-auto">
                Our comprehensive Server Manual covers everything from Java
                installation to advanced multiserver architecture. Get your
                server up and running today!
              </p>
              <Link
                href="/guides/server-manual"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
              >
                <Book className="w-5 h-5" />
                Read the Server Manual
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}


