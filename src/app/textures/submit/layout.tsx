import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Upload a Texture Pack - Submit Your Hytale Textures",
  description: "Share your Hytale texture pack with the community. Upload HD textures, resource packs, and custom art styles for Hytale players to download.",
  keywords: ["Hytale texture pack upload", "submit Hytale textures", "Hytale resource pack", "share Hytale textures"],
  openGraph: {
    title: "Upload a Texture Pack | Mytale",
    description: "Share your Hytale texture pack with the community.",
    url: `${SITE_URL}/textures/submit`,
    type: "website",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "Upload Hytale Texture Pack" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Upload a Texture Pack | Mytale",
    description: "Share your Hytale texture pack with the community.",
    images: ["/images/og-image.png"],
  },
  alternates: {
    canonical: `${SITE_URL}/textures/submit`,
  },
};

export default function SubmitTextureLayout({ children }: { children: React.ReactNode }) {
  return children;
}

