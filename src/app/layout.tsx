import type { Metadata, Viewport } from "next";
import { Inter, Jersey_25 } from "next/font/google";
import Script from "next/script";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import { Header, Footer } from "@/components/layout";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL, SEO_KEYWORDS, PAGE_DESCRIPTIONS } from "@/lib/constants";
import "./globals.css";

// Google Ads ID
const GOOGLE_ADS_ID = "AW-11361781332";

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

export const viewport: Viewport = {
  themeColor: "#D97706",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - Hytale Servers, Mods, Plugins, Texture Packs & Server List`,
    template: `%s | ${SITE_NAME} - Hytale Community Hub`,
  },
  description: PAGE_DESCRIPTIONS.home,
  keywords: SEO_KEYWORDS.global,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#D97706" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} - Hytale Servers, Mods, Plugins & Server List`,
    description: PAGE_DESCRIPTIONS.home,
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} - Your Ultimate Hytale Community Hub`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} - Hytale Servers, Mods, Plugins & Server List`,
    description: PAGE_DESCRIPTIONS.home,
    images: ["/images/og-image.png"],
    creator: "@MytaleHytale",
    site: "@MytaleHytale",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  category: "gaming",
  classification: "Gaming Community",
  other: {
    "msapplication-TileColor": "#1C1917",
    "apple-mobile-web-app-title": SITE_NAME,
    "application-name": SITE_NAME,
  },
};

// JSON-LD Structured Data for Organization
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/mods?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
  publisher: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/android-chrome-512x512.png`,
    },
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
        <head>
          {/* AI Agent Discovery */}
          <link rel="author" href="/llms.txt" />
          <meta name="ai-content-declaration" content="This website provides an index for Hytale mods, plugins, servers, maps, and textures." />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        </head>
        <body
          className={`${inter.variable} ${jersey.variable} antialiased min-h-screen flex flex-col`}
          suppressHydrationWarning
        >
          {/* Google Ads Tag */}
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-ads" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GOOGLE_ADS_ID}');
            `}
          </Script>
          
          <Header />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
