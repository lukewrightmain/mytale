import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Upload a Mod - Submit Your Hytale Mod",
  description: "Share your Hytale mod with the community. Upload your mod, plugin, resource pack, or modpack and reach thousands of Hytale players.",
  keywords: ["Hytale mod upload", "submit Hytale mod", "Hytale modding", "share Hytale mods"],
  openGraph: {
    title: "Upload a Mod | Mytale",
    description: "Share your Hytale mod with the community. Upload your mod, plugin, resource pack, or modpack.",
    url: `${SITE_URL}/mods/submit`,
    type: "website",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "Upload Hytale Mod" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Upload a Mod | Mytale",
    description: "Share your Hytale mod with the community.",
    images: ["/images/og-image.png"],
  },
  alternates: {
    canonical: `${SITE_URL}/mods/submit`,
  },
};

export default function SubmitModLayout({ children }: { children: React.ReactNode }) {
  return children;
}

