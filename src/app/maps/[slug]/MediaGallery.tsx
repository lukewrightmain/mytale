"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Youtube, Play } from "lucide-react";

interface MediaGalleryProps {
  images: string[];
  videoUrl: string | null;
}

function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&\n?#]+)/,
    /(?:youtu\.be\/)([^&\n?#]+)/,
    /(?:youtube\.com\/embed\/)([^&\n?#]+)/,
    /(?:youtube\.com\/v\/)([^&\n?#]+)/,
    /(?:youtube\.com\/shorts\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) return match[1];
  }
  return null;
}

function getYouTubeThumbnail(url: string): string | null {
  const videoId = getYouTubeVideoId(url);
  if (videoId) {
    // hqdefault.jpg always exists, maxresdefault may not for all videos
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }
  return null;
}

export function MediaGallery({ images, videoUrl }: MediaGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showVideo, setShowVideo] = useState(false);

  // Combine video and images into a single media array
  const hasVideo = videoUrl && getYouTubeVideoId(videoUrl);
  const totalItems = (hasVideo ? 1 : 0) + images.length;

  const handlePrev = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === 0 ? totalItems - 1 : selectedIndex - 1);
      setShowVideo(false);
    }
  };

  const handleNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === totalItems - 1 ? 0 : selectedIndex + 1);
      setShowVideo(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setSelectedIndex(null);
      setShowVideo(false);
    } else if (e.key === "ArrowLeft") {
      handlePrev();
    } else if (e.key === "ArrowRight") {
      handleNext();
    }
  };

  if (totalItems === 0) return null;

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {/* Video Thumbnail */}
        {hasVideo && (
          <button
            onClick={() => {
              setSelectedIndex(0);
              setShowVideo(true);
            }}
            className="relative aspect-video rounded-lg overflow-hidden border border-border hover:border-primary-500/50 transition-colors group cursor-pointer"
          >
            <Image
              src={getYouTubeThumbnail(videoUrl) || "/images/hero/Hero.png"}
              alt="Video thumbnail"
              fill
              unoptimized
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center">
                <Play className="w-6 h-6 text-white ml-1" fill="white" />
              </div>
            </div>
            <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 rounded bg-black/70">
              <Youtube className="w-4 h-4 text-red-500" />
              <span className="text-xs text-white">Video</span>
            </div>
          </button>
        )}

        {/* Image Thumbnails */}
        {images.map((url, index) => (
          <button
            key={index}
            onClick={() => {
              setSelectedIndex(hasVideo ? index + 1 : index);
              setShowVideo(false);
            }}
            className="relative aspect-video rounded-lg overflow-hidden border border-border hover:border-primary-500/50 transition-colors group cursor-pointer"
          >
            <Image
              src={url}
              alt={`Gallery image ${index + 1}`}
              fill
              unoptimized
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => {
            setSelectedIndex(null);
            setShowVideo(false);
          }}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-white hover:text-primary-400 transition-colors z-10 p-2"
            onClick={() => {
              setSelectedIndex(null);
              setShowVideo(false);
            }}
          >
            <X className="w-8 h-8" />
          </button>

          {/* Navigation */}
          {totalItems > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-primary-400 transition-colors z-10 p-2 bg-black/50 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-primary-400 transition-colors z-10 p-2 bg-black/50 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          {/* Content */}
          <div
            className="max-w-6xl w-full max-h-[90vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {hasVideo && selectedIndex === 0 ? (
              // Video
              <div className="relative aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeVideoId(videoUrl)}?autoplay=1`}
                  className="w-full h-full rounded-lg"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              // Image
              <div className="relative aspect-video">
                <Image
                  src={images[hasVideo ? selectedIndex - 1 : selectedIndex]}
                  alt="Gallery image"
                  fill
                  unoptimized
                  className="object-contain rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
            {selectedIndex + 1} / {totalItems}
          </div>
        </div>
      )}
    </>
  );
}

