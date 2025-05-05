
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CompleteCandidateProfile } from '@/hooks/recruiter/useCompleteCandidateProfile';
import { ScheduleInterviewModal } from './ScheduleInterviewModal';
import ProfileHeader from './ProfileHeader';
import BioCard from './BioCard';
import ApplicationNotesCard from './ApplicationNotesCard';
import ProfileActions from './ProfileActions';
import ProfileTabsContainer from './ProfileTabsContainer';
import MediaSection from './MediaSection';

interface ComprehensiveProfileProps {
  profile: CompleteCandidateProfile;
}

export const ComprehensiveProfile: React.FC<ComprehensiveProfileProps> = ({ profile }) => {
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [selectedApplicationIndex, setSelectedApplicationIndex] = useState(0);
  const [scheduleInterviewOpen, setScheduleInterviewOpen] = useState(false);
  
  // Mock data for multiple job applications
  const mockApplications = profile.applicationDetails ? 
    [profile.applicationDetails] : 
    [];
    
  // If we don't have real applications, add some mock ones for UI demonstration
  if (mockApplications.length === 0) {
    mockApplications.push({
      status: 'pending',
      matchScore: 85,
      dateApplied: new Date().toLocaleDateString(),
      position: 'Frontend Developer',
      resume: 'https://example.com/resume.pdf',
      videoIntro: profile.avatar, // Using avatar as fallback
      screeningNotes: 'Good candidate with strong React skills.'
    });
  }
  
  const currentApplication = mockApplications[selectedApplicationIndex];
  
  const handleDownloadResume = () => {
    if (currentApplication?.resume) {
      window.open(currentApplication.resume, '_blank');
    }
  };
  
  const handleScheduleInterview = () => {
    setScheduleInterviewOpen(true);
  };

  const handleShareProfile = async () => {
    try {
      const shareableUrl = `${window.location.origin}/candidate-profile/${profile.id}`;
      await navigator.clipboard.writeText(shareableUrl);
      toast.success('Profile link copied to clipboard!');
    } catch (error) {
      console.error('Error sharing profile:', error);
      toast.error('Failed to share profile');
    }
  };
  
  const handleShareVideo = async () => {
    try {
      if (!currentApplication?.videoIntro) {
        toast.error('No video available to share');
        return;
      }
      
      const videoUrl = currentApplication.videoIntro;
      const urlObj = new URL(videoUrl);
      const pathParts = urlObj.pathname.split('/');
      const bucketName = pathParts[1];
      const filePath = pathParts.slice(2).join('/');
      
      const { data, error } = await supabase
        .storage
        .from(bucketName)
        .createSignedUrl(filePath, 604800);
      
      if (error) {
        throw error;
      }
      
      await navigator.clipboard.writeText(data.signedUrl);
      toast.success('Shareable video link copied to clipboard! Link valid for 7 days.');
    } catch (error) {
      console.error('Error generating shareable video link:', error);
      toast.error('Failed to generate shareable video link');
    }
  };
  
  return (
    <div className="space-y-5 max-w-[1200px] mx-auto">
      {/* Action Buttons */}
      <ProfileActions 
        onDownloadResume={handleDownloadResume}
        onShareProfile={handleShareProfile}
        onScheduleInterview={handleScheduleInterview}
        hasResume={!!currentApplication?.resume}
      />
      
      {/* Profile Header */}
      <ProfileHeader 
        profile={profile} 
        currentApplication={currentApplication}
        onShareProfile={handleShareProfile}
        onVideoClick={() => setVideoDialogOpen(true)}
      />
      
      {/* Bio */}
      <BioCard bio={profile.bio} />
      
      {/* Application Details */}
      <ApplicationNotesCard 
        screeningNotes={currentApplication?.screeningNotes} 
        position={currentApplication?.position} 
      />
      
      {/* Tabs for different sections */}
      <ProfileTabsContainer profile={profile} />
      
      {/* Resume and Video Intro cards */}
      <MediaSection 
        resumeUrl={currentApplication?.resume}
        videoUrl={currentApplication?.videoIntro}
        candidateAvatar={profile.avatar}
        onDownloadResume={handleDownloadResume}
        onShareVideo={handleShareVideo}
        onPlayVideo={() => setVideoDialogOpen(true)}
      />
      
      {/* Video Dialog for full-screen viewing */}
      <Dialog open={videoDialogOpen} onOpenChange={setVideoDialogOpen}>
        <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden">
          <div className="aspect-video w-full">
            {currentApplication?.videoIntro && (
              <video 
                src={currentApplication.videoIntro} 
                poster={profile.avatar}
                controls 
                autoPlay
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Schedule Interview Modal */}
      <ScheduleInterviewModal
        isOpen={scheduleInterviewOpen}
        onClose={() => setScheduleInterviewOpen(false)}
        candidateId={profile.id}
        candidateName={profile.name}
        candidateEmail={profile.email}
      />
    </div>
  );
};
