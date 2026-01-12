import type { Metadata } from "next";
import { Inter, Jersey_25 } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Header, Footer } from "@/components/layout";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const jersey = Jersey_25({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jersey",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} - Hytale Mods, Plugins & Servers`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: ["Hytale", "mods", "plugins", "servers", "community", "gaming"],
  authors: [{ name: SITE_NAME }],
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    title: `${SITE_NAME} - Hytale Mods, Plugins & Servers`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} - Hytale Mods, Plugins & Servers`,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark" suppressHydrationWarning>
        <body
          className={`${inter.variable} ${jersey.variable} antialiased min-h-screen flex flex-col`}
          suppressHydrationWarning
        >
          <Header />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
