
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OverviewTab from './tabs/OverviewTab';
import ExperienceTab from './tabs/ExperienceTab';
import EducationTab from './tabs/EducationTab';
import ProjectsTab from './tabs/ProjectsTab';

interface ProfileTabsProps {
  profileData: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isEditing: boolean;
  form?: any;
}

const ProfileTabs = ({ 
  profileData, 
  activeTab, 
  setActiveTab, 
  isEditing, 
  form 
}: ProfileTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="w-full border-b rounded-none">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="experience">Experience</TabsTrigger>
        <TabsTrigger value="education">Education</TabsTrigger>
        <TabsTrigger value="projects">Projects</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview">
        <OverviewTab 
          overview={profileData.overview} 
          isEditing={isEditing} 
          form={form} 
        />
      </TabsContent>

      <TabsContent value="experience">
        <ExperienceTab 
          experience={profileData.experience} 
          isEditing={isEditing} 
          form={form} 
        />
      </TabsContent>

      <TabsContent value="education">
        <EducationTab 
          education={profileData.education} 
          isEditing={isEditing}
          form={form} 
        />
      </TabsContent>

      <TabsContent value="projects">
        <ProjectsTab 
          projects={profileData.projects} 
          isEditing={isEditing}
          form={form} 
        />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
