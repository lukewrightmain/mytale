"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Copy, Check } from "lucide-react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";
import { NAV_ITEMS, SITE_NAME } from "@/lib/constants";

const CREATOR_CODE = "mytale";

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyCreatorCode = async () => {
    await navigator.clipboard.writeText(CREATOR_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Logo - Fixed width for balance */}
          <div className="flex-1 flex items-center">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-8 h-8 rounded-lg overflow-hidden shadow-lg group-hover:shadow-primary-500/30 transition-shadow">
                <Image
                  src="/android-chrome-192x192.png"
                  alt="Mytale Logo"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <Image
                src="/images/assets/MyTaleText.png"
                alt={SITE_NAME}
                width={120}
                height={30}
                className="h-7 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation - True center */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  pathname === item.href
                    ? "text-primary-400 bg-primary-500/10"
                    : "text-foreground-muted hover:text-foreground hover:bg-stone-800"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth + Creator Code - Fixed width for balance */}
          <div className="flex-1 hidden md:flex items-center justify-end gap-3">
            {/* Creator Code */}
            <button
              onClick={copyCreatorCode}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 hover:border-amber-400/50 transition-all group"
              title="Click to copy creator code"
            >
              <span className="text-xs text-amber-200/70">Creator Code:</span>
              <span className="text-sm font-bold text-amber-400">{CREATOR_CODE}</span>
              {copied ? (
                <Check className="w-3.5 h-3.5 text-green-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-amber-400/70 group-hover:text-amber-400 transition-colors" />
              )}
            </button>

            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm">
                  Get Started
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9",
                  },
                }}
              />
            </SignedIn>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-stone-800 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col gap-2">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "text-primary-400 bg-primary-500/10"
                      : "text-foreground-muted hover:text-foreground hover:bg-stone-800"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <hr className="border-border my-2" />
              {/* Mobile Creator Code */}
              <button
                onClick={copyCreatorCode}
                className="mx-4 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 active:scale-95 transition-all"
              >
                <span className="text-sm text-amber-200/70">Creator Code:</span>
                <span className="text-base font-bold text-amber-400">{CREATOR_CODE}</span>
                {copied ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-amber-400/70" />
                )}
              </button>
              <hr className="border-border my-2" />
              <div className="flex flex-col gap-2 px-4">
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button className="w-full">
                      Get Started
                    </Button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <div className="flex items-center justify-center py-2">
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: "w-10 h-10",
                        },
                      }}
                    />
                  </div>
                </SignedIn>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
