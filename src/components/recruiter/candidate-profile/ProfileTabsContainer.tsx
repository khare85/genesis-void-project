
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CompleteCandidateProfile } from '@/hooks/recruiter/useCompleteCandidateProfile';
import { AIInterviewTab } from './tabs/AIInterviewTab';
import ProfileSkillsTab from './ProfileTabs/ProfileSkillsTab';
import ProfileExperienceTab from './ProfileTabs/ProfileExperienceTab';
import ProfileEducationTab from './ProfileTabs/ProfileEducationTab';
import ProfileProjectsTab from './ProfileTabs/ProfileProjectsTab';
import ProfileCertificatesTab from './ProfileTabs/ProfileCertificatesTab';

interface ProfileTabsContainerProps {
  profile: CompleteCandidateProfile;
}

const ProfileTabsContainer: React.FC<ProfileTabsContainerProps> = ({ profile }) => {
  const [activeTab, setActiveTab] = useState("skills");
  
  return (
    <Card className="shadow-md border border-gray-200 overflow-hidden bg-white">
      <CardContent className="p-0 bg-white">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full bg-white">
          <TabsList className="flex w-full border-b h-auto bg-white rounded-none px-1">
            <TabsTrigger value="skills" className="rounded-none">Skills</TabsTrigger>
            <TabsTrigger value="experience" className="rounded-none">Experience</TabsTrigger>
            <TabsTrigger value="education" className="rounded-none">Education</TabsTrigger>
            <TabsTrigger value="projects" className="rounded-none">Projects</TabsTrigger>
            <TabsTrigger value="certificates" className="rounded-none">Certificates</TabsTrigger>
            <TabsTrigger value="ai-interview" className="rounded-none">AI Interview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="skills" className="p-0 bg-white m-0">
            <ProfileSkillsTab profile={profile} />
          </TabsContent>
          
          <TabsContent value="experience" className="p-0 bg-white m-0">
            <ProfileExperienceTab profile={profile} />
          </TabsContent>
          
          <TabsContent value="education" className="p-0 bg-white m-0">
            <ProfileEducationTab profile={profile} />
          </TabsContent>
          
          <TabsContent value="projects" className="p-0 bg-white m-0">
            <ProfileProjectsTab profile={profile} />
          </TabsContent>
          
          <TabsContent value="certificates" className="p-0 bg-white m-0">
            <ProfileCertificatesTab profile={profile} />
          </TabsContent>
          
          <TabsContent value="ai-interview" className="p-0 bg-white m-0">
            <AIInterviewTab profile={profile} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProfileTabsContainer;
