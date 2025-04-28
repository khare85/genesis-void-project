
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import OverviewTab from './tabs/OverviewTab';
import ExperienceTab from './tabs/ExperienceTab';
import EducationTab from './tabs/EducationTab';
import ProjectsTab from './tabs/ProjectsTab';
import VideoInterviewTab from './tabs/VideoInterviewTab';

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
    <Card>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b">
          <TabsList className="mx-6 my-2 bg-transparent">
            <TabsTrigger value="overview" className="data-[state=active]:bg-muted">Overview</TabsTrigger>
            <TabsTrigger value="experience" className="data-[state=active]:bg-muted">Experience</TabsTrigger>
            <TabsTrigger value="education" className="data-[state=active]:bg-muted">Education</TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-muted">Projects</TabsTrigger>
            <TabsTrigger value="video" className="data-[state=active]:bg-muted">Video Introduction</TabsTrigger>
            <TabsTrigger value="certificates" className="data-[state=active]:bg-muted">Certificates</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="p-6 space-y-6">
          <OverviewTab profileData={profileData} isEditing={isEditing} form={form} />
        </TabsContent>

        <TabsContent value="experience" className="p-6">
          <ExperienceTab experience={profileData.experience} isEditing={isEditing} form={form} />
        </TabsContent>

        <TabsContent value="education" className="p-6">
          <EducationTab education={profileData.education} isEditing={isEditing} form={form} />
        </TabsContent>

        <TabsContent value="projects" className="p-6">
          <ProjectsTab projects={profileData.projects} isEditing={isEditing} form={form} />
        </TabsContent>

        <TabsContent value="video" className="p-6">
          <VideoInterviewTab videoInterview={profileData.videoInterview} isEditing={isEditing} form={form} />
        </TabsContent>
        
        <TabsContent value="certificates" className="p-6">
          {/* We'll leverage the existing tabs pattern but use certificates data */}
          <div className="mb-5">
            <h3 className="text-lg font-medium">Certificates</h3>
            <p className="text-muted-foreground">Manage your professional certifications and achievements</p>
          </div>
          
          <div className="space-y-4">
            {profileData.certificates && profileData.certificates.map((certificate: any, index: number) => (
              <div key={certificate.id || index} className="border p-4 rounded-md">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium">{certificate.name}</h4>
                    <p className="text-sm text-muted-foreground">{certificate.issuer}</p>
                    <p className="text-sm text-muted-foreground">
                      {certificate.issueDate} - {certificate.expiryDate || 'No Expiration'}
                    </p>
                    {certificate.credentialId && (
                      <p className="text-sm mt-1">Credential ID: {certificate.credentialId}</p>
                    )}
                  </div>
                  {isEditing && (
                    <div className="flex space-x-2">
                      {/* Edit/Delete buttons would go here in edit mode */}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {(!profileData.certificates || profileData.certificates.length === 0) && (
              <div className="text-center p-8 border border-dashed rounded-md">
                <p className="text-muted-foreground">No certificates added yet</p>
                {isEditing && (
                  <button className="mt-2 text-primary hover:underline text-sm">+ Add Certificate</button>
                )}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default ProfileTabs;
