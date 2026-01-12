"use client";

import { useState } from "react";
import { Download, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui";

export type ContentType = "mod" | "plugin" | "map" | "texture";

interface DownloadButtonProps {
  type: ContentType;
  contentId: string;
  versionId?: string;
  downloadUrl: string;
  versionNumber?: string;
  size?: "sm" | "default" | "lg";
  className?: string;
}

export function DownloadButton({
  type,
  contentId,
  versionId,
  downloadUrl,
  versionNumber,
  size = "lg",
  className = "",
}: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsDownloading(true);

    try {
      // Track the download
      await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, contentId, versionId }),
      });
    } catch (error) {
      console.error("Failed to track download:", error);
    }

    // Open the download URL
    window.open(downloadUrl, "_blank");
    
    setTimeout(() => {
      setIsDownloading(false);
    }, 1000);
  };

  return (
    <Button
      size={size}
      onClick={handleDownload}
      disabled={isDownloading}
      className={className}
    >
      {isDownloading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Downloading...
        </>
      ) : (
        <>
          <Download className="w-5 h-5" />
          {versionNumber ? `Download v${versionNumber}` : "Download"}
          <ExternalLink className="w-4 h-4 ml-1" />
        </>
      )}
    </Button>
  );
}

