
import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import ProfileTabs from '@/components/profile/ProfileTabs';
import ProfileCompletionGuide from '@/components/profile/ProfileCompletionGuide';
import { useProfileData } from '@/hooks/profile';
import { ProfileData } from '@/types/profile';

const CandidateProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  
  const {
    profileData,
    isLoading,
    showCompletionGuide,
    saveProfileData,
    fetchProfileData
  } = useProfileData();
  
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

export default CandidateProfilePage;
