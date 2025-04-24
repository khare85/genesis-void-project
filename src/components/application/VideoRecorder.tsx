
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Video, Loader2, CheckCircle } from 'lucide-react';
import { useVideoRecorder } from '@/hooks/useVideoRecorder';
import VideoPreview from './VideoPreview';
import { toast } from 'sonner';

interface VideoRecorderProps {
  onVideoRecorded: (blob: Blob | null) => void;
  isUploadingVideo: boolean;
  setIsUploadingVideo?: (isUploading: boolean) => void;
  videoStorageUrl: string;
  setVideoStorageUrl?: (url: string) => void;
  autoStart?: boolean;
  maxDuration?: number;
  isAIInterview?: boolean;
}

const VideoRecorder: React.FC<VideoRecorderProps> = ({
  onVideoRecorded,
  isUploadingVideo,
  setIsUploadingVideo,
  videoStorageUrl,
  setVideoStorageUrl,
  autoStart = false,
  maxDuration = 30,
  isAIInterview = false,
}) => {
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

  useEffect(() => {
    if (autoStart) {
      handleStartRecording();
    }
  }, [autoStart]);

  useEffect(() => {
    if (recordedBlob) {
      console.log("Video recorded, blob size:", recordedBlob.size, "type:", recordedBlob.type);
      onVideoRecorded(recordedBlob);
    }
  }, [recordedBlob, onVideoRecorded]);

  const handleRetry = () => {
    resetRecording();
    startRecording();
  };

  const handleStartRecording = async () => {
    try {
      await startRecording();
    } catch (err) {
      console.error("Error starting recording:", err);
      toast.error("Failed to start recording. Please try again.");
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">
        {isAIInterview ? 'AI Video Interview (30 minutes)' : 'Video Introduction (30 seconds)'}
      </h2>
      <div className="border rounded-lg p-6">
        <div className="mb-4 text-sm text-muted-foreground">
          {isAIInterview 
            ? 'Participate in an AI-powered interview. Speak naturally and clearly when answering questions.'
            : 'Record a brief introduction about yourself and why you're interested in this position.'}
        </div>

        <VideoPreview
          videoRef={videoRef}
          videoURL={videoURL}
          isRecording={isRecording}
          isLoading={isLoading}
          error={error}
          recordingTime={recordingTime}
          onRetry={handleRetry}
          stream={stream}
        />

        <div className="flex gap-3 justify-center">
          {!isRecording && !videoURL ? (
            <Button
              type="button"
              onClick={handleStartRecording}
              className="bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Video className="h-4 w-4 mr-2" />
                  Start Recording
                </>
              )}
            </Button>
          ) : isRecording ? (
            <Button type="button" onClick={stopRecording} variant="destructive">
              Stop Recording
            </Button>
          ) : (
            <Button type="button" onClick={resetRecording} variant="outline">
              Record Again
            </Button>
          )}
        </div>

        {isUploadingVideo && (
          <p className="text-xs text-blue-600 mt-4 flex items-center justify-center">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" /> Uploading video...
          </p>
        )}

        {videoStorageUrl && (
          <p className="text-xs text-green-600 mt-4 flex items-center justify-center">
            <CheckCircle className="h-3 w-3 mr-1" /> Video uploaded successfully
          </p>
        )}
      </div>
    </div>
  );
};

export default VideoRecorder;
