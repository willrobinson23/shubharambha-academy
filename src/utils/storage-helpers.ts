import { supabase } from "@/integrations/supabase/client";

/**
 * Extracts the storage file path from a Supabase public URL and deletes it from the given bucket.
 * 
 * URL format: https://<ref>.supabase.co/storage/v1/object/public/<bucket>/<file-path>
 * 
 * @param imageUrl - The full public URL of the image
 * @param bucketName - The storage bucket name (e.g. 'gallery', 'events')
 */
export async function deleteStorageFile(imageUrl: string | null | undefined, bucketName: string): Promise<void> {
  if (!imageUrl) return;
  
  // Only handle Supabase-hosted images
  if (!imageUrl.includes("supabase.co/storage")) return;

  try {
    // Extract the file path after /storage/v1/object/public/<bucket>/
    const marker = `/storage/v1/object/public/${bucketName}/`;
    const markerIndex = imageUrl.indexOf(marker);
    
    if (markerIndex === -1) return;
    
    // Get everything after the marker (this is the file path within the bucket)
    let filePath = imageUrl.substring(markerIndex + marker.length);
    
    // Remove any query parameters
    const queryIndex = filePath.indexOf("?");
    if (queryIndex !== -1) {
      filePath = filePath.substring(0, queryIndex);
    }
    
    // Decode URI components (in case filename has special characters)
    filePath = decodeURIComponent(filePath);
    
    if (!filePath) return;

    const { error } = await supabase.storage.from(bucketName).remove([filePath]);
    if (error) {
      console.error(`Failed to delete file from ${bucketName}:`, error.message);
    }
  } catch (err) {
    console.error("Error deleting storage file:", err);
  }
}
