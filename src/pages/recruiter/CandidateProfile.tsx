
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageHeader from '@/components/shared/PageHeader';
import { User } from 'lucide-react';
import { useCandidateProfile } from '@/hooks/recruiter/useCandidateProfile';
import CandidateProfileSidebar from '@/components/recruiter/candidate-profile/CandidateProfileSidebar';
import ResumeViewer from '@/components/recruiter/candidate-profile/ResumeViewer';
import VideoPlayer from '@/components/recruiter/candidate-profile/VideoPlayer';
import SkillsList from '@/components/recruiter/candidate-profile/SkillsList';
import NotesSection from '@/components/recruiter/candidate-profile/NotesSection';

const CandidateProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { candidate, loading } = useCandidateProfile(id);

  if (loading) {
    return (
      <div className="container py-10">
        <div className="flex items-center justify-center h-64">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="container py-10">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <User className="h-16 w-16 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold">Candidate Not Found</h2>
            <p className="text-muted-foreground">The candidate you are looking for does not exist or you don't have permission to view them.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      <PageHeader
        title={candidate.name}
        description={candidate.position}
        icon={<User className="h-6 w-6" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar with candidate info */}
        <div>
          <CandidateProfileSidebar candidate={candidate} />
        </div>

        {/* Main content area with tabs */}
        <div className="col-span-2">
          <Tabs defaultValue="resume">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="resume">Resume</TabsTrigger>
              <TabsTrigger value="video">Video Intro</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="resume" className="mt-6">
              <ResumeViewer resumeUrl={candidate.resume} />
            </TabsContent>
            
            <TabsContent value="video" className="mt-6">
              <VideoPlayer videoUrl={candidate.videoIntro} />
            </TabsContent>
            
            <TabsContent value="skills" className="mt-6">
              <SkillsList skills={candidate.skills} />
            </TabsContent>
            
            <TabsContent value="notes" className="mt-6">
              <NotesSection notes={candidate.notes} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
