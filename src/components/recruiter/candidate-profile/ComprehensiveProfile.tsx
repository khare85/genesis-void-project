
import React, { useState } from 'react';
import { CompleteCandidateProfile } from '@/hooks/recruiter/useCompleteCandidateProfile';
import ProfileHeader from './ProfileHeader';
import BioCard from './BioCard';
import ProfileTabsContainer from './ProfileTabsContainer';
import MediaSection from './MediaSection';
import ProfileActions from './ProfileActions';
import { useServices } from '@/hooks/recruiter/screening/useServices';
import { toast } from 'sonner';

interface ComprehensiveProfileProps {
  profile: CompleteCandidateProfile;
  onDownloadResume?: () => void;
}

export const ComprehensiveProfile: React.FC<ComprehensiveProfileProps> = ({ profile, onDownloadResume }) => {
  const [currentApplication] = useState(profile?.applications?.[0] || null);
  const { openVideoDialog, VideoDialog, generateShareableLink } = useServices();
  
  const handleShareProfile = () => {
    try {
      const shareableUrl = `${window.location.origin}/recruiter/candidate-profile/${profile.id}`;
      navigator.clipboard.writeText(shareableUrl);
      toast.success('Profile link copied to clipboard!');
    } catch (error) {
      console.error('Error sharing profile:', error);
      toast.error('Failed to share profile');
    }
  };
  
  const handleScheduleInterview = () => {
    // This would typically open an interview scheduling modal
    toast.info('Interview scheduling functionality not yet implemented');
  };
  
  const handlePlayVideo = () => {
    if (currentApplication?.videoIntro) {
      openVideoDialog(currentApplication.videoIntro, profile.avatar);
    } else if (profile.videoUrl) {
      openVideoDialog(profile.videoUrl, profile.avatar);
    }
  };
  
  const handleShareVideo = () => {
    if (currentApplication?.videoIntro) {
      generateShareableLink(currentApplication.videoIntro, profile.id);
    } else if (profile.videoUrl) {
      generateShareableLink(profile.videoUrl, profile.id);
    }
  };
  
  const handleDownloadResume = () => {
    if (onDownloadResume) {
      onDownloadResume();
    } else if (profile.resumeUrl) {
      window.open(profile.resumeUrl, '_blank');
    } else {
      toast.error('Resume not available for download');
    }
  };
  
  return (
    <>
      {/* Actions Bar */}
      <ProfileActions
        onDownloadResume={handleDownloadResume}
        onShareProfile={handleShareProfile}
        onScheduleInterview={handleScheduleInterview}
        hasResume={!!profile.resumeUrl}
      />
      
      {/* Profile Header */}
      <ProfileHeader
        profile={profile}
        currentApplication={currentApplication}
        onShareProfile={handleShareProfile}
        onVideoClick={handlePlayVideo}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Bio Section */}
          <BioCard profile={profile} />
          
          {/* Media Section (Resume + Video) */}
          <MediaSection 
            resumeUrl={profile.resumeUrl}
            videoUrl={currentApplication?.videoIntro || profile.videoUrl}
            candidateAvatar={profile.avatar}
            onDownloadResume={handleDownloadResume}
            onShareVideo={handleShareVideo}
            onPlayVideo={handlePlayVideo}
          />
        </div>
        
        {/* Main Content - Profile Tabs */}
        <div className="lg:col-span-2">
          <ProfileTabsContainer profile={profile} />
        </div>
      </div>
      
      {/* Video Dialog for video preview */}
      <VideoDialog />
    </>
  );
};

export default ComprehensiveProfile;
