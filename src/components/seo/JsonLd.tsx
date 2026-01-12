import { SITE_NAME, SITE_URL } from "@/lib/constants";

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface JsonLdProps {
  type: "WebPage" | "ItemList" | "SoftwareApplication" | "Article";
  title: string;
  description: string;
  url: string;
  breadcrumbs?: BreadcrumbItem[];
  datePublished?: string;
  dateModified?: string;
  image?: string;
  author?: string;
  downloads?: number;
  rating?: number;
  ratingCount?: number;
}

export function JsonLd({
  type,
  title,
  description,
  url,
  breadcrumbs,
  datePublished,
  dateModified,
  image,
  author,
  downloads,
  rating,
  ratingCount,
}: JsonLdProps) {
  const baseSchema = {
    "@context": "https://schema.org",
  };

  let schema: Record<string, unknown>;

  switch (type) {
    case "SoftwareApplication":
      schema = {
        ...baseSchema,
        "@type": "SoftwareApplication",
        name: title,
        description,
        url,
        applicationCategory: "GameApplication",
        operatingSystem: "Windows, macOS, Linux",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        ...(image && { image }),
        ...(author && {
          author: {
            "@type": "Person",
            name: author,
          },
        }),
        ...(datePublished && { datePublished }),
        ...(dateModified && { dateModified }),
        ...(downloads && { downloadCount: downloads }),
        ...(rating &&
          ratingCount && {
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: rating,
              ratingCount: ratingCount,
              bestRating: 5,
              worstRating: 1,
            },
          }),
      };
      break;

    case "ItemList":
      schema = {
        ...baseSchema,
        "@type": "ItemList",
        name: title,
        description,
        url,
        itemListElement: [],
      };
      break;

    case "Article":
      schema = {
        ...baseSchema,
        "@type": "Article",
        headline: title,
        description,
        url,
        ...(image && { image }),
        ...(datePublished && { datePublished }),
        ...(dateModified && { dateModified }),
        ...(author && {
          author: {
            "@type": "Person",
            name: author,
          },
        }),
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
      break;

    default:
      schema = {
        ...baseSchema,
        "@type": "WebPage",
        name: title,
        description,
        url,
        ...(image && { image }),
        isPartOf: {
          "@type": "WebSite",
          name: SITE_NAME,
          url: SITE_URL,
        },
      };
  }

  // Add breadcrumbs if provided
  const breadcrumbSchema = breadcrumbs
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      }
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
    </>
  );
}

// FAQ Schema for common questions
export function FaqJsonLd({
  questions,
}: {
  questions: { question: string; answer: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Organization Schema
export function OrganizationJsonLd() {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    alternateName: "Mytale Hytale Index",
    url: SITE_URL,
    logo: `${SITE_URL}/android-chrome-512x512.png`,
    description: "The premier destination for Hytale mods, plugins, servers, maps, and textures. A comprehensive community index for all Hytale content.",
    sameAs: [
      "https://x.com/MytaleHytale",
      "https://discord.gg/RsAmEkzq7U",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: `${SITE_URL}/contact`,
    },
  };

  // WebSite schema with search action for AI agents
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: "Mytale - Hytale Mod & Server Index",
    url: SITE_URL,
    description: "Comprehensive index for Hytale mods, plugins, servers, maps, and textures. Find and download community-created Hytale content.",
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
    },
    about: {
      "@type": "VideoGame",
      name: "Hytale",
      description: "An upcoming sandbox game by Hypixel Studios featuring block-based building, adventure, and powerful modding tools.",
      gamePlatform: ["PC", "Windows", "macOS"],
      publisher: {
        "@type": "Organization",
        name: "Hypixel Studios",
      },
    },
    mainEntity: [
      {
        "@type": "ItemList",
        name: "Hytale Mods",
        description: "Browse and download Hytale mods",
        url: `${SITE_URL}/mods`,
      },
      {
        "@type": "ItemList",
        name: "Hytale Plugins",
        description: "Browse and download Hytale server plugins",
        url: `${SITE_URL}/plugins`,
      },
      {
        "@type": "ItemList",
        name: "Hytale Servers",
        description: "Find Hytale multiplayer servers",
        url: `${SITE_URL}/servers`,
      },
      {
        "@type": "ItemList",
        name: "Hytale Maps",
        description: "Download custom Hytale maps and worlds",
        url: `${SITE_URL}/maps`,
      },
      {
        "@type": "ItemList",
        name: "Hytale Textures",
        description: "Browse Hytale texture and resource packs",
        url: `${SITE_URL}/textures`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}

