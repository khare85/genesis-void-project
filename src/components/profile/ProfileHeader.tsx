
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Edit2, Download, Save, Sparkles } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

interface ProfileHeaderProps {
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  onSave?: () => void;
  refreshProfileData?: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  isEditing, 
  setIsEditing, 
  onSave,
  refreshProfileData 
}) => {
  const [isAIGenerating, setIsAIGenerating] = useState(false);
  const { user } = useAuth();

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
    if (!user) {
      toast.error("You must be logged in to use this feature");
      return;
    }

    setIsAIGenerating(true);
    toast.info("AI is processing your resume data...");

    try {
      const { data, error } = await supabase.functions.invoke('generate-profile-from-resume', {
        body: {
          userId: user.id,
          forceRefresh: true
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.success) {
        throw new Error(data.message || "Failed to generate profile data");
      }

      toast.success("Profile data generated successfully!");
      
      // Refresh the profile data
      if (refreshProfileData) {
        refreshProfileData();
      }
    } catch (error) {
      console.error("Error generating profile:", error);
      toast.error(`Failed to generate profile: ${error.message || "Unknown error"}`);
    } finally {
      setIsAIGenerating(false);
    }
  };

  return (
    <PageHeader
      title="My Profile"
      description="Manage your professional information"
      actions={
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleAIGenerate}
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
