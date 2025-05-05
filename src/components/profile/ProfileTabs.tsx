
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import OverviewTab from './tabs/OverviewTab';
import ExperienceTab from './tabs/ExperienceTab';
import EducationTab from './tabs/EducationTab';
import ProjectsTab from './tabs/ProjectsTab';
import VideoInterviewTab from './tabs/VideoInterviewTab';
import CertificatesTab from './tabs/CertificatesTab';

interface ProfileTabsProps {
  profileData: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isEditing: boolean;
  form?: any;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({
  profileData,
  activeTab,
  setActiveTab,
  isEditing,
  form
}) => {
  return (
    <div className="bg-slate-50 rounded-xl shadow-sm">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b bg-white rounded-t-xl px-6">
          <TabsList className="h-16 bg-transparent justify-start w-full gap-8">
            <TabsTrigger 
              value="overview" 
              className="text-gray-500 data-[state=active]:text-gray-800 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:font-medium text-base"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="experience" 
              className="text-gray-500 data-[state=active]:text-gray-800 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:font-medium text-base"
            >
              Experience
            </TabsTrigger>
            <TabsTrigger 
              value="education" 
              className="text-gray-500 data-[state=active]:text-gray-800 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:font-medium text-base"
            >
              Education
            </TabsTrigger>
            <TabsTrigger 
              value="projects" 
              className="text-gray-500 data-[state=active]:text-gray-800 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:font-medium text-base"
            >
              Projects
            </TabsTrigger>
            <TabsTrigger 
              value="video" 
              className="text-gray-500 data-[state=active]:text-gray-800 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:font-medium text-base"
            >
              Video Introduction
            </TabsTrigger>
            <TabsTrigger 
              value="certificates" 
              className="text-gray-500 data-[state=active]:text-gray-800 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:font-medium text-base"
            >
              Certificates
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="p-6 space-y-6 rounded-2xl bg-white">
          <OverviewTab profileData={profileData} isEditing={isEditing} form={form} />
        </TabsContent>

        <TabsContent value="experience" className="p-6 rounded-2xl bg-white">
          <ExperienceTab experience={profileData.experience || []} isEditing={isEditing} form={form} />
        </TabsContent>

        <TabsContent value="education" className="p-6 rounded-2xl bg-white">
          <EducationTab education={profileData.education || []} isEditing={isEditing} form={form} />
        </TabsContent>

        <TabsContent value="projects" className="p-6 rounded-2xl bg-white">
          <ProjectsTab projects={profileData.projects || []} isEditing={isEditing} form={form} />
        </TabsContent>

        <TabsContent value="video" className="p-6 rounded-2xl bg-white">
          <VideoInterviewTab videoInterview={profileData.videoInterview} isEditing={isEditing} form={form} />
        </TabsContent>
        
        <TabsContent value="certificates" className="p-6 rounded-2xl bg-white">
          <CertificatesTab certificates={profileData.certificates || []} isEditing={isEditing} form={form} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileTabs;
