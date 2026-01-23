import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Upload a Map - Submit Your Hytale Map",
  description: "Share your Hytale map with the community. Upload adventure maps, parkour challenges, PvP arenas, and creative builds for thousands of players to enjoy.",
  keywords: ["Hytale map upload", "submit Hytale map", "Hytale custom maps", "share Hytale worlds"],
  openGraph: {
    title: "Upload a Map | Mytale",
    description: "Share your Hytale map with the community. Upload adventure maps, parkour challenges, and more.",
    url: `${SITE_URL}/maps/submit`,
    type: "website",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "Upload Hytale Map" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Upload a Map | Mytale",
    description: "Share your Hytale map with the community.",
    images: ["/images/og-image.png"],
  },
  alternates: {
    canonical: `${SITE_URL}/maps/submit`,
  },
};

export default function SubmitMapLayout({ children }: { children: React.ReactNode }) {
  return children;
}

