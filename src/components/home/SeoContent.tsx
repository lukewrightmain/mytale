import Link from "next/link";
import { Server, Puzzle, Map, Palette, Package, Lightbulb } from "lucide-react";

const categories = [
  {
    icon: Server,
    title: "Hytale Servers",
    description: "Browse our comprehensive Hytale server list. Find the best Hytale multiplayer servers for survival, PvP, roleplay, and minigames.",
    href: "/servers",
    keywords: "Hytale server list, Hytale multiplayer",
  },
  {
    icon: Package,
    title: "Hytale Mods",
    description: "Download free Hytale mods to enhance your gameplay. Browse gameplay mods, new creatures, items, and world generation mods.",
    href: "/mods",
    keywords: "Hytale mods download, best Hytale mods",
  },
  {
    icon: Puzzle,
    title: "Hytale Plugins",
    description: "Find Hytale server plugins for your dedicated server. Economy, permissions, minigames, and custom features.",
    href: "/plugins",
    keywords: "Hytale plugins, Hytale server plugins",
  },
  {
    icon: Palette,
    title: "Hytale Texture Packs",
    description: "Download Hytale texture packs and resource packs. Transform your visuals with HD textures and unique art styles.",
    href: "/textures",
    keywords: "Hytale texture packs, Hytale resource packs",
  },
  {
    icon: Map,
    title: "Hytale Maps & Worlds",
    description: "Explore custom Hytale maps and worlds. Download adventure maps, parkour challenges, PvP arenas, and creative builds.",
    href: "/maps",
    keywords: "Hytale maps, Hytale worlds download",
  },
  {
    icon: Lightbulb,
    title: "Hytale Ideas",
    description: "Share and vote on Hytale mod ideas. Help shape the future of Hytale modding with your creative suggestions.",
    href: "/ideas",
    keywords: "Hytale ideas, Hytale suggestions",
  },
];

export function SeoContent() {
  return (
    <section className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* SEO Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            The Ultimate Hytale Community Hub
          </h2>
          <p className="text-lg text-foreground-muted max-w-3xl mx-auto">
            Mytale is your one-stop destination for everything Hytale. Whether you&apos;re looking for 
            Hytale servers to play on, mods to download, or texture packs to customize your experience, 
            we&apos;ve got you covered.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className="group p-6 rounded-xl bg-surface-elevated border border-border hover:border-primary-500/50 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary-500/10 text-primary-400 group-hover:bg-primary-500/20 transition-colors">
                  <category.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary-400 transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-sm text-foreground-muted">
                    {category.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Additional SEO Text */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Why Choose Mytale for Hytale Content?
          </h3>
          <div className="prose prose-invert max-w-3xl mx-auto text-foreground-muted">
            <p>
              Mytale is the premier Hytale index, providing the most comprehensive collection of 
              Hytale servers, mods, plugins, texture packs, and maps. Our Hytale server list 
              features servers from around the world, making it easy to find the perfect 
              Hytale multiplayer experience. Download Hytale mods and resource packs created 
              by the community, and discover new ways to enhance your Hytale gameplay.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

