import Link from "next/link";
import { Sparkles, Heart } from "lucide-react";
import { SITE_NAME, NAV_ITEMS, SOCIAL_LINKS } from "@/lib/constants";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-stone-900" />
              </div>
              <span className="text-xl font-display font-bold gradient-text">
                {SITE_NAME}
              </span>
            </Link>
            <p className="text-foreground-muted max-w-sm">
              The premier destination for Hytale mods, plugins, and server discovery. 
              Built by the community, for the community.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-display font-semibold text-foreground mb-4">
              Navigation
            </h3>
            <ul className="space-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-foreground-muted hover:text-primary-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-display font-semibold text-foreground mb-4">
              Community
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href={SOCIAL_LINKS.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground-muted hover:text-primary-400 transition-colors"
                >
                  Discord
                </a>
              </li>
              <li>
                <a
                  href={SOCIAL_LINKS.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground-muted hover:text-primary-400 transition-colors"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href={SOCIAL_LINKS.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground-muted hover:text-primary-400 transition-colors"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-foreground-subtle text-sm">
            © {currentYear} {SITE_NAME}. Not affiliated with Hypixel Studios.
          </p>
          <p className="text-foreground-subtle text-sm flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for the Hytale community
          </p>
        </div>
      </div>
    </footer>
  );
}

