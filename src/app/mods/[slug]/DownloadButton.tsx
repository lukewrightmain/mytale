"use client";

import { useState } from "react";
import { Download, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui";

interface DownloadButtonProps {
  modId: string;
  versionId: string;
  downloadUrl: string;
  versionNumber: string;
}

export function DownloadButton({
  modId,
  versionId,
  downloadUrl,
  versionNumber,
}: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      // Track the download
      await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modId, versionId }),
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
      size="lg"
      onClick={handleDownload}
      disabled={isDownloading}
      className="min-w-[200px]"
    >
      {isDownloading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Downloading...
        </>
      ) : (
        <>
          <Download className="w-5 h-5" />
          Download v{versionNumber}
          <ExternalLink className="w-4 h-4 ml-1" />
        </>
      )}
    </Button>
  );
}

