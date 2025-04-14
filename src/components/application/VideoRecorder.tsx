
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Video, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useVideoRecording } from '@/hooks/useVideoRecording';

interface VideoRecorderProps {
  onVideoRecorded: (blob: Blob | null) => void;
  isUploadingVideo: boolean;
  videoStorageUrl: string;
}

const VideoRecorder: React.FC<VideoRecorderProps> = ({
  onVideoRecorded,
  isUploadingVideo,
  videoStorageUrl
}) => {
  const {
    isRecording,
    recordingTime,
    recordedBlob,
    videoURL,
    videoRef,
    hasError,
    errorMessage,
    startRecording,
    stopRecording,
    resetRecording,
    initializeCamera
  } = useVideoRecording(30); // 30 seconds max recording

  // Update parent component when blob changes
  useEffect(() => {
    onVideoRecorded(recordedBlob);
  }, [recordedBlob, onVideoRecorded]);

  // Pre-initialize camera when component loads
  useEffect(() => {
    // Initialize camera but don't start recording
    const preloadCamera = async () => {
      if (!videoURL && !isRecording) {
        await initializeCamera();
      }
    };
    
    preloadCamera();
    
    // Clean up on unmount (taken care of by the hook)
  }, [initializeCamera, isRecording, videoURL]);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Video Introduction (30 seconds)</h2>
      <div className="border rounded-lg p-6">
        <div className="mb-4 text-sm text-muted-foreground">
          Record a brief introduction about yourself and why you're interested in this position.
        </div>
        
        {/* Video display area */}
        <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden mb-4 flex items-center justify-center relative">
          {!videoURL && !isRecording ? (
            <div className="text-center">
              <Video className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-medium">Your video will appear here</p>
              {hasError && (
                <div className="mt-2 text-red-500 flex items-center justify-center text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errorMessage || 'Error accessing camera'}
                </div>
              )}
            </div>
          ) : (
            <>
              <video 
                ref={videoRef} 
                className="w-full h-full object-cover" 
                autoPlay={true}
                playsInline={true}
                muted={isRecording}
                src={videoURL || undefined} 
                controls={!!videoURL && !isRecording}
              />
              {isRecording && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                  <span className="animate-pulse mr-1.5 h-2 w-2 rounded-full bg-white"></span>
                  Recording: {recordingTime}s / 30s
                </div>
              )}
              {isUploadingVideo && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-white text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                    <p>Uploading video...</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="flex gap-3 justify-center">
          {!isRecording && !videoURL ? (
            <Button 
              type="button"
              onClick={startRecording}
              className="bg-[#3054A5] hover:bg-[#264785]"
            >
              <Video className="h-4 w-4 mr-2" />
              Start Recording
            </Button>
          ) : isRecording ? (
            <Button 
              type="button"
              onClick={stopRecording}
              variant="destructive"
            >
              Stop Recording
            </Button>
          ) : (
            <Button 
              type="button"
              onClick={resetRecording}
              variant="outline"
            >
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
