
import { supabase } from '@/integrations/supabase/client';

export const uploadFileToStorage = async (
  file: File | Blob,
  fileType: 'resume' | 'video',
  userEmail: string,
  jobId: string
): Promise<string> => {
  try {
    const timestamp = Date.now();
    const sanitizedEmail = userEmail.replace(/[^a-zA-Z0-9]/g, '-');
    const extension = fileType === 'resume' 
      ? (file as File).name?.split('.').pop() || 'pdf' 
      : 'webm';
    const filename = `${fileType}-${sanitizedEmail}-${timestamp}.${extension}`;
    // Ensure bucket and path are correct
    const bucketName = fileType === 'resume' ? 'resume' : 'video';
    const filePath = `${jobId}/${filename}`;

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error(`Error uploading to bucket ${bucketName} at path ${filePath}:`, error);
      throw error;
    }

    const { data: getUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    // Debug logging for troubleshooting file upload issues
    console.log(`[uploadFileToStorage] Uploaded ${fileType} for user ${userEmail} to ${bucketName}/${filePath}:`, getUrlData?.publicUrl);

    return getUrlData?.publicUrl || '';
  } catch (error) {
    console.error(`Error uploading ${fileType}:`, error);
    throw error;
  }
};
