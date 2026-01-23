import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Register as Creator - Join Hytale Content Creators",
  description: "Register as a Hytale content creator on Mytale. Share your streaming schedule, connect with the community, and grow your audience.",
  keywords: ["Hytale content creator", "Hytale streamer", "Hytale YouTuber", "register Hytale creator"],
  openGraph: {
    title: "Register as Creator | Mytale",
    description: "Register as a Hytale content creator and grow your audience.",
    url: `${SITE_URL}/creators/submit`,
    type: "website",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "Register Hytale Content Creator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Register as Creator | Mytale",
    description: "Register as a Hytale content creator and grow your audience.",
    images: ["/images/og-image.png"],
  },
  alternates: {
    canonical: `${SITE_URL}/creators/submit`,
  },
};

export default function SubmitCreatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}

