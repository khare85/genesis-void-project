
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useVideoRecorder } from '@/hooks/useVideoRecorder';
import { uploadBlobToStorage } from '@/services/fileStorage';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Video, Play, StopCircle, RefreshCw, Check, Loader2 } from 'lucide-react';
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
  const [isUploading, setIsUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(initialUrl);
  const maxDuration = 30; // 30 seconds
  
  const {
    isRecording,
    recordingTime,
    recordedBlob,
    videoURL,
    isLoading,
    error,
    videoRef,
    startRecording,
    stopRecording,
    resetRecording,
    stream,
  } = useVideoRecorder({ maxDuration });

  const handleUploadVideo = async () => {
    if (!recordedBlob) {
      toast.error('Please record a video first');
      return;
    }

    setIsUploading(true);
    try {
      const fileName = `video_intro_${Date.now()}.webm`;
      // Upload to storage
      const filePath = await uploadBlobToStorage(recordedBlob, 'videos', fileName, 'video/webm');

      if (filePath) {
        setVideoUrl(filePath);
        toast.success('Video uploaded successfully');
        onComplete(recordedBlob, filePath);
      }
    } catch (error) {
      console.error('Video upload error:', error);
      toast.error('Failed to upload video');
    } finally {
      setIsUploading(false);
    }
  };

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

  const handleRetryRecording = () => {
    resetRecording();
  };

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
          videoRef={videoRef}
          videoURL={videoURL || ''}
          isRecording={isRecording}
          isLoading={isLoading}
          error={error}
          recordingTime={recordingTime}
          onRetry={handleRetryRecording}
          stream={stream}
        />
      </motion.div>
      
      <motion.div 
        variants={itemVariants} 
        className="flex flex-col items-center justify-center gap-4"
      >
        {!videoUrl ? (
          <>
            {!isRecording && !videoURL ? (
              <Button
                onClick={startRecording}
                className="bg-primary hover:bg-primary/90 px-6"
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading Camera...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Start Recording
                  </>
                )}
              </Button>
            ) : isRecording ? (
              <div className="space-y-4">
                <p className="text-center text-sm font-medium">
                  Recording: {recordingTime}s / {maxDuration}s
                </p>
                <Button onClick={stopRecording} variant="destructive" size="lg">
                  <StopCircle className="mr-2 h-4 w-4" />
                  Stop Recording
                </Button>
              </div>
            ) : recordedBlob ? (
              <div className="flex flex-col items-center gap-4">
                <div className="flex gap-3">
                  <Button onClick={resetRecording} variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Record Again
                  </Button>
                  <Button 
                    onClick={handleUploadVideo} 
                    className="bg-primary hover:bg-primary/90"
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Video className="mr-2 h-4 w-4" />
                        Save Video
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : null}
          </>
        ) : (
          <div className="w-full space-y-4">
            <div className="border rounded-lg p-6 bg-green-50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">Video uploaded successfully</h3>
                  <p className="text-sm text-muted-foreground">
                    Your 30-second introduction is ready
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button 
                onClick={() => onComplete(recordedBlob, videoUrl)}
                className="bg-primary hover:bg-primary/90"
              >
                Continue
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

// Export a helper function to upload videos
export const uploadBlobToStorage = async (
  blob: Blob,
  bucketName: string,
  filePath: string,
  contentType: string = 'video/webm'
): Promise<string> => {
  try {
    // Create a File object from the Blob with the correct MIME type
    const file = new File([blob], filePath, { type: contentType });
    
    // Use the existing file upload function
    return await uploadFileToStorage(file, bucketName, filePath, '');
  } catch (error) {
    console.error('Error in uploadBlobToStorage:', error);
    throw error;
  }
};

export default VideoStep;
