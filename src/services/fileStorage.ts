
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const createBucketIfNotExists = async (bucketName: string) => {
  try {
    // Check if bucket exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error(`Error checking buckets:`, bucketsError);
      return false;
    }
    
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    if (!bucketExists) {
      console.log(`Bucket "${bucketName}" does not exist, attempting to create it`);
      // Try to create the bucket
      const { error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true,
      });
      
      if (createError) {
        console.error(`Error creating bucket ${bucketName}:`, createError);
        return false;
      }
      console.log(`Bucket "${bucketName}" created successfully`);
    }
    return true;
  } catch (error) {
    console.error(`Error in createBucketIfNotExists:`, error);
    return false;
  }
};

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
    
    // Ensure bucket exists
    const bucketExists = await createBucketIfNotExists(fileType);
    if (!bucketExists) {
      throw new Error(`Storage bucket "${fileType}" could not be created. Please contact support.`);
    }
    
    // Determine file extension and name
    let extension, filename;
    if (fileType === 'resume') {
      extension = (file as File).name?.split('.').pop() || 'pdf';
      filename = `${jobId}/${fileType}-${sanitizedEmail}-${timestamp}.${extension}`;
    } else {
      // For video files, handle Safari's QuickTime format vs. Chrome/Firefox's WebM
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      extension = isSafari ? 'mp4' : 'webm';
      filename = `${jobId}/${fileType}-${sanitizedEmail}-${timestamp}.${extension}`;
    }
    
    console.log(`Uploading ${fileType} as: ${filename}`);
    
    toast.info(`Uploading ${fileType}...`);
    
    // Upload file to Supabase storage
    const { data, error } = await supabase.storage
      .from(fileType)
      .upload(filename, file, {
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
      .getPublicUrl(filename);
    
    console.log(`Public URL for ${fileType}:`, publicUrl);
    toast.success(`${fileType} uploaded successfully`);
    
    return publicUrl;
  } catch (error: any) {
    console.error(`Error uploading ${fileType}:`, error);
    toast.error(`Failed to upload ${fileType}: ${error.message || 'Unknown error'}`);
    throw error;
  }
};
