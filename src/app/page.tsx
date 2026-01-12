import { Hero, Stats, FeaturedMods, FeaturedServers, CallToAction } from "@/components/home";
import { OrganizationJsonLd, FaqJsonLd } from "@/components/seo";

// FAQ data for SEO
const faqData = [
  {
    question: "What is Mytale?",
    answer: "Mytale is the premier destination for Hytale mods, plugins, servers, maps, and textures. We provide a comprehensive platform for the Hytale community to discover, download, and share custom content.",
  },
  {
    question: "How do I download Hytale mods?",
    answer: "Simply browse our mods section, find a mod you like, and click the download button. All mods are free to download and include installation instructions.",
  },
  {
    question: "How do I find Hytale servers to play on?",
    answer: "Visit our servers page to browse a comprehensive list of Hytale multiplayer servers. You can filter by game mode, region, and player count to find the perfect server.",
  },
  {
    question: "Can I upload my own Hytale mods?",
    answer: "Yes! Create a free account and you can upload your own mods, plugins, maps, textures, or list your server on Mytale.",
  },
  {
    question: "Is Mytale official?",
    answer: "Mytale is a community-driven platform and is not officially affiliated with Hypixel Studios or Riot Games. We are built by the community, for the community.",
  },
];

export default function HomePage() {
  return (
    <>
      <OrganizationJsonLd />
      <FaqJsonLd questions={faqData} />
      <Hero />
      <Stats />
      <FeaturedMods />
      <FeaturedServers />
      <CallToAction />
    </>
  );
}
