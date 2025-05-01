
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ScreeningCandidate } from '@/types/screening';

export const useCandidateProfile = (id: string | undefined) => {
  const [candidate, setCandidate] = useState<ScreeningCandidate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidate = async () => {
      setLoading(true);
      try {
        if (!id) {
          toast.error('No candidate ID provided');
          setLoading(false);
          return;
        }

        // First, try to fetch the profile directly
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (profileData) {
          // Successfully found a profile
          const candidateData: ScreeningCandidate = {
            id: profileData.id,
            candidate_id: profileData.id,
            name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || 'Unknown',
            email: profileData.email || 'No email provided',
            phone: profileData.phone || 'No phone provided',
            position: profileData.title || 'Unknown position',
            status: 'pending',
            matchScore: 85, // Default match score
            applicationDate: 'Unknown date',
            location: profileData.location || 'Unknown location',
            experience: '0',
            education: 'Not specified',
            salary: 'Not specified',
            skills: [],
            avatar: profileData.avatar_url || '',
            videoIntro: '',
            stage: 0,
            notes: '',
            resume: '' // No resume_url in profiles table
          };
          setCandidate(candidateData);
        } else {
          // If not found by ID directly, try to find an application with this ID
          const { data, error } = await supabase
            .from('applications')
            .select(`*, candidate_id`)
            .eq('id', id)
            .maybeSingle();

          if (data) {
            // Found an application with this ID - now fetch the associated profile
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.candidate_id)
              .maybeSingle();
            
            if (profileData) {
              setCandidate({
                id: data.id,
                candidate_id: data.candidate_id,
                name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || 'Unknown',
                email: profileData.email || 'No email provided',
                phone: profileData.phone || 'No phone provided',
                position: profileData.title || 'Unknown position',
                status: data.status || 'pending',
                matchScore: data.match_score || 85,
                applicationDate: data.created_at ? new Date(data.created_at).toLocaleDateString() : 'Unknown',
                resume: data.resume_url || '',
                avatar: profileData.avatar_url || '',
                location: profileData.location || 'Unknown location',
                experience: '0',
                education: 'Not specified',
                salary: 'Not specified',
                skills: [],
                videoIntro: data.video_url || '',
                stage: 0,
                notes: data.notes || ''
              });
            } else {
              console.error('Profile not found for candidate ID:', data.candidate_id);
              toast.error('Profile data not found');
              setCandidate(null);
            }
          } else {
            // Try one more approach - look for applications where candidate_id matches our ID
            const { data: applicationData, error: applicationError } = await supabase
              .from('applications')
              .select(`*`)
              .eq('candidate_id', id)
              .maybeSingle();
              
            if (applicationData) {
              // Found an application with this candidate_id - now fetch the profile
              const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', id)
                .maybeSingle();
              
              if (profileData) {
                setCandidate({
                  id: applicationData.id,
                  candidate_id: applicationData.candidate_id,
                  name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || 'Unknown',
                  email: profileData.email || 'No email provided',
                  phone: profileData.phone || 'No phone provided',
                  position: profileData.title || 'Unknown position',
                  status: applicationData.status || 'pending',
                  matchScore: applicationData.match_score || 85,
                  applicationDate: applicationData.created_at ? new Date(applicationData.created_at).toLocaleDateString() : 'Unknown',
                  resume: applicationData.resume_url || '',
                  avatar: profileData.avatar_url || '',
                  location: profileData.location || 'Unknown location',
                  experience: '0',
                  education: 'Not specified',
                  salary: 'Not specified',
                  skills: [],
                  videoIntro: applicationData.video_url || '',
                  stage: 0,
                  notes: applicationData.notes || ''
                });
              } else {
                console.error('Profile not found for ID:', id);
                toast.error('Profile data not found');
                setCandidate(null);
              }
            } else {
              // Fall back to sample data if nothing is found
              toast.error('Candidate not found');
              
              // You could set a fallback from your sample data here if needed
              setCandidate(null);
            }
          }
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

  return { candidate, loading };
};
