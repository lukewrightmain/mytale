"use server";

import { createClient } from "./server";

const BUCKET_NAME = "uploads";

// Recommended dimensions for cards (16:9 aspect ratio)
// Min: 640x360, Recommended: 1280x720, Max file size: 5MB
export const IMAGE_REQUIREMENTS = {
  maxFileSizeMB: 5,
  recommendedWidth: 1280,
  recommendedHeight: 720,
  aspectRatio: "16:9",
  allowedTypes: ["image/jpeg", "image/png", "image/webp"],
};

export async function uploadImage(
  file: File,
  folder: "mods" | "servers"
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const supabase = await createClient();

    // Validate file type
    if (!IMAGE_REQUIREMENTS.allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: "Invalid file type. Please upload a JPG, PNG, or WebP image.",
      };
    }

    // Validate file size (5MB max)
    const maxBytes = IMAGE_REQUIREMENTS.maxFileSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      return {
        success: false,
        error: `File too large. Maximum size is ${IMAGE_REQUIREMENTS.maxFileSizeMB}MB.`,
      };
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const fileName = `${folder}/${timestamp}-${randomId}.${extension}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return {
        success: false,
        error: "Failed to upload image. Please try again.",
      };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    return {
      success: true,
      url: urlData.publicUrl,
    };
  } catch (err) {
    console.error("Upload error:", err);
    return {
      success: false,
      error: "An unexpected error occurred during upload.",
    };
  }
}

