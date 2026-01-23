import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Submit an Idea - Share Your Hytale Suggestions",
  description: "Share your Hytale mod ideas, feature requests, and creative suggestions with the community. Vote and discuss ideas to shape the future of Hytale modding.",
  keywords: ["Hytale ideas", "Hytale suggestions", "Hytale feature request", "submit Hytale idea"],
  openGraph: {
    title: "Submit an Idea | Mytale",
    description: "Share your Hytale mod ideas and suggestions with the community.",
    url: `${SITE_URL}/ideas/submit`,
    type: "website",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "Submit Hytale Idea" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Submit an Idea | Mytale",
    description: "Share your Hytale mod ideas and suggestions with the community.",
    images: ["/images/og-image.png"],
  },
  alternates: {
    canonical: `${SITE_URL}/ideas/submit`,
  },
};

export default function SubmitIdeaLayout({ children }: { children: React.ReactNode }) {
  return children;
}

