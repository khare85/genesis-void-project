
import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import ProfileTabs from '@/components/profile/ProfileTabs';
import ProfileCompletionGuide from '@/components/profile/ProfileCompletionGuide';
import ProfileCompletionBanner from '@/components/profile/ProfileCompletionBanner';
import { useProfileData } from '@/hooks/profile';
import { ProfileData } from '@/types/profile';
import { useOnboarding } from '@/context/OnboardingContext';
import { OnboardingProvider } from '@/context/OnboardingContext';

const CandidateProfilePageContent = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  
  const {
    profileData,
    isLoading,
    showCompletionGuide,
    saveProfileData,
    fetchProfileData
  } = useProfileData();
  
  const { reopenOnboarding } = useOnboarding();
  
  // Calculate profile completion percentage - updated to match dashboard card
  const calculateProfileCompletion = (data: ProfileData | undefined) => {
    if (!data) return 0;
    
    let completedSections = 0;
    let totalSections = 5; // Resume, Skills, Video, Experience, Education
    
    // Resume
    if (data.resumeUrl && data.resumeUrl.length > 0) completedSections++;
    
    // Skills
    if (data.skills && data.skills.length > 0) completedSections++;
    
    // Video
    if (data.videoInterview && data.videoInterview.url && data.videoInterview.url.length > 0) completedSections++;
    
    // Experience
    if (data.experience && data.experience.length > 0) completedSections++;
    
    // Education
    if (data.education && data.education.length > 0) completedSections++;
    
    const percentage = Math.round((completedSections / totalSections) * 100);
    console.log(`Profile completion: ${percentage}%`);
    return percentage;
  };
  
  const profileCompletion = calculateProfileCompletion(profileData);
  
  // Create form with default values
  const methods = useForm<ProfileData>({
    defaultValues: profileData,
    mode: 'onChange'
  });

  // Reset form values when profile data changes or when entering edit mode
  useEffect(() => {
    if (profileData) {
      console.log("Resetting form with profile data:", profileData);
      methods.reset(profileData);
    }
  }, [profileData, methods]);
  
  // Also reset when switching to edit mode to ensure we have the latest data
  useEffect(() => {
    if (isEditing && profileData) {
      console.log("Entering edit mode, resetting form with:", profileData);
      methods.reset(profileData);
    }
  }, [isEditing, profileData, methods]);
  
  const handleSaveChanges = async () => {
    try {
      const formData = methods.getValues();
      console.log("Saving form data:", formData);
      await saveProfileData(formData);
      setIsEditing(false);
      
      // Refresh profile data after saving
      fetchProfileData();
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };
  
  const handleCancelEdit = () => {
    // Reset form to current profileData values
    console.log("Cancelling edit, resetting form to:", profileData);
    methods.reset(profileData);
    setIsEditing(false);
  };
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Loading profile data...</p>
      </div>
    </div>;
  }
  
  return (
    <FormProvider {...methods}>
      <div className="space-y-6">
        <ProfileHeader 
          isEditing={isEditing} 
          setIsEditing={setIsEditing} 
          onSave={handleSaveChanges}
          onCancel={handleCancelEdit}
        />
        
        {/* Profile Completion Banner */}
        {profileCompletion < 80 && (
          <ProfileCompletionBanner profileCompletion={profileCompletion} />
        )}
        
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Sidebar with profile summary */}
          <div className="space-y-6">
            <ProfileSidebar 
              profileData={profileData} 
              isEditing={isEditing} 
              form={methods}
            />
            
            {/* Profile Completion Guide moved below the sidebar */}
            {showCompletionGuide ? (
              <ProfileCompletionGuide 
                profileData={profileData}
                setActiveTab={setActiveTab}
                setIsEditing={setIsEditing}
              />
            ) : null}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            <ProfileTabs 
              profileData={profileData} 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              isEditing={isEditing}
              form={methods}
            />
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

// Wrap the component with OnboardingProvider
const CandidateProfilePage = () => {
  return (
    <OnboardingProvider>
      <CandidateProfilePageContent />
    </OnboardingProvider>
  );
};

export default CandidateProfilePage;
