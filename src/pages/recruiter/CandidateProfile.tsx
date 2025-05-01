
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScreeningCandidate } from '@/types/screening';
import PageHeader from '@/components/shared/PageHeader';
import { User } from 'lucide-react';
import { toast } from 'sonner';

const CandidateProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [candidate, setCandidate] = useState<ScreeningCandidate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidate = async () => {
      setLoading(true);
      try {
        // Fetch candidate details from the database
        const { data, error } = await supabase
          .from('candidates')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        // If we found the candidate, set them in state
        if (data) {
          setCandidate({
            id: data.id,
            name: data.name || 'Unknown',
            email: data.email || 'No email provided',
            position: data.position || 'Unknown position',
            status: data.status || 'pending',
            matchScore: data.match_score || 85,
            applicationDate: data.application_date || 'Unknown date',
            resume: data.resume_url || '',
            avatar: data.avatar_url || '',
            phone: data.phone || 'No phone provided',
            experience: data.years_experience || 0,
            location: data.location || 'Unknown location',
            salary: data.salary_expectation || 'Not specified',
            education: data.education || 'Not specified',
            skills: data.skills || [],
            videoIntro: data.video_url || '',
            stage: data.stage || 0,
            notes: data.notes || ''
          });
        } else {
          toast.error('Candidate not found');
        }
      } catch (error) {
        console.error('Error fetching candidate:', error);
        toast.error('Failed to load candidate data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCandidate();
    }
  }, [id]);

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
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center mb-6">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={candidate.avatar} alt={candidate.name} />
                  <AvatarFallback>{candidate.name?.charAt(0) || 'C'}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">{candidate.name}</h2>
                <p className="text-muted-foreground">{candidate.position}</p>
                <div className="flex items-center justify-center mt-2">
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    {candidate.matchScore}% Match
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                  <p>{candidate.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                  <p>{candidate.phone}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                  <p>{candidate.location}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Experience</h3>
                  <p>{candidate.experience} years</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Salary Expectation</h3>
                  <p>{candidate.salary}</p>
                </div>
              </div>

              <div className="mt-6">
                <Button className="w-full">Contact Candidate</Button>
              </div>
            </CardContent>
          </Card>
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
              <Card>
                <CardContent className="p-6">
                  {candidate.resume ? (
                    <iframe 
                      src={candidate.resume} 
                      className="w-full h-[600px] border-0"
                      title={`${candidate.name}'s resume`}
                    />
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-muted-foreground">No resume available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="video" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  {candidate.videoIntro ? (
                    <video 
                      controls
                      className="w-full aspect-video"
                      src={candidate.videoIntro}
                    />
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-muted-foreground">No video introduction available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="skills" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills && candidate.skills.length > 0 ? (
                      candidate.skills.map((skill, index) => (
                        <span 
                          key={index}
                          className="bg-muted px-2.5 py-0.5 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No skills listed</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notes" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  {candidate.notes ? (
                    <p className="whitespace-pre-wrap">{candidate.notes}</p>
                  ) : (
                    <p className="text-muted-foreground">No notes available</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
