import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Sign In - Access Your Mytale Account",
  description: "Sign in to your Mytale account to upload mods, list servers, and connect with the Hytale community.",
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Sign In | Mytale",
    description: "Sign in to your Mytale account to upload mods, list servers, and connect with the Hytale community.",
    url: `${SITE_URL}/sign-in`,
    type: "website",
  },
  alternates: {
    canonical: `${SITE_URL}/sign-in`,
  },
};

export default function SignInLayout({ children }: { children: React.ReactNode }) {
  return children;
}

