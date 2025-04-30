
import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import ProfileTabs from '@/components/profile/ProfileTabs';
import CareerInsights from '@/components/profile/CareerInsights';
import ProfileCompletionGuide from '@/components/profile/ProfileCompletionGuide';
import { useProfileData } from '@/hooks/useProfileData';
import { ProfileData } from '@/types/profile';

const CandidateProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  
  const {
    profileData,
    isLoading,
    showCompletionGuide,
    fetchProfileData,
    saveProfileData
  } = useProfileData();
  
  const methods = useForm<ProfileData>({
    defaultValues: profileData,
  });

  const handleSaveChanges = async () => {
    const formData = methods.getValues();
    await saveProfileData(formData);
  };
  
  return (
    <FormProvider {...methods}>
      <div className="space-y-6">
        <ProfileHeader 
          isEditing={isEditing} 
          setIsEditing={setIsEditing} 
          onSave={handleSaveChanges}
          refreshProfileData={fetchProfileData}
        />
        
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Sidebar with profile summary */}
          <div className="space-y-6">
            <ProfileSidebar 
              profileData={profileData} 
              isEditing={isEditing} 
              form={methods.control ? methods : undefined}
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
              form={methods.control ? methods : undefined}
            />

            {/* Career Insights Card */}
            <CareerInsights />
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default CandidateProfilePage;
