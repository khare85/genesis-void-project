
import React, { useEffect, useState } from 'react';
import VideoRecorder from './VideoRecorder';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useVideoRecorder } from '@/hooks/useVideoRecorder';

interface AIInterviewSessionProps {
  open: boolean;
  onClose: () => void;
}

const AIInterviewSession: React.FC<AIInterviewSessionProps> = ({ open, onClose }) => {
  const [countdown, setCountdown] = useState(5);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoStorageUrl, setVideoStorageUrl] = useState('');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (open && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      handleStartSession();
    }
    return () => clearInterval(timer);
  }, [countdown, open]);

  const handleStartSession = async () => {
    try {
      console.log("Starting interview session");
    } catch (error) {
      console.error("Error starting interview session:", error);
    }
  };

  const handleVideoRecorded = (blob: Blob | null) => {
    if (!blob) return;
    console.log("Video recorded, size:", blob.size);
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://elevenlabs.io/convai-widget/index.js';
    script.async = true;
    script.type = 'text/javascript';
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[80vh] flex flex-col">
        <div className="flex-1 grid grid-cols-2 gap-4">
          <div className="relative">
            {countdown > 0 ? (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
                <div className="text-6xl font-bold text-primary">{countdown}</div>
              </div>
            ) : null}
            <VideoRecorder
              onVideoRecorded={handleVideoRecorded}
              isUploadingVideo={isUploadingVideo}
              videoStorageUrl={videoStorageUrl}
              autoStart={countdown === 0}
              maxDuration={1800}
              isAIInterview={true}
            />
          </div>
          <div className="bg-muted rounded-lg p-4 relative">
            {countdown === 0 && (
              <div className="absolute inset-0 rounded-lg overflow-hidden">
                <elevenlabs-convai agent-id="EVQJtCNSo0L6uHQnImQu" className="h-full"></elevenlabs-convai>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIInterviewSession;
