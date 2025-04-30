
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { AlertTriangle, Video, Link as LinkIcon } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import VideoRecorder from "@/components/application/VideoRecorder";

interface VideoInterviewProps {
  videoInterview: any | null;
  isEditing: boolean;
  form?: any;
}

const VideoInterviewTab: React.FC<VideoInterviewProps> = ({ videoInterview: initialVideoInterview, isEditing, form }) => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoStorageUrl, setVideoStorageUrl] = useState('');
  const [currentVideoInterview, setCurrentVideoInterview] = useState(initialVideoInterview);
  
  // Reset to initial video when isEditing changes
  useEffect(() => {
    if (!isEditing) {
      setCurrentVideoInterview(initialVideoInterview);
      setVideoStorageUrl('');
      setVideoBlob(null);
    }
  }, [isEditing, initialVideoInterview]);
  
  const handleVideoRecorded = (blob: Blob | null) => {
    if (blob) {
      setVideoBlob(blob);
      simulateVideoUpload(blob);
    }
  };

  const simulateVideoUpload = (blob: Blob) => {
    setIsUploadingVideo(true);
    
    // Simulate upload process for demo purposes
    setTimeout(() => {
      setIsUploadingVideo(false);
      
      // Generate a mock video URL and create object URL for preview
      const mockVideoUrl = "https://example.com/video-" + Date.now() + ".webm";
      const localVideoUrl = URL.createObjectURL(blob);
      setVideoStorageUrl(mockVideoUrl);
      
      // Create a temporary video interview object for preview
      const newVideoInterview = {
        url: localVideoUrl, // Use local blob URL for immediate preview
        remoteUrl: mockVideoUrl, // Store remote URL for database
        thumbnail: "https://example.com/thumbnail-" + Date.now() + ".jpg",
        duration: 30,
        createdAt: new Date().toISOString()
      };
      
      // Update local state for immediate display
      setCurrentVideoInterview(newVideoInterview);
      
      // Update form data for saving when form is submitted
      if (form) {
        form.setValue('videoInterview', {
          url: mockVideoUrl,
          thumbnail: newVideoInterview.thumbnail,
          duration: newVideoInterview.duration,
          createdAt: newVideoInterview.createdAt
        });
      }
      
      toast({
        title: "Video successfully recorded",
        description: "Your 30-second introduction has been saved."
      });
    }, 1500);
  };
  
  // Check if video has already been recorded/uploaded
  const hasVideo = currentVideoInterview !== null;
  
  // Reset video recording if user wants to record again in edit mode
  const handleResetVideo = () => {
    setCurrentVideoInterview(null);
    setVideoStorageUrl('');
    setVideoBlob(null);
    
    if (form) {
      form.setValue('videoInterview', null);
    }
  };

  return (
    <div>
      <div className="mb-5">
        <h3 className="text-lg font-medium">Video Introduction</h3>
        <p className="text-muted-foreground">
          Record a brief 30-second video introducing yourself to potential employers
        </p>
      </div>
      
      {hasVideo && !isEditing ? (
        <div>
          <Card className="overflow-hidden">
            <div className="relative aspect-video bg-black flex items-center justify-center max-h-[240px]">
              {/* Video player */}
              <video 
                controls
                className="w-full h-full"
                poster={currentVideoInterview.thumbnail}
                src={currentVideoInterview.url}
              />
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">My Video Introduction</h4>
                  <p className="text-sm text-muted-foreground">
                    Duration: 30 seconds
                  </p>
                </div>
                <Button variant="outline" size="sm" className="gap-1.5" asChild>
                  <a href={currentVideoInterview.url} target="_blank" rel="noopener noreferrer">
                    <LinkIcon className="h-4 w-4" />
                    Watch
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Show video recorder for recording new video */}
          {(isEditing || !hasVideo) && (
            <>
              {/* Show reset button if already recorded a video in edit mode */}
              {isEditing && videoBlob && (
                <div className="flex justify-end mb-2">
                  <Button variant="outline" size="sm" onClick={handleResetVideo}>
                    Record Again
                  </Button>
                </div>
              )}
              
              {/* Only show video recorder if no video has been recorded or user clicked reset */}
              {(!videoBlob || !currentVideoInterview) && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <VideoRecorder
                        onVideoRecorded={handleVideoRecorded}
                        isUploadingVideo={isUploadingVideo}
                        setIsUploadingVideo={setIsUploadingVideo}
                        videoStorageUrl={videoStorageUrl}
                        setVideoStorageUrl={setVideoStorageUrl}
                        maxDuration={30}
                        autoStart={false}
                        isAIInterview={false}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Show the recorded video in edit mode */}
              {isEditing && videoBlob && currentVideoInterview && (
                <Card className="overflow-hidden mt-4">
                  <div className="relative aspect-video bg-black flex items-center justify-center max-h-[240px]">
                    <video 
                      controls
                      className="w-full h-full"
                      src={currentVideoInterview.url}
                    />
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-green-600 font-medium">
                      Video recorded successfully! This will be saved when you submit your profile.
                    </p>
                  </CardContent>
                </Card>
              )}
            </>
          )}
          
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-md flex gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900">
              <p className="font-medium">Video Introduction Tips</p>
              <ul className="list-disc pl-4 mt-1 space-y-1">
                <li>Keep your introduction concise (30 seconds)</li>
                <li>Mention your key skills and experience</li>
                <li>Explain what you're looking for in your next role</li>
              </ul>
            </div>
          </div>
          
          {form && (
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="videoIntroductionScript"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea 
                        placeholder="Write a script for your video introduction..." 
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoInterviewTab;
