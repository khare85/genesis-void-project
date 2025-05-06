
import React, { useEffect, useState } from 'react';
import VideoRecorder from './VideoRecorder';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useConversation } from '@11labs/react';

interface AIInterviewSessionProps {
  open: boolean;
  onClose: () => void;
  agentId?: string;
}

const AIInterviewSession: React.FC<AIInterviewSessionProps> = ({ 
  open, 
  onClose,
  agentId = "EVQJtCNSo0L6uHQnImQu" // Default agent ID if none provided
}) => {
  const [countdown, setCountdown] = useState(5);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoStorageUrl, setVideoStorageUrl] = useState('');
  
  // Initialize ElevenLabs conversation
  const conversation = useConversation({
    onConnect: () => console.log("Connected to ElevenLabs AI"),
    onDisconnect: () => console.log("Disconnected from ElevenLabs AI"),
    onMessage: (message) => console.log("Message from AI:", message),
    onError: (error) => console.error("ElevenLabs error:", error)
  });

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
      if (countdown === 0) {
        // Start ElevenLabs conversation when video starts
        await conversation.startSession({ agentId });
        console.log("Started interview session with agent:", agentId);
      }
    } catch (error) {
      console.error("Error starting interview session:", error);
    }
  };

  const handleVideoRecorded = (blob: Blob | null) => {
    if (!blob) return;
    console.log("Video recorded, size:", blob.size);
  };

  // Clean up the conversation when the component unmounts or dialog closes
  useEffect(() => {
    return () => {
      if (conversation.status === "connected") {
        conversation.endSession();
      }
    };
  }, [conversation]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        // End conversation when dialog closes
        if (conversation.status === "connected") {
          conversation.endSession();
        }
        onClose();
      }
    }}>
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
          <div className="bg-muted rounded-lg p-4 flex flex-col justify-center items-center">
            {countdown === 0 && (
              <div className="h-full w-full flex flex-col">
                <div className="text-lg font-medium mb-4">
                  {conversation.isSpeaking ? "AI is speaking..." : "AI is listening..."}
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <div className={`w-16 h-16 rounded-full ${conversation.isSpeaking ? 'bg-green-500' : 'bg-blue-500'} flex items-center justify-center text-white`}>
                    {conversation.isSpeaking ? "🔊" : "🎤"}
                  </div>
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
