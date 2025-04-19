
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Job } from '@/types/job';

export interface Applicant {
  id: string;
  name: string;
  email: string;
  position?: string;
  status: string;
  matchScore?: number;
  applicationDate: string;
  stage: number;
  profilePic?: string;
  videoIntro?: string;
  skills?: string[];
  videoUrl?: string;
  resumeUrl?: string;
}

export interface JobDetails extends Omit<Job, 'posteddate'> {
  applicants: number;
  newApplicants: number;
  postedDate: string;
  department?: string; // Optional department property
  status?: string; // Add status property as optional
}

export const useJobApplicants = (jobId?: string) => {
  const [job, setJob] = useState<JobDetails | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingApplicants, setIsLoadingApplicants] = useState(true);
  
  // Fetch job data
  useEffect(() => {
    const fetchJob = async () => {
      if (!jobId) return;
      
      setIsLoading(true);
      try {
        console.log(`Fetching job with ID: ${jobId}`);
        // Fetch the job details from Supabase
        const { data: jobData, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', jobId)
          .single();
        
        if (error) {
          console.error("Error fetching job:", error);
          toast.error("Failed to load job details");
          return;
        }
        
        if (jobData) {
          console.log("Job data fetched successfully:", jobData);
          setJob({
            ...jobData,
            id: jobData.id,
            title: jobData.title,
            department: jobData.department || 'Not specified',
            location: jobData.location,
            applicants: 0, // Will be updated after fetching applicants
            newApplicants: 0,
            postedDate: jobData.posteddate,
            status: jobData.status,
            type: jobData.type,
            priority: 'medium', // Set a default priority value
            description: jobData.description || 'No description available'
          });
        }
      } catch (err) {
        console.error("Error in job fetch:", err);
        toast.error("An error occurred while loading job details");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchJob();
  }, [jobId]);
  
  // Fetch applicants data
  useEffect(() => {
    const fetchApplicants = async () => {
      if (!jobId || !job) return;
      
      setIsLoadingApplicants(true);
      try {
        console.log(`Fetching applications for job: ${jobId}`);
        // Fetch applications for this job from Supabase
        const { data: applicationsData, error: applicationsError } = await supabase
          .from('applications')
          .select(`
            id,
            status,
            created_at,
            resume_url,
            video_url,
            screening_score,
            match_score,
            candidate_id
          `)
          .eq('job_id', jobId);
        
        if (applicationsError) {
          console.error("Error fetching applications:", applicationsError);
          toast.error("Failed to load applications");
          return;
        }
        
        console.log(`Found ${applicationsData?.length || 0} applications`);
        
        if (!applicationsData || applicationsData.length === 0) {
          setApplicants([]);
          // Update job applicant count
          setJob(prev => prev ? {
            ...prev,
            applicants: 0,
            newApplicants: 0
          } : null);
          setIsLoadingApplicants(false);
          return;
        }
        
        // Update job applicant count
        setJob(prev => prev ? {
          ...prev,
          applicants: applicationsData.length,
          newApplicants: applicationsData.filter(app => app.status === 'pending').length
        } : null);
        
        // Fetch candidate profiles for each application
        const applicantPromises = applicationsData.map(async (application) => {
          // Fix: Handle the case when profile might not exist
          try {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', application.candidate_id)
              .maybeSingle(); // Use maybeSingle instead of single to handle missing profiles
            
            if (profileError) {
              console.error(`Error fetching profile for candidate ${application.candidate_id}:`, profileError);
              // Return a fallback profile with available application data
              return {
                id: application.id,
                name: 'Unknown Candidate',
                email: 'candidate@example.com',
                position: 'Applicant',
                status: application.status,
                matchScore: application.match_score || Math.floor(Math.random() * 100),
                applicationDate: new Date(application.created_at).toLocaleDateString(),
                stage: Math.floor(Math.random() * 4), // Random stage for demo
                skills: ['JavaScript', 'React'], // Placeholder skills
                videoUrl: application.video_url,
                resumeUrl: application.resume_url
              };
            }
            
            // Generate a random stage for demo (in a real app, this would be stored in the database)
            const randomStage = Math.floor(Math.random() * 4);
            
            return {
              id: application.id,
              name: profileData ? `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || 'Unknown Candidate' : 'Unknown Candidate',
              email: profileData?.email || 'candidate@example.com',
              position: profileData?.title || 'Applicant',
              status: application.status,
              matchScore: application.match_score || Math.floor(Math.random() * 100),
              applicationDate: new Date(application.created_at).toLocaleDateString(),
              stage: randomStage,
              profilePic: profileData?.avatar_url,
              videoIntro: application.video_url,
              skills: ['React', 'TypeScript', 'UI/UX'], // Placeholder skills
              videoUrl: application.video_url,
              resumeUrl: application.resume_url
            };
          } catch (err) {
            console.error(`Error processing application ${application.id}:`, err);
            // Return fallback data on error
            return {
              id: application.id,
              name: 'Unknown Candidate',
              email: 'candidate@example.com',
              position: 'Applicant',
              status: application.status,
              matchScore: application.match_score || Math.floor(Math.random() * 100),
              applicationDate: new Date(application.created_at).toLocaleDateString(),
              stage: Math.floor(Math.random() * 4),
              skills: ['JavaScript', 'React'],
              videoUrl: application.video_url,
              resumeUrl: application.resume_url
            };
          }
        });
        
        const resolvedApplicants = await Promise.all(applicantPromises);
        console.log(`Processed ${resolvedApplicants.length} applicants`);
        setApplicants(resolvedApplicants);
      } catch (err) {
        console.error("Error in applicants fetch:", err);
        toast.error("An error occurred while loading applicants");
      } finally {
        setIsLoadingApplicants(false);
      }
    };
    
    if (job) {
      fetchApplicants();
    }
  }, [jobId, job]);
  
  return {
    job,
    setJob,
    applicants,
    isLoading,
    isLoadingApplicants
  };
};
