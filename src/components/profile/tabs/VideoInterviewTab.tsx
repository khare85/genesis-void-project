
import React, { useState } from 'react';
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import VideoRecorder from '@/components/application/VideoRecorder';
import { Button } from "@/components/ui/button";
import { Video } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface VideoInterviewTabProps {
  videoInterview: {
    videoStorageUrl: string;
  } | null;
  isEditing: boolean;
  form?: any;
}

const VideoInterviewTab: React.FC<VideoInterviewTabProps> = ({ videoInterview, isEditing, form }) => {
  const { toast } = useToast();
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  
  const handleVideoRecorded = (blob: Blob | null) => {
    if (!blob || !form) return;
    
    setIsUploadingVideo(true);
    
    // Simulate uploading the video to a storage service
    setTimeout(() => {
      const mockVideoUrl = `video-introduction-${Date.now()}.webm`;
      
      form.setValue('videoInterview', { 
        videoStorageUrl: mockVideoUrl 
      });
      
      setIsUploadingVideo(false);
      
      toast({
        title: "Video uploaded",
        description: "Your video introduction has been saved.",
      });
    }, 1500);
  };
  
  return (
    <>
      <div className="flex justify-between items-center mb-5">
        <div>
          <h3 className="text-lg font-medium">Video Introduction</h3>
          <p className="text-muted-foreground">Record a short video introduction to showcase your personality</p>
        </div>
      </div>
      
      <div className="space-y-6">
        {isEditing ? (
          <div className="space-y-4">
            {form && !videoInterview?.videoStorageUrl && (
              <Button
                type="button"
                onClick={() => {}}
                className="w-full py-8 gap-2"
              >
                <Video className="h-5 w-5" />
                Start recording Video Introduction
              </Button>
            )}
            
            {form && (
              <FormField
                control={form.control}
                name="videoInterview"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <VideoRecorder
                        onVideoRecorded={handleVideoRecorded}
                        isUploadingVideo={isUploadingVideo}
                        videoStorageUrl={videoInterview?.videoStorageUrl || ""}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
          </div>
        ) : (
          <div>
            {videoInterview && videoInterview.videoStorageUrl ? (
              <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden">
                <video 
                  className="w-full h-full object-cover" 
                  src={videoInterview.videoStorageUrl} 
                  controls
                />
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg bg-muted/20">
                <p className="text-muted-foreground">No video introduction available.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default VideoInterviewTab;
