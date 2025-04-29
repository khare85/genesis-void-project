
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileItem {
  id: string;
  name: string;
  description: string;
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

  // Function to determine if each section is completed
  const getProfileItems = (profileData: any): ProfileItem[] => {
    return [
      {
        id: 'personal-info',
        name: 'Personal Information',
        description: 'Basic details like name, title, and contact information',
        completed: !!(profileData.personal?.name && profileData.personal?.title && profileData.personal?.email),
        tabValue: 'overview'
      },
      {
        id: 'bio',
        name: 'Professional Bio',
        description: 'Summary of your professional background and career aspirations',
        completed: !!(profileData.personal?.bio && profileData.personal.bio.length > 50),
        tabValue: 'overview'
      },
      {
        id: 'experience',
        name: 'Work Experience',
        description: 'Your professional work history and achievements',
        completed: !!(profileData.experience && profileData.experience.length > 0),
        tabValue: 'experience'
      },
      {
        id: 'education',
        name: 'Education Background',
        description: 'Your educational history and qualifications',
        completed: !!(profileData.education && profileData.education.length > 0),
        tabValue: 'education'
      },
      {
        id: 'skills',
        name: 'Skills',
        description: 'Technical and soft skills you possess',
        completed: !!(profileData.skills && profileData.skills.length > 0),
        tabValue: 'overview'
      },
      {
        id: 'projects',
        name: 'Projects',
        description: 'Showcase of your notable projects and accomplishments',
        completed: !!(profileData.projects && profileData.projects.length > 0),
        tabValue: 'projects'
      },
      {
        id: 'video',
        name: 'Video Introduction',
        description: 'Brief video introducing yourself to potential employers',
        completed: !!(profileData.videoInterview),
        tabValue: 'video'
      },
      {
        id: 'certificates',
        name: 'Certifications',
        description: 'Professional certifications and credentials',
        completed: !!(profileData.certificates && profileData.certificates.length > 0),
        tabValue: 'certificates'
      }
    ];
  };

  const completionPercentage = calculateCompletionPercentage(profileData);
  const profileItems = getProfileItems(profileData);

  const handleCompleteSection = (item: ProfileItem) => {
    setActiveTab(item.tabValue);
    setIsEditing(true);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Profile Completion</span>
          <span className="text-lg font-bold">{completionPercentage}%</span>
        </CardTitle>
        <CardDescription>Complete your profile to increase visibility to employers</CardDescription>
        <div className="w-full bg-muted rounded-full h-2.5 mt-2">
          <div 
            className="bg-primary h-2.5 rounded-full" 
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {profileItems.map((item) => (
            <div 
              key={item.id} 
              className={cn(
                "p-4 border rounded-md transition-colors",
                item.completed ? "bg-muted/30 border-muted" : "border-dashed"
              )}
            >
              <div className="flex items-start gap-2">
                <div className="mt-0.5">
                  {item.completed ? (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  {!item.completed && (
                    <Button 
                      variant="link" 
                      className="px-0 h-auto text-sm mt-1"
                      onClick={() => handleCompleteSection(item)}
                    >
                      Complete this section
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full"
          disabled={completionPercentage === 100}
          onClick={() => {
            const incompleteItem = profileItems.find(item => !item.completed);
            if (incompleteItem) {
              handleCompleteSection(incompleteItem);
            }
          }}
        >
          {completionPercentage === 100 ? 'Profile Complete' : 'Complete Next Section'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileCompletionGuide;
