
import React from 'react';
import { Button } from "@/components/ui/button";
import { Edit2, Download, Save, Sparkles, X } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';
import { useProfileData } from '@/hooks/profile';

interface ProfileHeaderProps {
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  onSave?: () => void;
  onCancel?: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  isEditing, 
  setIsEditing, 
  onSave,
  onCancel
}) => {
  const { user } = useAuth();
  const { 
    isAIGenerating, 
    generateProfileFromResume,
    profileData
  } = useProfileData();

  const handleEditToggle = () => {
    if (isEditing) {
      // If currently editing, this will save changes
      if (onSave) {
        onSave();
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const handleGenerateFullProfile = async () => {
    if (isEditing) {
      toast.warning("Please save or cancel your changes before generating a new profile");
      return;
    }
    
    try {
      toast.info("AI is analyzing your resume data...");
      await generateProfileFromResume();
      toast.success("Profile generated successfully including skills and languages");
    } catch (error) {
      toast.error("Failed to generate profile");
      console.error("Profile generation error:", error);
    }
  };

  const handleDownloadResume = () => {
    if (profileData?.resumeUrl) {
      window.open(profileData.resumeUrl, '_blank');
    } else {
      toast.warning("No resume available for download");
    }
  };

  return (
    <PageHeader
      title="My Profile"
      description="Manage your professional information"
      actions={
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleEditToggle}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleGenerateFullProfile}
                disabled={isAIGenerating || isEditing}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {isAIGenerating ? "Processing..." : "AI Fill Profile"}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleDownloadResume}
                disabled={!profileData?.resumeUrl}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Resume
              </Button>
              <Button onClick={handleEditToggle}>
                <Edit2 className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </>
          )}
        </div>
      }
    />
  );
};

export default ProfileHeader;
