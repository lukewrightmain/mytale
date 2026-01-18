import { Suspense } from "react";
import { getContentCreators } from "@/lib/supabase/queries";
import { CreatorsContent } from "./CreatorsContent";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Content Creators | Mytale",
  description: "Discover Hytale content creators, streamers, and YouTubers. Find your next favorite creator!",
};

export default async function CreatorsPage() {
  const creators = await getContentCreators();

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          </div>
        }>
          <CreatorsContent initialCreators={creators} />
        </Suspense>
      </div>
    </div>
  );
}

