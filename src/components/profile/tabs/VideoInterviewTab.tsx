
import React, { useState } from 'react';
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import VideoRecorder from '@/components/application/VideoRecorder';
import { Button } from "@/components/ui/button";
import { Trash2 } from 'lucide-react';
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
      // In a real application, you would upload the blob to a storage service
      // and get back a URL to the stored video
      const mockVideoUrl = `video-interview-${Date.now()}.webm`;
      
      form.setValue('videoInterview', { 
        videoStorageUrl: mockVideoUrl 
      });
      
      setIsUploadingVideo(false);
      
      toast({
        title: "Video uploaded",
        description: "Your video interview has been saved.",
      });
    }, 1500);
  };
  
  const handleDeleteVideo = () => {
    if (form) {
      form.setValue('videoInterview', null);
      
      toast({
        title: "Video deleted",
        description: "Your video interview has been removed.",
      });
    }
  };
  
  return (
    <>
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-medium">Video Introduction</h3>
        {isEditing && videoInterview && videoInterview.videoStorageUrl && (
          <Button 
            size="sm" 
            variant="outline" 
            className="gap-1 text-destructive" 
            onClick={handleDeleteVideo}
          >
            <Trash2 className="h-4 w-4" /> Delete Video
          </Button>
        )}
      </div>
      
      <div className="space-y-6">
        {isEditing ? (
          <div className="space-y-4">
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
                <p className="text-muted-foreground">No video interview available.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default VideoInterviewTab;
