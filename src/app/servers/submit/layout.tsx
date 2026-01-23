import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "List Your Server - Add Your Hytale Server",
  description: "List your Hytale server on Mytale and reach thousands of players. Add your survival, PvP, creative, roleplay, or minigame server to our server list.",
  keywords: ["Hytale server list", "add Hytale server", "list Hytale server", "Hytale multiplayer"],
  openGraph: {
    title: "List Your Server | Mytale",
    description: "List your Hytale server and reach thousands of players looking for their next adventure.",
    url: `${SITE_URL}/servers/submit`,
    type: "website",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "List Hytale Server" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "List Your Server | Mytale",
    description: "List your Hytale server and reach thousands of players.",
    images: ["/images/og-image.png"],
  },
  alternates: {
    canonical: `${SITE_URL}/servers/submit`,
  },
};

export default function SubmitServerLayout({ children }: { children: React.ReactNode }) {
  return children;
}

