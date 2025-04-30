
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
  const { isAIGenerating, generateProfileFromResume, setProfileData } = useProfileData();

  const handleEditToggle = () => {
    if (isEditing) {
      // If currently editing, this will save changes
      if (onSave) {
        onSave();
      }
      toast.success("Profile updated successfully");
    }
    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    setIsEditing(false);
  };

  // This function uses the comprehensive AI generation that includes skills and languages
  const handleGenerateFullProfile = async () => {
    try {
      await generateProfileFromResume();
      toast.success("Profile generated successfully including skills and languages");
    } catch (error) {
      toast.error("Failed to generate profile");
      console.error("Profile generation error:", error);
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
              <Button variant="outline">
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
