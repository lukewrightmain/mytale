import { createClient } from "./client";

export const IMAGE_REQUIREMENTS = {
  maxFileSizeMB: 5,
  recommendedWidth: 1280,
  recommendedHeight: 720,
  aspectRatio: "16:9",
  allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
};

export async function uploadImage(
  file: File,
  folder: "mods" | "servers" | "maps" | "textures" | "builders"
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const supabase = createClient();

    // Validate file type
    if (!IMAGE_REQUIREMENTS.allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: "Invalid file type. Please upload a JPG, PNG, WebP, or GIF image.",
      };
    }

    // Validate file size
    const maxSizeBytes = IMAGE_REQUIREMENTS.maxFileSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return {
        success: false,
        error: `File size must be less than ${IMAGE_REQUIREMENTS.maxFileSizeMB}MB.`,
      };
    }

    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("uploads")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Storage upload error:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      return {
        success: false,
        error: `Upload failed: ${error.message || "Unknown error"}`,
      };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("uploads")
      .getPublicUrl(data.path);

    return {
      success: true,
      url: urlData.publicUrl,
    };
  } catch (error) {
    console.error("Upload error:", error);
    return {
      success: false,
      error: "An unexpected error occurred during upload.",
    };
  }
}
