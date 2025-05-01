
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import VideoRecorder from './VideoRecorder';

interface AIInterviewSessionProps {
  open: boolean;
  onClose: () => void;
  agentId?: string; // Agent ID parameter
  candidateName?: string; // Optional candidate name for personalization
  jobTitle?: string; // Optional job title for context
}

const AIInterviewSession: React.FC<AIInterviewSessionProps> = ({ 
  open, 
  onClose,
  agentId = "EVQJtCNSo0L6uHQnImQu", // Default agent ID if none provided
  candidateName,
  jobTitle
}) => {
  const [countdown, setCountdown] = useState(5);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoStorageUrl, setVideoStorageUrl] = useState('');
  const [isSessionCompleted, setIsSessionCompleted] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (open && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      // Start video recording automatically after countdown
      handleStartSession();
    }
    return () => clearInterval(timer);
  }, [countdown, open]);

  const handleStartSession = async () => {
    try {
      // Video recording will start automatically through VideoRecorder component
      console.log("Starting interview session");
      if (candidateName) {
        console.log(`Interview for candidate: ${candidateName}`);
      }
      if (jobTitle) {
        console.log(`Interview for position: ${jobTitle}`);
      }
    } catch (error) {
      console.error("Error starting interview session:", error);
      toast.error("Failed to start interview session");
    }
  };

  const handleVideoRecorded = (blob: Blob | null) => {
    if (!blob) return;
    console.log("Video recorded, size:", blob.size);
    
    // In a real implementation, we would upload the video to storage
    // and associate it with the candidate's record
    setIsUploadingVideo(true);
    setTimeout(() => {
      setIsUploadingVideo(false);
      setVideoStorageUrl("mock-url-for-recorded-video");
      setIsSessionCompleted(true);
      toast.success("Interview completed successfully");
    }, 2000);
  };

  const handleCompleteInterview = () => {
    setIsSessionCompleted(false);
    onClose();
  };

  // Add ElevenLabs widget to head when component mounts
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://elevenlabs.io/convai-widget/index.js';
    script.async = true;
    script.type = 'text/javascript';
    document.head.appendChild(script);

    return () => {
      // Check if the script is still in the document before removing
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[80vh] flex flex-col">
        {isSessionCompleted ? (
          <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl font-bold mb-4">Interview Completed</h2>
            <p className="text-center mb-6">
              Thank you for completing the AI interview. Your responses have been recorded.
            </p>
            <Button onClick={handleCompleteInterview}>Close</Button>
          </div>
        ) : (
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
            <div className="bg-muted rounded-lg p-4">
              {countdown === 0 && (
                <div className="h-full">
                  <elevenlabs-convai agent-id={agentId}></elevenlabs-convai>
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AIInterviewSession;
