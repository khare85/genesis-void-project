
import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { uploadFileToStorage } from '@/services/fileStorage';
import { toast } from 'sonner';
import { useVideoStepLogic } from '@/hooks/onboarding/useVideoStepLogic';
import VideoPreview from '../application/VideoPreview';

interface VideoStepProps {
  onComplete: (videoBlob: Blob | null, videoUrl: string | null) => void;
  initialBlob?: Blob | null;
  initialUrl?: string | null;
}

const VideoStep: React.FC<VideoStepProps> = ({ 
  onComplete, 
  initialBlob = null,
  initialUrl = null 
}) => {
  const {
    isUploading,
    videoUrl,
    setVideoUrl,
    handleUploadVideo,
    containerVariants,
    itemVariants,
    recorder
  } = useVideoStepLogic(initialBlob, initialUrl, onComplete);

  return (
    <motion.div 
      className="max-w-2xl mx-auto px-8 py-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold mb-2">Record a Video Introduction</h2>
        <p className="text-muted-foreground mb-6">
          Create a 30-second video introduction to showcase your personality and skills to potential employers
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-6">
        <VideoPreview
          videoRef={recorder.videoRef}
          videoURL={recorder.videoURL || ''}
          isRecording={recorder.isRecording}
          isLoading={recorder.isLoading}
          error={recorder.error}
          recordingTime={recorder.recordingTime}
          onRetry={recorder.resetRecording}
          stream={recorder.stream}
        />
      </motion.div>
      
      <motion.div 
        variants={itemVariants} 
        className="flex flex-col items-center justify-center gap-4"
      >
        {!videoUrl ? (
          <VideoStepControls 
            recorder={recorder}
            isUploading={isUploading}
            onUpload={handleUploadVideo}
          />
        ) : (
          <VideoUploaded videoUrl={videoUrl} onComplete={onComplete} recordedBlob={recorder.recordedBlob} />
        )}
      </motion.div>
    </motion.div>
  );
};

export default VideoStep;
