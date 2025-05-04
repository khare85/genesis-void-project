
import React from 'react';
import { Button } from '@/components/ui/button';
import { useOnboarding } from '@/context/OnboardingContext';

interface ProfileCompletionBannerProps {
  profileCompletion: number;
}

const ProfileCompletionBanner: React.FC<ProfileCompletionBannerProps> = ({ profileCompletion }) => {
  const { reopenOnboarding } = useOnboarding();

  if (profileCompletion >= 80) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-medium text-amber-800">Complete Your Profile</h3>
          <p className="text-sm text-amber-700">
            Your profile is only {profileCompletion}% complete. Add your resume and intro video to increase your chances of getting noticed by recruiters.
          </p>
        </div>
        <Button 
          onClick={reopenOnboarding} 
          variant="secondary"
          className="whitespace-nowrap"
        >
          Complete Profile
        </Button>
      </div>
    </div>
  );
};

export default ProfileCompletionBanner;
