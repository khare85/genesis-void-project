import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Briefcase, GraduationCap, Award, FileText, Video, Globe, Mail, Phone, MapPin, User, Calendar, Download, PlayCircle, Share, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CompleteCandidateProfile } from '@/hooks/recruiter/useCompleteCandidateProfile';
import { AIInterviewTab } from './tabs/AIInterviewTab';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import VideoPlayer from './VideoPlayer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScheduleInterviewModal } from './ScheduleInterviewModal';

interface ComprehensiveProfileProps {
  profile: CompleteCandidateProfile;
}

export const ComprehensiveProfile: React.FC<ComprehensiveProfileProps> = ({ profile }) => {
  const [showVideo, setShowVideo] = useState(false);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [selectedApplicationIndex, setSelectedApplicationIndex] = useState(0);
  const [scheduleInterviewOpen, setScheduleInterviewOpen] = useState(false);
  
  // Mock data for multiple job applications
  const mockApplications = profile.applicationDetails ? 
    [profile.applicationDetails] : 
    [];
    
  // If we don't have real applications, add some mock ones for UI demonstration
  if (mockApplications.length === 0) {
    mockApplications.push({
      status: 'pending',
      matchScore: 85,
      dateApplied: new Date().toLocaleDateString(),
      position: 'Frontend Developer',
      resume: 'https://example.com/resume.pdf',
      videoIntro: profile.avatar, // Using avatar as fallback
      screeningNotes: 'Good candidate with strong React skills.'
    });
    
    // Add some additional mock applications
    mockApplications.push({
      status: 'approved',
      matchScore: 92,
      dateApplied: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      position: 'Senior React Developer',
      resume: 'https://example.com/resume2.pdf',
      videoIntro: profile.avatar, // Using avatar as fallback
      screeningNotes: 'Excellent candidate with advanced React and state management skills.'
    });
    
    mockApplications.push({
      status: 'interview',
      matchScore: 78,
      dateApplied: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      position: 'Full Stack Developer',
      resume: 'https://example.com/resume3.pdf',
      videoIntro: profile.avatar, // Using avatar as fallback
      screeningNotes: 'Good frontend skills, backend skills need verification during technical interview.'
    });
  }
  
  const currentApplication = mockApplications[selectedApplicationIndex];
  
  const handleDownloadResume = () => {
    if (currentApplication?.resume) {
      window.open(currentApplication.resume, '_blank');
    }
  };
  
  const handleScheduleInterview = () => {
    setScheduleInterviewOpen(true);
  };

  const handleShareProfile = async () => {
    try {
      // Create a shareable URL (this would be a real implementation)
      const shareableUrl = `${window.location.origin}/candidate-profile/${profile.id}`;
      
      // Copy to clipboard
      await navigator.clipboard.writeText(shareableUrl);
      toast.success('Profile link copied to clipboard!');
    } catch (error) {
      console.error('Error sharing profile:', error);
      toast.error('Failed to share profile');
    }
  };
  
  const handleShareVideo = async () => {
    try {
      if (!currentApplication?.videoIntro) {
        toast.error('No video available to share');
        return;
      }
      
      // Extract the path from the URL (this assumes the video URL is a Supabase storage URL)
      // In a real application, you'd need to handle various URL formats
      const videoUrl = currentApplication.videoIntro;
      const urlObj = new URL(videoUrl);
      const pathParts = urlObj.pathname.split('/');
      const bucketName = pathParts[1];
      const filePath = pathParts.slice(2).join('/');
      
      // Generate a signed URL that expires in 7 days (604800 seconds)
      const { data, error } = await supabase
        .storage
        .from(bucketName)
        .createSignedUrl(filePath, 604800);
      
      if (error) {
        throw error;
      }
      
      // Copy the URL to clipboard
      await navigator.clipboard.writeText(data.signedUrl);
      toast.success('Shareable video link copied to clipboard! Link valid for 7 days.');
    } catch (error) {
      console.error('Error generating shareable video link:', error);
      toast.error('Failed to generate shareable video link');
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Job Application Selector */}
      {mockApplications.length > 1 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-medium">Application History</h3>
                <p className="text-sm text-muted-foreground">
                  This candidate has applied to {mockApplications.length} positions
                </p>
              </div>
              <Select 
                value={selectedApplicationIndex.toString()} 
                onValueChange={(value) => setSelectedApplicationIndex(parseInt(value))}
              >
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="Select application" />
                </SelectTrigger>
                <SelectContent>
                  {mockApplications.map((app, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {app.position} - {app.dateApplied} 
                      <Badge className="ml-2" variant={
                        app.status === 'approved' ? 'default' : 
                        app.status === 'rejected' ? 'destructive' : 
                        'secondary'
                      }>
                        {app.status === 'rejected' ? 'Not Selected' : app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </Badge>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between gap-4 flex-wrap">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={handleDownloadResume}
            disabled={!currentApplication?.resume}
          >
            <Download className="h-4 w-4" />
            Download Resume
          </Button>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={handleShareProfile}
          >
            <Share className="h-4 w-4" />
            Share Profile
          </Button>
        </div>
        
        <Button className="gap-2" onClick={handleScheduleInterview}>
          <Calendar className="h-4 w-4" />
          Schedule Interview
        </Button>
      </div>
      
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0 relative"
                onMouseEnter={() => setShowVideo(true)}
                onMouseLeave={() => setShowVideo(false)}
            >
              <Avatar className={`h-24 w-24 border transition-opacity duration-300 ${showVideo && currentApplication?.videoIntro ? 'opacity-0' : 'opacity-100'}`}>
                <AvatarImage src={profile.avatar} alt={profile.name} />
                <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              {showVideo && currentApplication?.videoIntro && (
                <div className="absolute inset-0 z-10">
                  <video 
                    src={currentApplication.videoIntro} 
                    className="h-24 w-24 object-cover rounded-full cursor-pointer"
                    autoPlay 
                    muted 
                    onClick={(e) => {
                      e.stopPropagation();
                      setVideoDialogOpen(true);
                    }}
                  />
                  <div className="absolute bottom-0 right-0 bg-primary rounded-full p-1">
                    <Maximize className="h-4 w-4 text-white" />
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex-grow space-y-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <h2 className="text-2xl font-bold">{profile.name}</h2>
                  <p className="text-muted-foreground">{profile.title}</p>
                </div>
                
                {currentApplication && (
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      currentApplication.status === 'approved' ? 'default' : 
                      currentApplication.status === 'rejected' ? 'destructive' : 
                      'secondary'
                    }>
                      {currentApplication.status.charAt(0).toUpperCase() + currentApplication.status.slice(1)}
                    </Badge>
                    
                    {currentApplication.matchScore > 0 && (
                      <Badge variant="outline" className="ml-2">
                        Match: {currentApplication.matchScore}%
                      </Badge>
                    )}
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.location}</span>
                </div>
                {currentApplication && (
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>Applied: {currentApplication.dateApplied}</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 pt-2">
                {Object.entries(profile.links).map(([key, value]) => {
                  if (!value) return null;
                  return (
                    <Button 
                      key={key} 
                      variant="outline" 
                      size="sm" 
                      className="h-8"
                      onClick={() => window.open(value, '_blank')}
                    >
                      <Globe className="mr-1 h-3 w-3" />
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Bio */}
      {profile.bio && (
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{profile.bio}</p>
          </CardContent>
        </Card>
      )}
      
      {/* Application Details */}
      {currentApplication && currentApplication.screeningNotes && (
        <Card>
          <CardHeader>
            <CardTitle>Application Notes</CardTitle>
            <CardDescription>
              Position: {currentApplication.position}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-line">{currentApplication.screeningNotes}</p>
          </CardContent>
        </Card>
      )}
      
      {/* Tabs for different sections */}
      <Tabs defaultValue="skills" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-6">
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
          <TabsTrigger value="ai-interview">AI Interview</TabsTrigger>
        </TabsList>
        
        {/* Skills Tab */}
        <TabsContent value="skills" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
              <CardDescription>Professional skills and proficiency levels</CardDescription>
            </CardHeader>
            <CardContent>
              {profile.skills.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {profile.skills.map(skill => (
                    <div key={skill.id} className="flex items-center justify-between">
                      <span>{skill.skill_name}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <div 
                            key={i}
                            className={`h-2 w-6 mx-0.5 rounded-full ${i < skill.skill_level ? 'bg-primary' : 'bg-muted'}`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No skills listed</p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Languages</CardTitle>
              <CardDescription>Language proficiencies</CardDescription>
            </CardHeader>
            <CardContent>
              {profile.languages.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {profile.languages.map(language => (
                    <div key={language.id} className="flex items-center justify-between">
                      <span>{language.language_name}</span>
                      <Badge variant="outline">{language.proficiency}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No languages listed</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Experience Tab */}
        <TabsContent value="experience" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Work Experience</CardTitle>
              <CardDescription>Professional background and career history</CardDescription>
            </CardHeader>
            <CardContent>
              {profile.experience.length > 0 ? (
                <div className="space-y-6">
                  {profile.experience.map((exp, index) => (
                    <div key={exp.id} className="relative">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{exp.title}</h4>
                          <div className="flex items-center">
                            <Briefcase className="h-4 w-4 mr-1 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">{exp.company}</p>
                            {exp.location && (
                              <>
                                <span className="mx-1 text-muted-foreground">•</span>
                                <p className="text-sm text-muted-foreground">{exp.location}</p>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1 md:mt-0">
                          {new Date(exp.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                          {' - '}
                          {exp.current 
                            ? 'Present' 
                            : exp.end_date 
                              ? new Date(exp.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
                              : 'Present'
                          }
                        </div>
                      </div>
                      {exp.description && (
                        <p className="text-sm mt-2">{exp.description}</p>
                      )}
                      {index < profile.experience.length - 1 && <Separator className="my-4" />}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No experience listed</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Education Tab */}
        <TabsContent value="education" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Education</CardTitle>
              <CardDescription>Academic background and qualifications</CardDescription>
            </CardHeader>
            <CardContent>
              {profile.education.length > 0 ? (
                <div className="space-y-6">
                  {profile.education.map((edu, index) => (
                    <div key={edu.id} className="relative">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{edu.degree}</h4>
                          <div className="flex items-center">
                            <GraduationCap className="h-4 w-4 mr-1 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">{edu.institution}</p>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1 md:mt-0">
                          {new Date(edu.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                          {' - '}
                          {edu.end_date 
                            ? new Date(edu.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
                            : 'Present'
                          }
                        </div>
                      </div>
                      {edu.description && (
                        <p className="text-sm mt-2">{edu.description}</p>
                      )}
                      {index < profile.education.length - 1 && <Separator className="my-4" />}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No education listed</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Projects Tab */}
        <TabsContent value="projects" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
              <CardDescription>Personal and professional projects</CardDescription>
            </CardHeader>
            <CardContent>
              {profile.projects.length > 0 ? (
                <div className="space-y-6">
                  {profile.projects.map((project, index) => (
                    <div key={project.id} className="relative">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                        <h4 className="font-semibold">{project.title}</h4>
                        {project.link && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 mt-1 md:mt-0"
                            onClick={() => window.open(project.link, '_blank')}
                          >
                            <Globe className="mr-1 h-3 w-3" />
                            View Project
                          </Button>
                        )}
                      </div>
                      {project.description && (
                        <p className="text-sm mt-2">{project.description}</p>
                      )}
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {project.technologies.map((tech, i) => (
                            <Badge key={i} variant="outline">{tech}</Badge>
                          ))}
                        </div>
                      )}
                      {index < profile.projects.length - 1 && <Separator className="my-4" />}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No projects listed</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Certificates Tab */}
        <TabsContent value="certificates" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Certificates</CardTitle>
              <CardDescription>Professional certifications and qualifications</CardDescription>
            </CardHeader>
            <CardContent>
              {profile.certificates.length > 0 ? (
                <div className="space-y-6">
                  {profile.certificates.map((cert, index) => (
                    <div key={cert.id} className="relative">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{cert.name}</h4>
                          <div className="flex items-center">
                            <Award className="h-4 w-4 mr-1 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1 md:mt-0">
                          {cert.issue_date && new Date(cert.issue_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                          {cert.expiry_date && ` - ${new Date(cert.expiry_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}`}
                        </div>
                      </div>
                      {cert.credential_id && (
                        <p className="text-sm mt-1">Credential ID: {cert.credential_id}</p>
                      )}
                      {index < profile.certificates.length - 1 && <Separator className="my-4" />}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No certificates listed</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* AI Interview Tab */}
        <TabsContent value="ai-interview" className="pt-4">
          <AIInterviewTab profile={profile} />
        </TabsContent>
      </Tabs>
      
      {/* Resume and Video Intro (if available from application) */}
      {currentApplication && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentApplication.resume && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Resume
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleDownloadResume}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <iframe 
                  src={currentApplication.resume} 
                  className="w-full h-[500px] border rounded"
                  title="Resume Preview"
                />
              </CardContent>
            </Card>
          )}
          
          {currentApplication.videoIntro && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <Video className="mr-2 h-5 w-5" />
                  Video Introduction
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleShareVideo}
                >
                  <Share className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="relative rounded-md overflow-hidden aspect-video bg-muted">
                  <video 
                    src={currentApplication.videoIntro} 
                    poster={profile.avatar} 
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => setVideoDialogOpen(true)}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div 
                      className="bg-primary rounded-full p-3 cursor-pointer"
                      onClick={() => setVideoDialogOpen(true)}
                    >
                      <PlayCircle className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
      
      {/* Video Dialog for full-screen viewing */}
      <Dialog open={videoDialogOpen} onOpenChange={setVideoDialogOpen}>
        <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden">
          <div className="aspect-video w-full">
            {currentApplication?.videoIntro && (
              <video 
                src={currentApplication.videoIntro} 
                poster={profile.avatar}
                controls 
                autoPlay
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Schedule Interview Modal */}
      <ScheduleInterviewModal
        isOpen={scheduleInterviewOpen}
        onClose={() => setScheduleInterviewOpen(false)}
        candidateId={profile.id}
        candidateName={profile.name}
        candidateEmail={profile.email}
      />
    </div>
  );
};
