
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetch basic profile information for a user
 */
export const fetchProfileInfo = async (userId: string) => {
  return await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
};

/**
 * Fetch skills for a user
 */
export const fetchSkills = async (userId: string) => {
  return await supabase
    .from('candidate_skills')
    .select('*')
    .eq('candidate_id', userId);
};

/**
 * Fetch languages for a user
 */
export const fetchLanguages = async (userId: string) => {
  return await supabase
    .from('candidate_languages')
    .select('*')
    .eq('candidate_id', userId);
};

/**
 * Fetch experience for a user
 */
export const fetchExperience = async (userId: string) => {
  return await supabase
    .from('candidate_experience')
    .select('*')
    .eq('candidate_id', userId)
    .order('start_date', { ascending: false });
};

/**
 * Fetch education for a user
 */
export const fetchEducation = async (userId: string) => {
  return await supabase
    .from('candidate_education')
    .select('*')
    .eq('candidate_id', userId);
};

/**
 * Fetch certificates for a user
 */
export const fetchCertificates = async (userId: string) => {
  return await supabase
    .from('candidate_certificates')
    .select('*')
    .eq('candidate_id', userId);
};

/**
 * Fetch projects for a user
 */
export const fetchProjects = async (userId: string) => {
  return await supabase
    .from('candidate_projects')
    .select('*')
    .eq('candidate_id', userId);
};
