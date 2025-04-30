
import React from 'react';
import { Button } from "@/components/ui/button";
import { Edit2, Download, Save, Sparkles } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';
import { useProfileData } from '@/hooks/profile';

interface ProfileHeaderProps {
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  onSave?: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  isEditing, 
  setIsEditing, 
  onSave
}) => {
  const { user } = useAuth();
  const { isAIGenerating, generateProfileFromResume } = useProfileData();

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

  return (
    <PageHeader
      title="My Profile"
      description="Manage your professional information"
      actions={
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={generateProfileFromResume}
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
            {isEditing ? (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            ) : (
              <>
                <Edit2 className="mr-2 h-4 w-4" />
                Edit Profile
              </>
            )}
          </Button>
        </div>
      }
    />
  );
};

export default ProfileHeader;
