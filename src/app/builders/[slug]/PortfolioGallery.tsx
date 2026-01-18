"use client";

import { useState } from "react";
import Image from "next/image";
import { Youtube, Image as ImageIcon, X } from "lucide-react";
import type { PortfolioItem } from "@/lib/supabase/queries";

interface PortfolioGalleryProps {
  items: PortfolioItem[];
}

// Helper to extract YouTube video ID from URL
function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  
  // Handle various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&\n?#]+)/,        // youtube.com/watch?v=ID
    /(?:youtu\.be\/)([^&\n?#]+)/,                     // youtu.be/ID
    /(?:youtube\.com\/embed\/)([^&\n?#]+)/,           // youtube.com/embed/ID
    /(?:youtube\.com\/v\/)([^&\n?#]+)/,               // youtube.com/v/ID
    /(?:youtube\.com\/shorts\/)([^&\n?#]+)/,          // youtube.com/shorts/ID
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,           // youtube.com/watch?other=params&v=ID
    /^([a-zA-Z0-9_-]{11})$/,                          // Just the video ID (11 chars)
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

// Generate YouTube thumbnail URL from video ID
function getYouTubeThumbnail(videoId: string): string {
  // YouTube provides several thumbnail options:
  // maxresdefault.jpg (1280x720) - may not exist for all videos
  // hqdefault.jpg (480x360) - always exists
  // mqdefault.jpg (320x180) - always exists
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

export function PortfolioGallery({ items }: PortfolioGalleryProps) {
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="relative aspect-video rounded-lg overflow-hidden border border-border cursor-pointer hover:border-primary-500/50 transition-colors group"
            onClick={() => setSelectedItem(item)}
          >
            {item.type === "video" ? (
              (() => {
                // Try to extract video ID from url OR thumbnail_url (in case user put YouTube URL in thumbnail field)
                const videoIdFromUrl = extractYouTubeId(item.url);
                const videoIdFromThumbnail = item.thumbnail_url ? extractYouTubeId(item.thumbnail_url) : null;
                const videoId = videoIdFromUrl || videoIdFromThumbnail;
                
                // Only use thumbnail_url if it's NOT a YouTube URL (actual image)
                const isYouTubeThumb = item.thumbnail_url && extractYouTubeId(item.thumbnail_url);
                const thumbnailUrl = (!isYouTubeThumb && item.thumbnail_url) || (videoId ? getYouTubeThumbnail(videoId) : null);
                
                return (
                  <>
                    {thumbnailUrl ? (
                      <Image
                        src={thumbnailUrl}
                        alt={item.title || "Video thumbnail"}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-surface-elevated flex items-center justify-center">
                        <Youtube className="w-12 h-12 text-foreground-muted" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <Youtube className="w-12 h-12 text-white" />
                    </div>
                  </>
                );
              })()
            ) : (
              <Image
                src={item.url}
                alt={item.title || "Portfolio image"}
                fill
                unoptimized
                className="object-cover group-hover:scale-105 transition-transform"
              />
            )}
            {item.title && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                <p className="text-white text-sm font-medium line-clamp-1">
                  {item.title}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal/Fullscreen View */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-primary-400 transition-colors z-10"
            onClick={() => setSelectedItem(null)}
          >
            <X className="w-8 h-8" />
          </button>

          <div className="max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
            {selectedItem.type === "video" ? (
              <div className="relative aspect-video">
                {(() => {
                  const videoId = extractYouTubeId(selectedItem.url);
                  if (videoId) {
                    return (
                      <iframe
                        className="w-full h-full rounded-lg"
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                        title={selectedItem.title || "Portfolio video"}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    );
                  }
                  return (
                    <div className="w-full h-full bg-surface-elevated flex items-center justify-center rounded-lg">
                      <p className="text-foreground-muted">Invalid YouTube URL</p>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="relative w-full" style={{ maxHeight: "90vh" }}>
                <Image
                  src={selectedItem.url}
                  alt={selectedItem.title || "Portfolio image"}
                  width={1920}
                  height={1080}
                  unoptimized
                  className="w-full h-auto rounded-lg"
                  style={{ maxHeight: "90vh", objectFit: "contain" }}
                />
              </div>
            )}

            {(selectedItem.title || selectedItem.description) && (
              <div className="mt-4 text-white">
                {selectedItem.title && (
                  <h3 className="text-2xl font-display font-bold mb-2">
                    {selectedItem.title}
                  </h3>
                )}
                {selectedItem.description && (
                  <p className="text-foreground-muted">{selectedItem.description}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
