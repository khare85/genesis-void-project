import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  return <div className="rounded-xl shadow-md overflow-hidden border border-gray-200 bg-white">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b border-gray-200 bg-white">
          <TabsList className="w-full justify-start bg-white rounded-none px-0">
            <TabsTrigger value="overview" className="font-medium">
              Overview
            </TabsTrigger>
            <TabsTrigger value="experience" className="font-medium">
              Experience
            </TabsTrigger>
            <TabsTrigger value="education" className="font-medium">
              Education
            </TabsTrigger>
            <TabsTrigger value="projects" className="font-medium">
              Projects
            </TabsTrigger>
            <TabsTrigger value="video" className="font-medium">
              Video Introduction
            </TabsTrigger>
            <TabsTrigger value="certificates" className="font-medium">
              Certificates
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="p-6 space-y-6 m-0 bg-white">
          <OverviewTab profileData={profileData} isEditing={isEditing} form={form} />
        </TabsContent>

        <TabsContent value="experience" className="p-6 bg-white m-0">
          <ExperienceTab experience={profileData.experience || []} isEditing={isEditing} form={form} />
        </TabsContent>

        <TabsContent value="education" className="p-6 m-0 bg-white">
          <EducationTab education={profileData.education || []} isEditing={isEditing} form={form} />
        </TabsContent>

        <TabsContent value="projects" className="p-6 bg-white m-0">
          <ProjectsTab projects={profileData.projects || []} isEditing={isEditing} form={form} />
        </TabsContent>

        <TabsContent value="video" className="p-6 bg-white m-0">
          <VideoInterviewTab videoInterview={profileData.videoInterview} isEditing={isEditing} form={form} />
        </TabsContent>
        
        <TabsContent value="certificates" className="p-6 bg-white m-0">
          <CertificatesTab certificates={profileData.certificates || []} isEditing={isEditing} form={form} />
        </TabsContent>
      </Tabs>
    </div>;
};
export default ProfileTabs;