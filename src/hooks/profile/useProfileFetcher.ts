import { useState, useEffect } from 'react';
import { ProfileData } from '@/types/profile';
import { useAuth } from '@/lib/auth';
import { mapDataToProfileData } from './utils/profileDataMappers';
import { DEMO_USERS } from '@/lib/auth/mockUsers';
import { supabase } from '@/integrations/supabase/client';

// Updated to properly export the hook
export const useProfileFetcher = (
  setProfileData: (data: ProfileData) => void,
  setIsLoading: (loading: boolean) => void,
  setShowCompletionGuide: (show: boolean) => void
) => {
  const { user } = useAuth();
  const isDemoUser = user ? Object.values(DEMO_USERS).some(demoUser => demoUser.id === user.id) : false;

  const fetchProfileData = async () => {
    if (!user?.id) return;

    // For demo users, use the default data
    if (isDemoUser) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // Fetch all required profile data in parallel using Promise.all
      const [
        profileResult,
        skillsResult,
        languagesResult,
        experienceResult,
        educationResult,
        certificatesResult,
        projectsResult
      ] = await Promise.all([
        fetchProfileInfo(user.id),
        fetchSkills(user.id),
        fetchLanguages(user.id),
        fetchExperience(user.id),
        fetchEducation(user.id),
        fetchCertificates(user.id),
        fetchProjects(user.id)
      ]);

      // Additionally fetch resume URL
      const resumeUrl = await fetchResumeUrls(user.id);

      // Map the data to our ProfileData format
      const data = mapDataToProfileData({
        profile: profileResult.data,
        skills: skillsResult.data,
        languages: languagesResult.data,
        experience: experienceResult.data,
        education: educationResult.data,
        certificates: certificatesResult.data,
        projects: projectsResult.data,
        resumeUrl,
      });

      // Update the state with the fetched profile data
      setProfileData(data);

      // Check if we should show the completion guide
      const isProfileIncomplete = !data.skills.length || 
                                 !data.experience.length || 
                                 !data.education.length || 
                                 !resumeUrl;

      setShowCompletionGuide(isProfileIncomplete);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Functions to fetch individual parts of the profile
  const fetchProfileInfo = async (userId: string) => {
    return await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
  };

  const fetchSkills = async (userId: string) => {
    return await supabase
      .from('candidate_skills')
      .select('*')
      .eq('candidate_id', userId);
  };

  const fetchLanguages = async (userId: string) => {
    return await supabase
      .from('candidate_languages')
      .select('*')
      .eq('candidate_id', userId);
  };

  const fetchExperience = async (userId: string) => {
    return await supabase
      .from('candidate_experience')
      .select('*')
      .eq('candidate_id', userId)
      .order('start_date', { ascending: false });
  };

  const fetchEducation = async (userId: string) => {
    return await supabase
      .from('candidate_education')
      .select('*')
      .eq('candidate_id', userId);
  };

  const fetchCertificates = async (userId: string) => {
    return await supabase
      .from('candidate_certificates')
      .select('*')
      .eq('candidate_id', userId);
  };

  const fetchProjects = async (userId: string) => {
    return await supabase
      .from('candidate_projects')
      .select('*')
      .eq('candidate_id', userId);
  };

  // Update this part in useProfileFetcher.ts where it fetches the resume URL
  const fetchResumeUrls = async (userId: string) => {
    // First check applications table for a resume
    const { data: applications } = await supabase
      .from('applications')
      .select('resume_url')
      .eq('candidate_id', userId)
      .not('resume_url', 'is', null)
      .order('created_at', { ascending: false });
    
    if (applications && applications.length > 0 && applications[0].resume_url) {
      console.log('Found resume URL from applications table:', applications[0].resume_url);
      return applications[0].resume_url;
    }
    
    // If not found in applications, check profiles table
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    // Note: We're changing this part because 'resume_url' doesn't exist in the profiles table
    // We'll use a different field if available, or skip this check
      
    // Check onboarding progress in localStorage
    const onboardingProgress = localStorage.getItem(`onboarding_progress_${userId}`);
    if (onboardingProgress) {
      try {
        const progress = JSON.parse(onboardingProgress);
        if (progress.resumeData && progress.resumeData.uploadedUrl) {
          console.log('Found resume URL from onboarding progress:', progress.resumeData.uploadedUrl);
          return progress.resumeData.uploadedUrl;
        }
      } catch (e) {
        console.error('Error parsing onboarding progress:', e);
      }
    }
    
    console.log('No resume URL found for user:', userId);
    return null;
  };

  return { fetchProfileData };
};
