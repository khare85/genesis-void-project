
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const uploadFileToStorage = async (
  file: File | Blob,
  fileType: 'resume' | 'video',
  userEmail: string,
  jobId: string
): Promise<string> => {
  try {
    console.log(`Starting ${fileType} upload process`);
    const timestamp = Date.now();
    const sanitizedEmail = userEmail.replace(/[^a-zA-Z0-9]/g, '-');
    
    // Check if Storage buckets exist, if not - we need to tell the user
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error(`Error checking buckets:`, bucketsError);
      throw new Error(`Storage error: ${bucketsError.message}`);
    }
    
    const bucketExists = buckets?.some(bucket => bucket.name === fileType);
    if (!bucketExists) {
      console.error(`Bucket "${fileType}" does not exist`);
      throw new Error(`Storage bucket "${fileType}" does not exist. Please create it in the Supabase dashboard.`);
    }
    
    // Determine file extension and name
    let extension, filename;
    if (fileType === 'resume') {
      extension = (file as File).name?.split('.').pop() || 'pdf';
      filename = `${fileType}-${sanitizedEmail}-${timestamp}.${extension}`;
    } else {
      // For video files, handle Safari's QuickTime format vs. Chrome/Firefox's WebM
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      extension = isSafari ? 'mp4' : 'webm';
      filename = `${fileType}-${sanitizedEmail}-${timestamp}.${extension}`;
    }
    
    console.log(`Uploading ${fileType} as: ${filename}`);
    
    // Upload file to Supabase storage
    const { data, error } = await supabase.storage
      .from(fileType)
      .upload(`${jobId}/${filename}`, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error(`Error uploading ${fileType}:`, error);
      throw error;
    }
    
    console.log(`${fileType} uploaded successfully:`, data);
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(fileType)
      .getPublicUrl(`${jobId}/${filename}`);
    
    console.log(`Public URL for ${fileType}:`, publicUrl);
    
    return publicUrl;
  } catch (error: any) {
    console.error(`Error uploading ${fileType}:`, error);
    toast.error(`Failed to upload ${fileType}: ${error.message || 'Unknown error'}`);
    throw error;
  }
};
