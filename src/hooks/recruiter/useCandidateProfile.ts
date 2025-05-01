
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
            .select('*, candidate:profiles!candidate_id(*)')
            .eq('id', id)
            .maybeSingle();

          if (data && data.candidate) {
            // Found an application with this ID
            const profile = data.candidate;
            
            setCandidate({
              id: data.id,
              candidate_id: data.candidate_id,
              name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown',
              email: profile.email || 'No email provided',
              phone: profile.phone || 'No phone provided',
              position: profile.title || 'Unknown position',
              status: data.status || 'pending',
              matchScore: data.match_score || 85,
              applicationDate: data.created_at ? new Date(data.created_at).toLocaleDateString() : 'Unknown',
              resume: data.resume_url || '',
              avatar: profile.avatar_url || '',
              location: profile.location || 'Unknown location',
              experience: '0',
              education: 'Not specified',
              salary: 'Not specified',
              skills: [],
              videoIntro: data.video_url || '',
              stage: 0,
              notes: data.notes || ''
            });
          } else {
            // Try one more approach - look for applications where candidate_id matches our ID
            const { data: candidateData, error: candidateError } = await supabase
              .from('applications')
              .select('*, candidate:profiles!candidate_id(*)')
              .eq('candidate_id', id)
              .maybeSingle();
              
            if (candidateData && candidateData.candidate) {
              // Found an application with this candidate_id
              const profile = candidateData.candidate;
              
              setCandidate({
                id: candidateData.id,
                candidate_id: candidateData.candidate_id,
                name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown',
                email: profile.email || 'No email provided',
                phone: profile.phone || 'No phone provided',
                position: profile.title || 'Unknown position',
                status: candidateData.status || 'pending',
                matchScore: candidateData.match_score || 85,
                applicationDate: candidateData.created_at ? new Date(candidateData.created_at).toLocaleDateString() : 'Unknown',
                resume: candidateData.resume_url || '',
                avatar: profile.avatar_url || '',
                location: profile.location || 'Unknown location',
                experience: '0',
                education: 'Not specified',
                salary: 'Not specified',
                skills: [],
                videoIntro: candidateData.video_url || '',
                stage: 0,
                notes: candidateData.notes || ''
              });
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
