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
  return <Card>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b bg-white rounded-xl">
          <TabsList className="mx-6 my-2 bg-transparent">
            <TabsTrigger value="overview" className="data-[state=active]:bg-muted font-bold">Overview</TabsTrigger>
            <TabsTrigger value="experience" className="data-[state=active]:bg-muted">Experience</TabsTrigger>
            <TabsTrigger value="education" className="data-[state=active]:bg-muted">Education</TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-muted">Projects</TabsTrigger>
            <TabsTrigger value="video" className="data-[state=active]:bg-muted">Video Introduction</TabsTrigger>
            <TabsTrigger value="certificates" className="data-[state=active]:bg-muted">Certificates</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="p-6 space-y-6 rounded-2xl">
          <OverviewTab profileData={profileData} isEditing={isEditing} form={form} />
        </TabsContent>

        <TabsContent value="experience" className="p-6">
          <ExperienceTab experience={profileData.experience || []} isEditing={isEditing} form={form} />
        </TabsContent>

        <TabsContent value="education" className="p-6">
          <EducationTab education={profileData.education || []} isEditing={isEditing} form={form} />
        </TabsContent>

        <TabsContent value="projects" className="p-6">
          <ProjectsTab projects={profileData.projects || []} isEditing={isEditing} form={form} />
        </TabsContent>

        <TabsContent value="video" className="p-6">
          <VideoInterviewTab videoInterview={profileData.videoInterview} isEditing={isEditing} form={form} />
        </TabsContent>
        
        <TabsContent value="certificates" className="p-6">
          <CertificatesTab certificates={profileData.certificates || []} isEditing={isEditing} form={form} />
        </TabsContent>
      </Tabs>
    </Card>;
};
export default ProfileTabs;