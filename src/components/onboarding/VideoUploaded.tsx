
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

interface VideoUploadedProps {
  videoUrl: string;
  recordedBlob: Blob | null;
  onComplete: (videoBlob: Blob | null, videoUrl: string | null) => void;
}

const VideoUploaded: React.FC<VideoUploadedProps> = ({ videoUrl, recordedBlob, onComplete }) => {
  const { user } = useAuth();

  // Save video URL to profile and applications table when video is uploaded
  useEffect(() => {
    const saveVideoToProfile = async () => {
      if (!videoUrl || !user?.id) return;
      
      try {
        console.log('Saving video URL to profile and applications:', videoUrl);
        
        // Get existing profile data
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('ai_parsed_data')
          .eq('id', user.id)
          .single();
          
        if (existingProfile?.ai_parsed_data) {
          // If we have existing parsed data, update the video interview field
          let parsedData;
          try {
            if (typeof existingProfile.ai_parsed_data === 'object') {
              parsedData = existingProfile.ai_parsed_data;
            } else {
              parsedData = JSON.parse(existingProfile.ai_parsed_data);
            }
            
            parsedData.videoInterview = {
              url: videoUrl,
              thumbnail: videoUrl,
              duration: 30,
              createdAt: new Date().toISOString()
            };
            
            // Save the updated parsed data back to the profile
            await supabase
              .from('profiles')
              .update({
                ai_parsed_data: JSON.stringify(parsedData),
                updated_at: new Date().toISOString()
              })
              .eq('id', user.id);
              
            console.log('Updated profile ai_parsed_data with video information');
          } catch (e) {
            console.error('Error updating ai_parsed_data:', e);
          }
        } else {
          // If no parsed data exists yet, create a new object
          const newParsedData = {
            videoInterview: {
              url: videoUrl,
              thumbnail: videoUrl,
              duration: 30,
              createdAt: new Date().toISOString()
            }
          };
          
          await supabase
            .from('profiles')
            .update({
              ai_parsed_data: JSON.stringify(newParsedData),
              updated_at: new Date().toISOString()
            })
            .eq('id', user.id);
            
          console.log('Created new ai_parsed_data with video information');
        }
        
        // Check if user already has an application
        const { data: existingApplications } = await supabase
          .from('applications')
          .select('id')
          .eq('candidate_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (existingApplications && existingApplications.length > 0) {
          // Update existing application with video URL
          await supabase
            .from('applications')
            .update({
              video_url: videoUrl,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingApplications[0].id);
            
          console.log('Updated application with video URL');
        }
        
        console.log('Video URL saved to profile and applications');
      } catch (error) {
        console.error('Error saving video URL to profile:', error);
        // Continue even if there's an error
      }
    };

    saveVideoToProfile();
  }, [videoUrl, user?.id]);

  return (
    <div className="w-full space-y-4">
      <div className="border rounded-lg p-6 bg-green-50">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-medium">Video uploaded successfully</h3>
            <p className="text-sm text-muted-foreground">
              Your 30-second introduction is ready
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={() => onComplete(recordedBlob, videoUrl)}
          className="bg-primary hover:bg-primary/90"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default VideoUploaded;
