
import React from 'react';
import { Button } from "@/components/ui/button";
import { Edit2, Download, Save, Sparkles } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';
import { generateProfileData } from '@/services/profileAI';
import AIStatusIndicator from "@/components/shared/AIStatusIndicator";

interface ProfileHeaderProps {
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  onSave?: () => void;
  onAIGenerate?: (profileData: any) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ isEditing, setIsEditing, onSave, onAIGenerate }) => {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = React.useState(false);

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

  const handleAIGenerate = async () => {
    if (!user?.id) {
      toast.error("You must be logged in to use this feature");
      return;
    }

    setIsGenerating(true);
    try {
      const profileData = await generateProfileData(user.id);
      if (profileData && onAIGenerate) {
        onAIGenerate(profileData);
        toast.success("Profile information generated successfully");
      }
    } catch (error) {
      toast.error("Failed to generate profile information");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <PageHeader
      title="My Profile"
      description="Manage your professional information"
      actions={
        <div className="flex gap-2">
          {!isEditing && (
            <Button 
              variant="outline" 
              onClick={handleAIGenerate} 
              disabled={isGenerating}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              {isGenerating ? "Generating..." : "AI Generate"}
            </Button>
          )}
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
