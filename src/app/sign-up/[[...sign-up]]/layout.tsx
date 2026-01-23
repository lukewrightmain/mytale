import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Sign Up - Join the Mytale Community",
  description: "Create your free Mytale account to upload Hytale mods, list your servers, share ideas, and connect with the Hytale community.",
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Sign Up | Mytale",
    description: "Create your free Mytale account and join the Hytale community.",
    url: `${SITE_URL}/sign-up`,
    type: "website",
  },
  alternates: {
    canonical: `${SITE_URL}/sign-up`,
  },
};

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
  return children;
}

