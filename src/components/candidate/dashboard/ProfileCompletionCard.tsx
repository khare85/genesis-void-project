
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, FileText, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { DEMO_USERS } from "@/lib/auth/mockUsers";
import { Progress } from "@/components/ui/progress";

interface ProfileData {
  resumeComplete: boolean;
  skillsComplete: boolean;
  videoComplete: boolean;
  experienceComplete: boolean;
  educationComplete: boolean;
  completionPercentage: number;
}

const ProfileCompletionCard: React.FC = () => {
  const { user } = useAuth();
  const isDemoUser = user ? Object.values(DEMO_USERS).some(demoUser => demoUser.id === user.id) : false;
  const [loading, setLoading] = useState(!isDemoUser);
  const [profileData, setProfileData] = useState<ProfileData>({
    resumeComplete: isDemoUser,
    skillsComplete: isDemoUser,
    videoComplete: false,
    experienceComplete: isDemoUser,
    educationComplete: isDemoUser,
    completionPercentage: isDemoUser ? 80 : 0
  });

  useEffect(() => {
    const fetchProfileCompletion = async () => {
      if (!user?.id || isDemoUser) return;
      
      setLoading(true);
      try {
        // Fetch profile sections to determine completion
        const [
          { data: skills },
          { data: experience },
          { data: education },
          { data: profile }
        ] = await Promise.all([
          supabase.from('candidate_skills').select('*').eq('candidate_id', user.id),
          supabase.from('candidate_experience').select('*').eq('candidate_id', user.id),
          supabase.from('candidate_education').select('*').eq('candidate_id', user.id),
          supabase.from('profiles').select('*').eq('id', user.id).single()
        ]);

        // Check if resume exists in profile
        const hasResume = profile?.resumeUrl && profile.resumeUrl !== '';
        
        // Calculate completion status for each section
        const hasSkills = skills && skills.length > 0;
        const hasExperience = experience && experience.length > 0;
        const hasEducation = education && education.length > 0;
        const hasVideo = profile?.videoInterview;
        
        // Calculate overall completion percentage
        let completedSections = 0;
        const totalSections = 5; // Resume, Skills, Video, Experience, Education
        
        if (hasResume) completedSections++;
        if (hasSkills) completedSections++;
        if (hasVideo) completedSections++;
        if (hasExperience) completedSections++;
        if (hasEducation) completedSections++;
        
        const completionPercentage = Math.round((completedSections / totalSections) * 100);
        
        setProfileData({
          resumeComplete: hasResume,
          skillsComplete: hasSkills,
          videoComplete: hasVideo,
          experienceComplete: hasExperience,
          educationComplete: hasEducation,
          completionPercentage
        });
      } catch (error) {
        console.error('Error fetching profile completion data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileCompletion();
  }, [user, isDemoUser]);

  if (loading) {
    return (
      <Card>
        <div className="p-6 flex flex-col items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary mb-2" />
          <p className="text-sm text-muted-foreground">Loading profile data...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">Profile Completion</h3>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm">{profileData.completionPercentage}% Complete</span>
            {profileData.completionPercentage === 100 && (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}
          </div>
          <Progress value={profileData.completionPercentage} className="h-2" />
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Resume</span>
            <Badge variant={profileData.resumeComplete ? "default" : "outline"}>
              {profileData.resumeComplete ? "Completed" : "Incomplete"}
            </Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm">Skills Assessment</span>
            <Badge variant={profileData.skillsComplete ? "default" : "outline"}>
              {profileData.skillsComplete ? "Completed" : "Incomplete"}
            </Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm">Video Introduction</span>
            <Badge variant={profileData.videoComplete ? "default" : "outline"}>
              {profileData.videoComplete ? "Completed" : "Incomplete"}
            </Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm">Work Experience</span>
            <Badge variant={profileData.experienceComplete ? "default" : "outline"}>
              {profileData.experienceComplete ? "Completed" : "Incomplete"}
            </Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm">Education</span>
            <Badge variant={profileData.educationComplete ? "default" : "outline"}>
              {profileData.educationComplete ? "Completed" : "Incomplete"}
            </Badge>
          </div>
          
          <Button variant="outline" size="sm" className="w-full mt-2" asChild>
            <Link to="/candidate/profile">Complete Profile</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProfileCompletionCard;
