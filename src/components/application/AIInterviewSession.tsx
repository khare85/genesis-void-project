
import React, { useEffect, useState } from 'react';
import VideoRecorder from './VideoRecorder';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useVideoRecorder } from '@/hooks/useVideoRecorder';
import { useConversation } from '@11labs/react';

interface AIInterviewSessionProps {
  open: boolean;
  onClose: () => void;
}

const AIInterviewSession: React.FC<AIInterviewSessionProps> = ({ open, onClose }) => {
  const [countdown, setCountdown] = useState(5);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoStorageUrl, setVideoStorageUrl] = useState('');
  
  const conversation = useConversation({
    overrides: {
      agent: {
        prompt: {
          prompt: "You are an AI interviewer conducting a technical interview. Be professional and thorough in your questions.",
        },
        firstMessage: "Hello! I'll be conducting your technical interview today. Let's begin with a brief introduction about yourself.",
        language: "en",
      },
      tts: {
        voiceId: "Charlie" // Using a professional male voice
      },
    },
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (open && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      // Start both video recording and ElevenLabs conversation
      handleStartSession();
    }
    return () => clearInterval(timer);
  }, [countdown, open]);

  const handleStartSession = async () => {
    try {
      await conversation.startSession({
        agentId: "your_agent_id_here" // Replace with your actual agent ID
      });
      // Video recording will start automatically through VideoRecorder component
    } catch (error) {
      console.error("Error starting interview session:", error);
    }
  };

  const handleVideoRecorded = (blob: Blob | null) => {
    if (!blob) return;
    console.log("Video recorded, size:", blob.size);
  };

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
            />
          </div>
          <div className="bg-muted rounded-lg p-4">
            {/* ElevenLabs conversation widget will be rendered here */}
            {countdown === 0 && (
              <div className="h-full flex flex-col">
                <div className="flex-1 overflow-y-auto">
                  {/* Conversation messages will appear here */}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIInterviewSession;
