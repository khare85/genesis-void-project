
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ProfileItem {
  id: string;
  name: string;
  completed: boolean;
  tabValue: string;
}

interface ProfileCompletionGuideProps {
  profileData: any;
  setActiveTab: (tab: string) => void;
  setIsEditing: (isEditing: boolean) => void;
}

const ProfileCompletionGuide: React.FC<ProfileCompletionGuideProps> = ({
  profileData,
  setActiveTab,
  setIsEditing
}) => {
  // Calculate completion percentage
  const calculateCompletionPercentage = (profileData: any) => {
    const items = getProfileItems(profileData);
    const completedItems = items.filter(item => item.completed).length;
    return Math.round((completedItems / items.length) * 100);
  };

  // Function to determine if each section is completed (simplified)
  const getProfileItems = (profileData: any): ProfileItem[] => {
    return [
      {
        id: 'personal-info',
        name: 'Personal Information',
        completed: !!(profileData.personal?.name && profileData.personal?.title && profileData.personal?.email),
        tabValue: 'overview'
      },
      {
        id: 'experience',
        name: 'Work Experience',
        completed: !!(profileData.experience && profileData.experience.length > 0),
        tabValue: 'experience'
      },
      {
        id: 'education',
        name: 'Education',
        completed: !!(profileData.education && profileData.education.length > 0),
        tabValue: 'education'
      },
      {
        id: 'skills',
        name: 'Skills',
        completed: !!(profileData.skills && profileData.skills.length > 0),
        tabValue: 'overview'
      },
      {
        id: 'video',
        name: 'Video Introduction',
        completed: !!(profileData.videoInterview),
        tabValue: 'video'
      }
    ];
  };

  const completionPercentage = calculateCompletionPercentage(profileData);
  const profileItems = getProfileItems(profileData);
  const incompleteItems = profileItems.filter(item => !item.completed);

  const handleCompleteSection = (item: ProfileItem) => {
    setActiveTab(item.tabValue);
    setIsEditing(true);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Profile Completion</CardTitle>
          <span className="text-lg font-bold">{completionPercentage}%</span>
        </div>
        <Progress value={completionPercentage} className="h-2" />
      </CardHeader>
      
      {incompleteItems.length > 0 ? (
        <CardContent className="pt-0">
          <div className="text-sm text-muted-foreground mb-3">
            Complete these sections to increase visibility to employers:
          </div>
          <div className="space-y-2">
            {incompleteItems.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-muted transition-colors cursor-pointer"
                onClick={() => handleCompleteSection(item)}
              >
                <div className="flex items-center gap-2">
                  <Circle className="h-4 w-4 text-muted-foreground" />
                  <span>{item.name}</span>
                </div>
                <Button variant="ghost" size="sm" className="h-7 px-2">
                  Complete
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      ) : (
        <CardContent>
          <div className="flex items-center justify-center py-2 text-primary">
            <CheckCircle className="mr-2" />
            <span>Profile complete!</span>
          </div>
        </CardContent>
      )}
      
      {incompleteItems.length > 0 && (
        <CardFooter>
          <Button 
            className="w-full"
            onClick={() => {
              const incompleteItem = incompleteItems[0];
              if (incompleteItem) {
                handleCompleteSection(incompleteItem);
              }
            }}
          >
            Complete Next Section
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ProfileCompletionGuide;
