
import React, { useEffect } from 'react';
import { Loader2, Video } from 'lucide-react';

interface VideoPreviewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  videoURL: string;
  isRecording: boolean;
  isLoading: boolean;
  error: string | null;
  recordingTime: number;
  onRetry: () => void;
  stream: MediaStream | null;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({
  videoRef,
  videoURL,
  isRecording,
  isLoading,
  error,
  recordingTime,
  onRetry,
  stream,
}) => {
  // Effect to handle video object URLs in Safari
  useEffect(() => {
    if (videoRef.current) {
      if (isRecording && stream) {
        videoRef.current.srcObject = stream;
      } else if (videoURL) {
        videoRef.current.srcObject = null;
        videoRef.current.src = videoURL;
      }
    }
  }, [videoURL, isRecording, stream, videoRef]);

  return (
    <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden mb-4 flex items-center justify-center relative">
      {isLoading ? (
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="text-sm font-medium">Loading camera...</p>
        </div>
      ) : error ? (
        <div className="text-center p-4">
          <Video className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-sm font-medium text-red-500">{error}</p>
          <button
            onClick={onRetry}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      ) : !videoURL && !isRecording ? (
        <div className="text-center">
          <Video className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm font-medium">Your video will appear here</p>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            muted={isRecording}
            controls={!!videoURL && !isRecording}
          />
          {isRecording && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
              <span className="animate-pulse mr-1.5 h-2 w-2 rounded-full bg-white" />
              Recording: {recordingTime}s / 30s
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VideoPreview;
