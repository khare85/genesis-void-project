
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
    
    const { data, error } = await supabase.storage
      .from('applications')
      .upload(`${jobId}/${filename}`, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      throw error;
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from('applications')
      .getPublicUrl(`${jobId}/${filename}`);
    
    return publicUrl;
  } catch (error) {
    console.error(`Error uploading ${fileType}:`, error);
    throw error;
  }
};
