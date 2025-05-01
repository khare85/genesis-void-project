
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, StopCircle, RefreshCw, Video, Loader2 } from 'lucide-react';

interface VideoStepControlsProps {
  recorder: {
    isRecording: boolean;
    recordingTime: number;
    videoURL: string | null;
    recordedBlob: Blob | null;
    resetRecording: () => void;
    startRecording: () => void;
    stopRecording: () => void;
    isLoading: boolean;
  };
  isUploading: boolean;
  onUpload: () => void;
}

const VideoStepControls: React.FC<VideoStepControlsProps> = ({ 
  recorder, 
  isUploading, 
  onUpload 
}) => {
  const { isRecording, recordingTime, videoURL, recordedBlob, isLoading } = recorder;
  
  if (!isRecording && !videoURL) {
    return (
      <Button
        onClick={recorder.startRecording}
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
    );
  } 
  
  if (isRecording) {
    return (
      <div className="space-y-4">
        <p className="text-center text-sm font-medium">
          Recording: {recordingTime}s / 30s
        </p>
        <Button onClick={recorder.stopRecording} variant="destructive" size="lg">
          <StopCircle className="mr-2 h-4 w-4" />
          Stop Recording
        </Button>
      </div>
    );
  } 
  
  if (recordedBlob) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-3">
          <Button onClick={recorder.resetRecording} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Record Again
          </Button>
          <Button 
            onClick={onUpload} 
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
    );
  }
  
  return null;
};

export default VideoStepControls;
