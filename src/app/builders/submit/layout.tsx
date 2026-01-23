import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Create Builder Profile - Showcase Your Hytale Builds",
  description: "Create your Hytale builder profile and showcase your building skills. Connect with the community and share your portfolio of epic builds.",
  keywords: ["Hytale builder profile", "Hytale portfolio", "Hytale building", "showcase Hytale builds"],
  openGraph: {
    title: "Create Builder Profile | Mytale",
    description: "Create your Hytale builder profile and showcase your building skills.",
    url: `${SITE_URL}/builders/submit`,
    type: "website",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "Create Hytale Builder Profile" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Create Builder Profile | Mytale",
    description: "Create your Hytale builder profile and showcase your building skills.",
    images: ["/images/og-image.png"],
  },
  alternates: {
    canonical: `${SITE_URL}/builders/submit`,
  },
};

export default function SubmitBuilderLayout({ children }: { children: React.ReactNode }) {
  return children;
}

