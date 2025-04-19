
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Job } from '@/types/job';
import type { ApplicationFormData } from '@/components/application/schemas/applicationFormSchema';

export const useJobApplication = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [resumeStorageUrl, setResumeStorageUrl] = useState('');
  const [videoStorageUrl, setVideoStorageUrl] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', id)
          .eq('status', 'active')
          .single();
        
        if (error) {
          console.error("Error fetching job:", error);
          toast.error("Failed to load job details");
          return;
        }
        
        setJob(data);
      } catch (err) {
        console.error("Error in job fetch:", err);
        toast.error("An error occurred. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchJob();
    }
  }, [id]);

  // Check if storage buckets exist
  useEffect(() => {
    const checkBuckets = async () => {
      try {
        const { data: buckets, error } = await supabase.storage.listBuckets();
        
        if (error) {
          console.error("Error checking buckets:", error);
          return;
        }
        
        const resumeBucketExists = buckets?.some(bucket => bucket.name === 'resume');
        const videoBucketExists = buckets?.some(bucket => bucket.name === 'video');
        
        if (!resumeBucketExists || !videoBucketExists) {
          console.warn("Storage buckets not found. Application uploads may fail.");
        }
      } catch (err) {
        console.error("Error checking storage buckets:", err);
      }
    };
    
    checkBuckets();
  }, []);

  return {
    job,
    isLoading,
    isUploading,
    setIsUploading,
    isUploadingVideo,
    setIsUploadingVideo,
    resumeStorageUrl,
    setResumeStorageUrl,
    videoStorageUrl,
    setVideoStorageUrl,
  };
};
