
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import { Link } from "react-router-dom";

interface ProfileCompletionCardProps {
  isDemoUser: boolean;
  resumeComplete?: boolean;
  skillsComplete?: boolean;
  videoComplete?: boolean;
  experienceComplete?: boolean;
  educationComplete?: boolean;
}

const ProfileCompletionCard: React.FC<ProfileCompletionCardProps> = ({ 
  isDemoUser,
  resumeComplete = isDemoUser, 
  skillsComplete = isDemoUser,
  videoComplete = false,
  experienceComplete = isDemoUser,
  educationComplete = isDemoUser
}) => {
  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-medium">Profile Completion</h3>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Resume</span>
            <Badge variant={resumeComplete ? "default" : "outline"}>
              {resumeComplete ? "Completed" : "Incomplete"}
            </Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm">Skills Assessment</span>
            <Badge variant={skillsComplete ? "default" : "outline"}>
              {skillsComplete ? "Completed" : "Incomplete"}
            </Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm">Video Introduction</span>
            <Badge variant={videoComplete ? "default" : "outline"}>
              {videoComplete ? "Completed" : "Incomplete"}
            </Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm">Work Experience</span>
            <Badge variant={experienceComplete ? "default" : "outline"}>
              {experienceComplete ? "Completed" : "Incomplete"}
            </Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm">Education</span>
            <Badge variant={educationComplete ? "default" : "outline"}>
              {educationComplete ? "Completed" : "Incomplete"}
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
