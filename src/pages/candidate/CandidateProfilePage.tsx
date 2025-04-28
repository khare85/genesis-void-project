
import React, { useState } from 'react';
import { useAuth } from '@/lib/auth';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import ProfileTabs from '@/components/profile/ProfileTabs';
import CareerInsights from '@/components/profile/CareerInsights';
import { useForm, FormProvider } from 'react-hook-form';

const CandidateProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [profileData, setProfileData] = useState(candidateData);
  
  const methods = useForm({
    defaultValues: {
      ...profileData,
    },
  });

  const handleSaveChanges = () => {
    const formData = methods.getValues();
    setProfileData(prevData => ({
      ...prevData,
      ...formData,
    }));
    console.log("Saving profile data:", formData);
  };
  
  return (
    <FormProvider {...methods}>
      <div className="space-y-6">
        <ProfileHeader 
          isEditing={isEditing} 
          setIsEditing={setIsEditing} 
          onSave={handleSaveChanges}
        />
        
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6">
            <ProfileSidebar 
              profileData={profileData} 
              isEditing={isEditing} 
              form={methods.control ? methods : undefined}
            />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <ProfileTabs 
              profileData={profileData} 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              isEditing={isEditing}
              form={methods.control ? methods : undefined}
            />
            <CareerInsights />
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default CandidateProfilePage;
