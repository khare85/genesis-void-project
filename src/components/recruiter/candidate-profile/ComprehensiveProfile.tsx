
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Calendar, Download, FileText, Mail, MapPin, Phone, Video, Link2, MessageSquare } from 'lucide-react';
import { OverviewTab } from '@/components/profile/tabs/OverviewTab';
import { ExperienceTab } from '@/components/profile/tabs/ExperienceTab';
import { EducationTab } from '@/components/profile/tabs/EducationTab';
import { ProjectsTab } from '@/components/profile/tabs/ProjectsTab';
import { CertificatesTab } from '@/components/profile/tabs/CertificatesTab';
import { VideoInterviewTab } from '@/components/profile/tabs/VideoInterviewTab';
import { CompleteCandidateProfile } from '@/hooks/recruiter/useCompleteCandidateProfile';
import { ScheduleInterviewModal } from './ScheduleInterviewModal';
import { ResumeViewer } from './ResumeViewer';
import SkillsList from './SkillsList';
import { NotesSection } from './NotesSection';
import { AIInterviewTab } from './tabs/AIInterviewTab';
import { Separator } from '@/components/ui/separator';
import MatchScoreRing from '@/components/shared/MatchScoreRing';

interface ComprehensiveProfileProps {
  profile: CompleteCandidateProfile;
}

export const ComprehensiveProfile: React.FC<ComprehensiveProfileProps> = ({ profile }) => {
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  const getSocialIcon = (url: string | null) => {
    if (!url) return null;
    
    if (url.includes('github')) return 'GitHub';
    if (url.includes('linkedin')) return 'LinkedIn';
    if (url.includes('twitter')) return 'Twitter';
    return 'Web';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left Sidebar */}
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <Avatar className="h-16 w-16">
                <AvatarImage src={profile.avatar} alt={profile.name} />
                <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold">{profile.name}</h2>
                <p className="text-muted-foreground">{profile.title}</p>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{profile.phone}</span>
              </div>
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{profile.location}</span>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              <h3 className="text-sm font-medium">Social Links</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(profile.links).map(([key, url]) => 
                  url ? (
                    <Button key={key} variant="outline" size="sm" asChild className="h-8">
                      <a href={url} target="_blank" rel="noopener noreferrer">
                        <Link2 className="h-3.5 w-3.5 mr-1" />
                        {getSocialIcon(url)}
                      </a>
                    </Button>
                  ) : null
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <Button onClick={() => setIsInterviewModalOpen(true)} className="w-full flex items-center justify-center gap-2">
                <Video className="h-4 w-4" />
                Schedule Interview
              </Button>
              
              <Button variant="outline" className="w-full flex items-center justify-center gap-2" onClick={() => setIsResumeModalOpen(true)}>
                <Download className="h-4 w-4" />
                View Resume
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="font-medium mb-4">Skills</h3>
            <SkillsList skills={profile.skills} />
          </CardContent>
        </Card>
        
        <NotesSection candidateId={profile.id} />
        
        {profile.applicationDetails && (
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium mb-4">Application Details</h3>
              
              <div className="space-y-4">
                {profile.applicationDetails.matchScore > 0 && (
                  <div className="flex items-center gap-3 mb-2">
                    <MatchScoreRing 
                      score={profile.applicationDetails.matchScore} 
                      size={60} 
                      strokeWidth={5} 
                    />
                    <div>
                      <span className="text-sm text-muted-foreground">Match Score</span>
                      <p className="font-medium">{profile.applicationDetails.matchScore}% Match</p>
                    </div>
                  </div>
                )}
                
                <div>
                  <span className="text-sm text-muted-foreground block">Position</span>
                  <p>{profile.applicationDetails.position || 'Not specified'}</p>
                </div>
                
                <div>
                  <span className="text-sm text-muted-foreground block">Application Date</span>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{profile.applicationDetails.dateApplied}</span>
                  </div>
                </div>
                
                <div>
                  <span className="text-sm text-muted-foreground block">Status</span>
                  <div className="mt-1">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {profile.applicationDetails.status.charAt(0).toUpperCase() + profile.applicationDetails.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Main Content */}
      <div className="md:col-span-2">
        <Card>
          <Tabs defaultValue="overview">
            <div className="p-6 pb-2 border-b">
              <TabsList className="grid grid-cols-3 md:grid-cols-7">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="certificates">Certificates</TabsTrigger>
                <TabsTrigger value="video">Video</TabsTrigger>
                <TabsTrigger value="interviews">Interviews</TabsTrigger>
              </TabsList>
            </div>
            
            <CardContent className="p-6">
              <TabsContent value="overview" className="mt-0 space-y-4">
                <OverviewTab bio={profile.bio} />
              </TabsContent>
              
              <TabsContent value="experience" className="mt-0">
                <ExperienceTab experience={profile.experience} />
              </TabsContent>
              
              <TabsContent value="education" className="mt-0">
                <EducationTab education={profile.education} />
              </TabsContent>
              
              <TabsContent value="projects" className="mt-0">
                <ProjectsTab projects={profile.projects} />
              </TabsContent>
              
              <TabsContent value="certificates" className="mt-0">
                <CertificatesTab certificates={profile.certificates} />
              </TabsContent>
              
              <TabsContent value="video" className="mt-0">
                <VideoInterviewTab 
                  videoUrl={profile.applicationDetails?.videoIntro || ''} 
                />
              </TabsContent>
              
              <TabsContent value="interviews" className="mt-0">
                <AIInterviewTab candidateId={profile.id} name={profile.name} />
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>

      <ScheduleInterviewModal 
        open={isInterviewModalOpen} 
        onOpenChange={setIsInterviewModalOpen}
        candidateId={profile.id}
        candidateName={profile.name}
      />
      
      <ResumeViewer 
        open={isResumeModalOpen} 
        onOpenChange={setIsResumeModalOpen} 
        resumeUrl={profile.applicationDetails?.resume || ''} 
      />
    </div>
  );
};
