
import { useState } from 'react';
import { useVideoRecorder } from '@/hooks/useVideoRecorder';
import { uploadFileToStorage } from '@/services/fileStorage';
import { toast } from 'sonner';

export const useVideoStepLogic = (
  initialBlob: Blob | null, 
  initialUrl: string | null,
  onComplete: (videoBlob: Blob | null, videoUrl: string | null) => void
) => {
  const [isUploading, setIsUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(initialUrl);
  const maxDuration = 30; // 30 seconds
  
  const recorder = useVideoRecorder({ maxDuration });

  const handleUploadVideo = async () => {
    if (!recorder.recordedBlob) {
      toast.error('Please record a video first');
      return;
    }

    setIsUploading(true);
    try {
      const fileName = `video_intro_${Date.now()}.webm`;
      // Create a File object from the Blob with the correct MIME type
      const videoFile = new File([recorder.recordedBlob], fileName, { type: 'video/webm' });
      
      // Upload to storage using the correct function name
      const filePath = await uploadFileToStorage(videoFile, 'video', fileName, '');

      if (filePath) {
        setVideoUrl(filePath);
        toast.success('Video uploaded successfully');
      }
    } catch (error) {
      console.error('Video upload error:', error);
      toast.error('Failed to upload video');
    } finally {
      setIsUploading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return {
    isUploading,
    videoUrl,
    setVideoUrl,
    handleUploadVideo,
    containerVariants,
    itemVariants,
    recorder
  };
};
