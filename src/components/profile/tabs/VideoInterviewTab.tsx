import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { AlertTriangle, Video, Link as LinkIcon } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import VideoRecorder from "@/components/application/VideoRecorder";
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
interface VideoInterviewProps {
  videoInterview: any | null;
  isEditing: boolean;
  form?: any;
}
const VideoInterviewTab: React.FC<VideoInterviewProps> = ({
  videoInterview: initialVideoInterview,
  isEditing,
  form
}) => {
  const {
    toast
  } = useToast();
  const {
    user
  } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoStorageUrl, setVideoStorageUrl] = useState('');
  const [currentVideoInterview, setCurrentVideoInterview] = useState(initialVideoInterview);
  const [showRecorder, setShowRecorder] = useState(false);

  // Check for onboarding video on component mount
  useEffect(() => {
    const findUserVideo = async () => {
      if (!user?.id) return;

      // If we already have a video interview, no need to look for one
      if (currentVideoInterview?.url || initialVideoInterview?.url) {
        console.log("Already have video interview data:", initialVideoInterview || currentVideoInterview);
        return;
      }
      console.log("Looking for user video sources...");

      // First try to find any onboarding video URL in localStorage
      const onboardingProgressData = localStorage.getItem(`onboarding_progress_${user.id}`);
      let videoUrl = null;
      if (onboardingProgressData) {
        try {
          const progress = JSON.parse(onboardingProgressData);
          videoUrl = progress.videoData?.uploadedUrl;
          if (videoUrl) {
            console.log("Found video URL from onboarding progress:", videoUrl);
          }
        } catch (e) {
          console.error("Error parsing saved onboarding progress:", e);
        }
      }

      // If we don't have a video from onboarding, check applications table
      if (!videoUrl) {
        try {
          const {
            data: applications
          } = await supabase.from('applications').select('video_url').eq('candidate_id', user.id).order('created_at', {
            ascending: false
          }).limit(1);
          if (applications && applications.length > 0 && applications[0].video_url) {
            videoUrl = applications[0].video_url;
            console.log("Found video URL from applications table:", videoUrl);
          }
        } catch (error) {
          console.error("Error fetching video URL from applications:", error);
        }
      }

      // If we found a video from any source, use it
      if (videoUrl) {
        const newVideoInterview = {
          url: videoUrl,
          remoteUrl: videoUrl,
          thumbnail: videoUrl,
          // We can use video URL as thumbnail
          duration: 30,
          createdAt: new Date().toISOString()
        };
        console.log("Setting video interview from found URL:", newVideoInterview);
        setCurrentVideoInterview(newVideoInterview);

        // Update form data for saving when form is submitted
        if (form) {
          form.setValue('videoInterview', {
            url: videoUrl,
            thumbnail: videoUrl,
            duration: 30,
            createdAt: newVideoInterview.createdAt
          });
        }
      }
    };
    findUserVideo();
  }, [user?.id, form]);

  // Reset to initial video when isEditing changes
  useEffect(() => {
    if (!isEditing) {
      setCurrentVideoInterview(initialVideoInterview);
      setVideoStorageUrl('');
      setVideoBlob(null);
      setShowRecorder(false);
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
        url: localVideoUrl,
        // Use local blob URL for immediate preview
        remoteUrl: mockVideoUrl,
        // Store remote URL for database
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

      // Hide the recorder after successful recording
      setShowRecorder(false);
    }, 1500);
  };

  // Check if video has already been recorded/uploaded
  const hasVideo = currentVideoInterview !== null;

  // Toggle video recorder visibility
  const handleShowRecorder = () => {
    setShowRecorder(true);
  };

  // Reset video recording if user wants to record again
  const handleResetVideo = () => {
    setCurrentVideoInterview(null);
    setVideoStorageUrl('');
    setVideoBlob(null);
    setShowRecorder(true);
    if (form) {
      form.setValue('videoInterview', null);
    }
  };

  // If we don't have a video but we have initialVideoInterview, use that
  useEffect(() => {
    if (initialVideoInterview && !currentVideoInterview) {
      setCurrentVideoInterview(initialVideoInterview);
    }
  }, [initialVideoInterview, currentVideoInterview]);
  return <div>
      <div className="mb-5">
        <h3 className="text-lg font-medium">Video Introduction</h3>
        <p className="text-muted-foreground">
          Record a brief 30-second video introducing yourself to potential employers
        </p>
      </div>
      
      {hasVideo && !showRecorder ? <div>
          <Card className="overflow-hidden">
            <div className="relative aspect-video bg-black flex items-center justify-center max-h-[240px]">
              {/* Video player */}
              <video controls className="w-full h-full" poster={currentVideoInterview.thumbnail} src={currentVideoInterview.url} />
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">My Video Introduction</h4>
                  <p className="text-sm text-muted-foreground">
                    Duration: 30 seconds
                  </p>
                </div>
                <div className="flex gap-2">
                  {/* Add Record Again button that's always visible */}
                  <Button variant="outline" size="sm" className="gap-1.5" onClick={handleResetVideo}>
                    <Video className="h-4 w-4" />
                    Record Again
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1.5" asChild>
                    <a href={currentVideoInterview.url} target="_blank" rel="noopener noreferrer">
                      <LinkIcon className="h-4 w-4" />
                      Watch
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div> : <div className="space-y-6">
          {/* Show video recorder for recording new video */}
          {isEditing || !hasVideo || showRecorder ? <>
              <Card>
                <CardContent className="pt-6 bg-blue-50 rounded-2xl">
                  <div className="space-y-4">
                    <VideoRecorder onVideoRecorded={handleVideoRecorded} isUploadingVideo={isUploadingVideo} setIsUploadingVideo={setIsUploadingVideo} videoStorageUrl={videoStorageUrl} setVideoStorageUrl={setVideoStorageUrl} maxDuration={30} autoStart={false} isAIInterview={false} />
                  </div>
                </CardContent>
              </Card>
            </> : <div className="flex flex-col items-center justify-center py-10">
              <Button onClick={handleShowRecorder} className="gap-2">
                <Video className="h-5 w-5" />
                Record Video Introduction
              </Button>
              <p className="mt-2 text-sm text-muted-foreground">Record a 30-second video introducing yourself</p>
            </div>}
          
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
          
          {form && <div className="space-y-3">
              <FormField control={form.control} name="videoIntroductionScript" render={({
          field
        }) => <FormItem>
                    <FormControl>
                      <Textarea placeholder="Write a script for your video introduction..." rows={4} {...field} />
                    </FormControl>
                  </FormItem>} />
            </div>}
        </div>}
    </div>;
};
export default VideoInterviewTab;