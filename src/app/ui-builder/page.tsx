import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";
import { UIBuilderClient } from "./UIBuilderClient";

export const metadata: Metadata = {
  title: "Hytale UI Builder - Visual Designer for Hytale Mods",
  description: "Create beautiful Hytale mod UIs with our drag-and-drop visual builder. Export to .ui, Java, or HYUIML formats. No coding required for artists and designers.",
  keywords: [
    "Hytale UI builder",
    "Hytale mod UI",
    "Hytale visual editor",
    "Hytale UI designer",
    "Hytale mod development",
    "HYUIML",
    "Hytale interface builder",
  ],
  openGraph: {
    title: "Hytale UI Builder - Visual Designer for Hytale Mods | Mytale",
    description: "Create beautiful Hytale mod UIs with our drag-and-drop visual builder.",
    url: `${SITE_URL}/ui-builder`,
    type: "website",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "Mytale - Hytale UI Builder" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hytale UI Builder - Visual Designer for Hytale Mods | Mytale",
    description: "Create beautiful Hytale mod UIs with our drag-and-drop visual builder.",
    images: ["/images/og-image.png"],
  },
  alternates: {
    canonical: `${SITE_URL}/ui-builder`,
  },
};

export default function UIBuilderPage() {
  return <UIBuilderClient />;
}

