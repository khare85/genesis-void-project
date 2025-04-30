
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import { Link } from "react-router-dom";

interface ProfileCompletionCardProps {
  isDemoUser: boolean;
}

const ProfileCompletionCard: React.FC<ProfileCompletionCardProps> = ({ isDemoUser }) => {
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
            <Badge>{isDemoUser ? "Completed" : "Incomplete"}</Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm">Skills Assessment</span>
            <Badge>{isDemoUser ? "Completed" : "Incomplete"}</Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm">Video Introduction</span>
            <Badge variant="outline">Incomplete</Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm">Work Experience</span>
            <Badge>{isDemoUser ? "Completed" : "Incomplete"}</Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm">Education</span>
            <Badge>{isDemoUser ? "Completed" : "Incomplete"}</Badge>
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
