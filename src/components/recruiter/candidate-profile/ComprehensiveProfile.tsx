import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Briefcase, GraduationCap, Award, FileText, Video, Globe, Mail, Phone, MapPin, Calendar, Download, PlayCircle, Share, Maximize, FileCheck } from 'lucide-react';
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
      const shareableUrl = `${window.location.origin}/candidate-profile/${profile.id}`;
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
      
      const videoUrl = currentApplication.videoIntro;
      const urlObj = new URL(videoUrl);
      const pathParts = urlObj.pathname.split('/');
      const bucketName = pathParts[1];
      const filePath = pathParts.slice(2).join('/');
      
      const { data, error } = await supabase
        .storage
        .from(bucketName)
        .createSignedUrl(filePath, 604800);
      
      if (error) {
        throw error;
      }
      
      await navigator.clipboard.writeText(data.signedUrl);
      toast.success('Shareable video link copied to clipboard! Link valid for 7 days.');
    } catch (error) {
      console.error('Error generating shareable video link:', error);
      toast.error('Failed to generate shareable video link');
    }
  };
  
  return (
    <div className="space-y-5 max-w-[1200px] mx-auto">
      {/* Action Buttons */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex gap-3">
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
        
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700" onClick={handleScheduleInterview}>
          <Calendar className="h-4 w-4" />
          Schedule Interview
        </Button>
      </div>
      
      {/* Profile Header */}
      <Card className="shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0 relative"
                onMouseEnter={() => setShowVideo(true)}
                onMouseLeave={() => setShowVideo(false)}
            >
              <Avatar className={`h-24 w-24 border-2 border-gray-200 shadow-sm transition-opacity duration-300 ${showVideo && currentApplication?.videoIntro ? 'opacity-0' : 'opacity-100'}`}>
                <AvatarImage src={profile.avatar} alt={profile.name} />
                <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              {showVideo && currentApplication?.videoIntro && (
                <div className="absolute inset-0 z-10">
                  <video 
                    src={currentApplication.videoIntro} 
                    className="h-24 w-24 object-cover rounded-full cursor-pointer border-2 border-blue-500"
                    autoPlay 
                    muted 
                    onClick={(e) => {
                      e.stopPropagation();
                      setVideoDialogOpen(true);
                    }}
                  />
                  <div className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-1 shadow-md">
                    <Maximize className="h-4 w-4 text-white" />
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex-grow space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{profile.name}</h1>
                  <p className="text-gray-600 font-medium">{profile.title}</p>
                </div>
                
                {currentApplication && (
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      currentApplication.status === 'approved' ? 'default' : 
                      currentApplication.status === 'rejected' ? 'destructive' : 
                      'secondary'
                    } className="capitalize text-xs px-3 py-1 rounded-full">
                      {currentApplication.status === 'rejected' ? 'Not Selected' : currentApplication.status}
                    </Badge>
                    
                    {currentApplication.matchScore > 0 && (
                      <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200 px-3 py-1 rounded-full">
                        Match: {currentApplication.matchScore}%
                      </Badge>
                    )}
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-6 pt-1">
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{profile.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{profile.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{profile.location}</span>
                </div>
                {currentApplication && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <FileCheck className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Applied: {currentApplication.dateApplied}</span>
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
                      className="h-8 text-xs bg-gray-50 hover:bg-gray-100"
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
        <Card className="shadow-sm border border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-800">About</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm leading-relaxed text-gray-700">{profile.bio}</p>
          </CardContent>
        </Card>
      )}
      
      {/* Application Details */}
      {currentApplication && currentApplication.screeningNotes && (
        <Card className="shadow-sm border border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-800">Application Notes</CardTitle>
            <CardDescription className="text-gray-600">
              Position: {currentApplication.position}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm whitespace-pre-line text-gray-700">{currentApplication.screeningNotes}</p>
          </CardContent>
        </Card>
      )}
      
      {/* Tabs for different sections */}
      <Card className="shadow-sm border border-gray-200 overflow-hidden">
        <CardContent className="p-0">
          <Tabs defaultValue="skills" className="w-full">
            <TabsList className="flex w-full border-b h-auto bg-white rounded-none px-1">
              <TabsTrigger value="skills" className="rounded-none">Skills</TabsTrigger>
              <TabsTrigger value="experience" className="rounded-none">Experience</TabsTrigger>
              <TabsTrigger value="education" className="rounded-none">Education</TabsTrigger>
              <TabsTrigger value="projects" className="rounded-none">Projects</TabsTrigger>
              <TabsTrigger value="certificates" className="rounded-none">Certificates</TabsTrigger>
              <TabsTrigger value="ai-interview" className="rounded-none">AI Interview</TabsTrigger>
            </TabsList>
            
            {/* Skills Tab */}
            <TabsContent value="skills" className="p-6 pt-4 space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Skills</h3>
                <p className="text-sm text-gray-600 mb-4">Professional skills and proficiency levels</p>
                
                {profile.skills.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {profile.skills.map(skill => (
                      <div key={skill.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <span className="font-medium text-gray-700">{skill.skill_name}</span>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <div 
                              key={i}
                              className={`h-2 w-5 rounded-full ${i < skill.skill_level ? 'bg-blue-500' : 'bg-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-gray-500">No skills listed</p>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Languages</h3>
                <p className="text-sm text-gray-600 mb-4">Language proficiencies</p>
                
                {profile.languages.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {profile.languages.map(language => (
                      <div key={language.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <span className="font-medium text-gray-700">{language.language_name}</span>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {language.proficiency}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-gray-500">No languages listed</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Experience Tab */}
            <TabsContent value="experience" className="p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Work Experience</h3>
              <p className="text-sm text-gray-600 mb-4">Professional background and career history</p>
              
              {profile.experience.length > 0 ? (
                <div className="space-y-5">
                  {profile.experience.map((exp, index) => (
                    <div key={exp.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-800">{exp.title}</h4>
                          <div className="flex items-center">
                            <Briefcase className="h-4 w-4 mr-1 text-gray-500" />
                            <p className="text-sm text-gray-600">{exp.company}</p>
                            {exp.location && (
                              <>
                                <span className="mx-1 text-gray-400">•</span>
                                <p className="text-sm text-gray-600">{exp.location}</p>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500 mt-1 md:mt-0 bg-white px-3 py-1 rounded-full text-xs">
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
                        <p className="text-sm mt-2 text-gray-700 leading-relaxed">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-gray-500">No experience listed</p>
                </div>
              )}
            </TabsContent>
            
            {/* Education Tab */}
            <TabsContent value="education" className="p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Education</h3>
              <p className="text-sm text-gray-600 mb-4">Academic background and qualifications</p>
              
              {profile.education.length > 0 ? (
                <div className="space-y-5">
                  {profile.education.map((edu, index) => (
                    <div key={edu.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-800">{edu.degree}</h4>
                          <div className="flex items-center">
                            <GraduationCap className="h-4 w-4 mr-1 text-gray-500" />
                            <p className="text-sm text-gray-600">{edu.institution}</p>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500 mt-1 md:mt-0 bg-white px-3 py-1 rounded-full text-xs">
                          {new Date(edu.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                          {' - '}
                          {edu.end_date 
                            ? new Date(edu.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
                            : 'Present'
                          }
                        </div>
                      </div>
                      {edu.description && (
                        <p className="text-sm mt-2 text-gray-700 leading-relaxed">{edu.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-gray-500">No education listed</p>
                </div>
              )}
            </TabsContent>
            
            {/* Projects Tab */}
            <TabsContent value="projects" className="p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Projects</h3>
              <p className="text-sm text-gray-600 mb-4">Personal and professional projects</p>
              
              {profile.projects.length > 0 ? (
                <div className="space-y-5">
                  {profile.projects.map((project, index) => (
                    <div key={project.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-800">{project.title}</h4>
                        {project.link && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 mt-1 md:mt-0 bg-white"
                            onClick={() => window.open(project.link, '_blank')}
                          >
                            <Globe className="mr-1 h-3 w-3" />
                            View Project
                          </Button>
                        )}
                      </div>
                      {project.description && (
                        <p className="text-sm mt-2 text-gray-700 leading-relaxed">{project.description}</p>
                      )}
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {project.technologies.map((tech, i) => (
                            <Badge key={i} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{tech}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-gray-500">No projects listed</p>
                </div>
              )}
            </TabsContent>
            
            {/* Certificates Tab */}
            <TabsContent value="certificates" className="p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Certificates</h3>
              <p className="text-sm text-gray-600 mb-4">Professional certifications and qualifications</p>
              
              {profile.certificates.length > 0 ? (
                <div className="space-y-5">
                  {profile.certificates.map((cert, index) => (
                    <div key={cert.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-800">{cert.name}</h4>
                          <div className="flex items-center">
                            <Award className="h-4 w-4 mr-1 text-gray-500" />
                            <p className="text-sm text-gray-600">{cert.issuer}</p>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500 mt-1 md:mt-0 bg-white px-3 py-1 rounded-full text-xs">
                          {cert.issue_date && new Date(cert.issue_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                          {cert.expiry_date && ` - ${new Date(cert.expiry_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}`}
                        </div>
                      </div>
                      {cert.credential_id && (
                        <p className="text-sm mt-1 text-gray-600">Credential ID: {cert.credential_id}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-gray-500">No certificates listed</p>
                </div>
              )}
            </TabsContent>
            
            {/* AI Interview Tab */}
            <TabsContent value="ai-interview" className="p-6">
              <AIInterviewTab profile={profile} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Resume and Video Intro cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {currentApplication && currentApplication.resume && (
          <Card className="shadow-sm border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="flex items-center text-lg font-medium text-gray-800">
                <FileText className="mr-2 h-5 w-5 text-gray-600" />
                Resume
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleDownloadResume}
                className="h-8 w-8 p-0"
              >
                <Download className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md overflow-hidden bg-gray-50">
                <iframe 
                  src={currentApplication.resume} 
                  className="w-full h-[400px] border-0"
                  title="Resume Preview"
                />
              </div>
            </CardContent>
          </Card>
        )}
        
        {currentApplication && currentApplication.videoIntro && (
          <Card className="shadow-sm border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="flex items-center text-lg font-medium text-gray-800">
                <Video className="mr-2 h-5 w-5 text-gray-600" />
                Video Introduction
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleShareVideo}
                className="h-8 w-8 p-0"
              >
                <Share className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="relative rounded-md overflow-hidden aspect-video bg-gray-100">
                <video 
                  src={currentApplication.videoIntro} 
                  poster={profile.avatar} 
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setVideoDialogOpen(true)}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors">
                  <div 
                    className="bg-blue-600 hover:bg-blue-700 rounded-full p-3 cursor-pointer transition-colors"
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
