import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { AlertTriangle, Video, Link as LinkIcon, Upload } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface VideoInterviewProps {
  videoInterview: any | null;
  isEditing: boolean;
  form?: any;
}

const VideoInterviewTab: React.FC<VideoInterviewProps> = ({ videoInterview, isEditing, form }) => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const handleStartRecording = () => {
    setIsRecording(true);
    toast({
      title: "Recording started",
      description: "Your video introduction is now being recorded."
    });
    
    // Simulate recording completion after 3 seconds
    setTimeout(() => {
      setIsRecording(false);
      if (form) {
        form.setValue('videoInterview', {
          url: "https://example.com/sample-video.mp4",
          thumbnail: "https://example.com/sample-thumbnail.jpg",
          duration: 60,
          createdAt: new Date().toISOString()
        });
      }
      toast({
        title: "Recording completed",
        description: "Your video introduction has been recorded successfully."
      });
    }, 3000);
  };
  
  const handleFileUpload = () => {
    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      if (form) {
        form.setValue('videoInterview', {
          url: "https://example.com/uploaded-video.mp4",
          thumbnail: "https://example.com/uploaded-thumbnail.jpg",
          duration: 90,
          createdAt: new Date().toISOString()
        });
      }
      toast({
        title: "Upload completed",
        description: "Your video has been uploaded successfully."
      });
    }, 2000);
  };
  
  // Check if video has already been recorded/uploaded
  const hasVideo = videoInterview !== null;

  return (
    <div>
      <div className="mb-5">
        <h3 className="text-lg font-medium">Video Introduction</h3>
        <p className="text-muted-foreground">
          Record or upload a brief video introducing yourself to potential employers
        </p>
      </div>
      
      {hasVideo && !isEditing ? (
        <div>
          <Card className="overflow-hidden">
            <div className="relative aspect-video bg-black flex items-center justify-center max-h-[240px]">
              {/* This would typically be a video player component */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Video className="h-16 w-16 text-muted-foreground opacity-50" />
              </div>
              <img 
                src={videoInterview.thumbnail} 
                alt="Video thumbnail" 
                className="opacity-70 w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">My Video Introduction</h4>
                  <p className="text-sm text-muted-foreground">
                    Duration: {Math.floor(videoInterview.duration / 60)}:{videoInterview.duration % 60 < 10 ? '0' : ''}{videoInterview.duration % 60}
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
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-3">
                  <div className="mx-auto bg-muted w-16 h-16 rounded-full flex items-center justify-center">
                    <Video className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="font-medium">Record New Video</h4>
                  <p className="text-sm text-muted-foreground">
                    Record a 1-2 minute introduction directly from your browser
                  </p>
                  <Button 
                    onClick={handleStartRecording} 
                    className="w-full"
                    disabled={isRecording}
                  >
                    {isRecording ? 'Recording...' : 'Start Recording'}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-3">
                  <div className="mx-auto bg-muted w-16 h-16 rounded-full flex items-center justify-center">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="font-medium">Upload Video</h4>
                  <p className="text-sm text-muted-foreground">
                    Upload a pre-recorded video introduction (MP4 format, max 100MB)
                  </p>
                  <div className="space-y-2">
                    <Input type="file" accept="video/mp4" disabled={isUploading} />
                    <Button 
                      onClick={handleFileUpload} 
                      variant="outline" 
                      className="w-full"
                      disabled={isUploading}
                    >
                      {isUploading ? 'Uploading...' : 'Upload File'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-md flex gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900">
              <p className="font-medium">Video Introduction Tips</p>
              <ul className="list-disc pl-4 mt-1 space-y-1">
                <li>Keep your introduction concise (1-2 minutes)</li>
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
