
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Briefcase, GraduationCap, Award, FileText, Video, Globe, Mail, Phone, MapPin, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CompleteCandidateProfile } from '@/hooks/recruiter/useCompleteCandidateProfile';

interface ComprehensiveProfileProps {
  profile: CompleteCandidateProfile;
}

export const ComprehensiveProfile: React.FC<ComprehensiveProfileProps> = ({ profile }) => {
  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <Avatar className="h-24 w-24 border">
                <AvatarImage src={profile.avatar} alt={profile.name} />
                <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            
            <div className="flex-grow space-y-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <h2 className="text-2xl font-bold">{profile.name}</h2>
                  <p className="text-muted-foreground">{profile.title}</p>
                </div>
                
                {profile.applicationDetails && (
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      profile.applicationDetails.status === 'approved' ? 'default' : 
                      profile.applicationDetails.status === 'rejected' ? 'destructive' : 
                      'secondary'
                    }>
                      {profile.applicationDetails.status.charAt(0).toUpperCase() + profile.applicationDetails.status.slice(1)}
                    </Badge>
                    
                    {profile.applicationDetails.matchScore > 0 && (
                      <Badge variant="outline" className="ml-2">
                        Match: {profile.applicationDetails.matchScore}%
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
                {profile.applicationDetails && (
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>Applied: {profile.applicationDetails.dateApplied}</span>
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
      {profile.applicationDetails && profile.applicationDetails.screeningNotes && (
        <Card>
          <CardHeader>
            <CardTitle>Application Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-line">{profile.applicationDetails.screeningNotes}</p>
          </CardContent>
        </Card>
      )}
      
      {/* Tabs for different sections */}
      <Tabs defaultValue="skills" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
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
      </Tabs>
      
      {/* Resume and Video Intro (if available from application) */}
      {profile.applicationDetails && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profile.applicationDetails.resume && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Resume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <iframe 
                  src={profile.applicationDetails.resume} 
                  className="w-full h-[500px] border rounded"
                  title="Resume Preview"
                />
              </CardContent>
            </Card>
          )}
          
          {profile.applicationDetails.videoIntro && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Video className="mr-2 h-5 w-5" />
                  Video Introduction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <video 
                  src={profile.applicationDetails.videoIntro} 
                  controls 
                  className="w-full rounded-md overflow-hidden aspect-video bg-muted"
                >
                  Your browser does not support the video tag.
                </video>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
