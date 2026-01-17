"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { Button } from "./Button";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string | null) => void;
  onUpload: (file: File) => Promise<{ success: boolean; url?: string; error?: string }>;
  aspectRatio?: string;
  className?: string;
  allowGif?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  onUpload,
  aspectRatio = "aspect-video",
  className = "",
  allowGif = false,
}: ImageUploadProps) {
  const acceptedTypes = allowGif 
    ? "image/jpeg,image/png,image/webp,image/gif" 
    : "image/jpeg,image/png,image/webp";
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setIsUploading(true);

    try {
      const result = await onUpload(file);

      if (result.success && result.url) {
        onChange(result.url);
      } else {
        setError(result.error || "Upload failed");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleFile(file);
    } else {
      setError("Please drop an image file");
    }
  };

  const handleRemove = () => {
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept={acceptedTypes}
        onChange={handleInputChange}
        className="hidden"
      />

      {value ? (
        // Image Preview
        <div className={`relative ${aspectRatio} min-h-[60px] rounded-lg overflow-hidden border border-border bg-surface-elevated`}>
          {/* Use native img for GIFs to preserve animation, Next.js Image breaks GIF animations */}
          {value.toLowerCase().includes('.gif') || allowGif ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt="Upload preview"
              className="absolute inset-0 w-full h-full object-contain"
              onError={(e) => {
                console.error('Image failed to load:', value);
                e.currentTarget.style.display = 'none';
              }}
              onLoad={() => console.log('Image loaded successfully:', value)}
            />
          ) : (
            <Image
              src={value}
              alt="Upload preview"
              fill
              unoptimized
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
            >
              Change
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="text-red-400 hover:text-red-300"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        // Upload Zone
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`
            ${aspectRatio} rounded-lg border-2 border-dashed cursor-pointer
            flex flex-col items-center justify-center gap-3
            transition-colors
            ${dragActive
              ? "border-primary-500 bg-primary-500/10"
              : "border-border hover:border-primary-500/50 hover:bg-surface-elevated"
            }
            ${isUploading ? "pointer-events-none opacity-50" : ""}
          `}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-10 h-10 text-primary-400 animate-spin" />
              <p className="text-sm text-foreground-muted">Uploading...</p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-surface-elevated flex items-center justify-center">
                {dragActive ? (
                  <Upload className="w-6 h-6 text-primary-400" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-foreground-muted" />
                )}
              </div>
              <div className="text-center">
                <p className="text-sm text-foreground">
                  <span className="text-primary-400 font-medium">Click to upload</span>
                  {" "}or drag and drop
                </p>
                <p className="text-xs text-foreground-muted mt-1">
                  {allowGif ? "JPG, PNG, WebP or GIF" : "JPG, PNG or WebP"} (1280×720 recommended)
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-400 mt-2">{error}</p>
      )}
    </div>
  );
}

