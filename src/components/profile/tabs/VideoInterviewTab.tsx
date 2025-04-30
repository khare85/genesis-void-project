
import React, { useState } from 'react';
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

const VideoInterviewTab: React.FC<VideoInterviewProps> = ({ videoInterview, isEditing, form }) => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoStorageUrl, setVideoStorageUrl] = useState('');
  
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
      
      // Generate a mock video URL
      const mockVideoUrl = "https://example.com/video-" + Date.now() + ".webm";
      setVideoStorageUrl(mockVideoUrl);
      
      // Update form data
      if (form) {
        form.setValue('videoInterview', {
          url: mockVideoUrl,
          thumbnail: "https://example.com/thumbnail-" + Date.now() + ".jpg",
          duration: 30,
          createdAt: new Date().toISOString()
        });
      }
      
      toast({
        title: "Video successfully recorded",
        description: "Your 30-second introduction has been saved."
      });
    }, 1500);
  };
  
  // Check if video has already been recorded/uploaded
  const hasVideo = videoInterview !== null;

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
                poster={videoInterview.thumbnail}
                src={videoInterview.url}
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
                  <a href={videoInterview.url} target="_blank" rel="noopener noreferrer">
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
          {/* Only show video recorder */}
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
