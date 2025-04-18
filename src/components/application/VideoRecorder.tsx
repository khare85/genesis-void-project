
import React from 'react';
import { Button } from '@/components/ui/button';
import { Video, Loader2, CheckCircle } from 'lucide-react';
import { useVideoRecorder } from '@/hooks/useVideoRecorder';
import VideoPreview from './VideoPreview';

interface VideoRecorderProps {
  onVideoRecorded: (blob: Blob | null) => void;
  isUploadingVideo: boolean;
  videoStorageUrl: string;
}

const VideoRecorder: React.FC<VideoRecorderProps> = ({
  onVideoRecorded,
  isUploadingVideo,
  videoStorageUrl,
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
  } = useVideoRecorder();

  const handleVideoRecorded = (blob: Blob | null) => {
    onVideoRecorded(blob);
  };

  React.useEffect(() => {
    if (recordedBlob) {
      handleVideoRecorded(recordedBlob);
    }
  }, [recordedBlob]);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Video Introduction (30 seconds)</h2>
      <div className="border rounded-lg p-6">
        <div className="mb-4 text-sm text-muted-foreground">
          Record a brief introduction about yourself and why you're interested in this position.
        </div>

        <VideoPreview
          videoRef={videoRef}
          videoURL={videoURL}
          isRecording={isRecording}
          isLoading={isLoading}
          error={error}
          recordingTime={recordingTime}
          onRetry={startRecording}
        />

        <div className="flex gap-3 justify-center">
          {!isRecording && !videoURL ? (
            <Button
              type="button"
              onClick={startRecording}
              className="bg-primary hover:bg-primary/90"
            >
              <Video className="h-4 w-4 mr-2" />
              Start Recording
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
