
import { supabase } from '@/integrations/supabase/client';
import { formatDateForDB } from './dateFormatters';
import { ProfileData } from '@/types/profile';

/**
 * Update basic profile information
 */
export const updateProfileInfo = async (userId: string, profileData: ProfileData) => {
  return await supabase
    .from('profiles')
    .update({
      bio: profileData.personal.bio,
      location: profileData.personal.location,
      title: profileData.personal.title,
      portfolio_url: profileData.personal.links.portfolio,
      github_url: profileData.personal.links.github,
      linkedin_url: profileData.personal.links.linkedin, 
      twitter_url: profileData.personal.links.twitter,
      phone: profileData.personal.phone,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);
};

/**
 * Clear and update skills for a user
 */
export const updateSkills = async (userId: string, skills: ProfileData['skills']) => {
  // First delete existing skills
  const deleteResult = await supabase
    .from('candidate_skills')
    .delete()
    .eq('candidate_id', userId);
  
  if (deleteResult.error) throw deleteResult.error;
  
  // Skip insert if no skills to add
  if (!skills || skills.length === 0) return { error: null };
  
  // Then insert new skills
  return await supabase
    .from('candidate_skills')
    .insert(skills.map(skill => ({
      candidate_id: userId,
      skill_name: skill.name,
      skill_level: skill.level
    })));
};

/**
 * Clear and update languages for a user
 */
export const updateLanguages = async (userId: string, languages: ProfileData['languages']) => {
  // First delete existing languages
  const deleteResult = await supabase
    .from('candidate_languages')
    .delete()
    .eq('candidate_id', userId);
  
  if (deleteResult.error) throw deleteResult.error;
  
  // Skip insert if no languages to add
  if (!languages || languages.length === 0) return { error: null };
  
  // Then insert new languages
  return await supabase
    .from('candidate_languages')
    .insert(languages.map(lang => ({
      candidate_id: userId,
      language_name: lang.name,
      proficiency: lang.proficiency
    })));
};

/**
 * Clear and update education entries for a user
 */
export const updateEducation = async (userId: string, education: ProfileData['education']) => {
  // First delete existing education entries
  const deleteResult = await supabase
    .from('candidate_education')
    .delete()
    .eq('candidate_id', userId);
  
  if (deleteResult.error) throw deleteResult.error;
  
  // Skip insert if no education entries to add
  if (!education || education.length === 0) return { error: null };
  
  // Then insert new education entries
  return await supabase
    .from('candidate_education')
    .insert(education.map(edu => ({
      candidate_id: userId,
      institution: edu.institution,
      degree: edu.degree,
      start_date: formatDateForDB(edu.startDate),
      end_date: formatDateForDB(edu.endDate),
      description: edu.description
    })));
};

/**
 * Clear and update certificates for a user
 */
export const updateCertificates = async (userId: string, certificates: ProfileData['certificates']) => {
  // First delete existing certificates
  const deleteResult = await supabase
    .from('candidate_certificates')
    .delete()
    .eq('candidate_id', userId);
  
  if (deleteResult.error) throw deleteResult.error;
  
  // Skip insert if no certificates to add
  if (!certificates || certificates.length === 0) return { error: null };
  
  // Then insert new certificates
  return await supabase
    .from('candidate_certificates')
    .insert(certificates.map(cert => ({
      candidate_id: userId,
      name: cert.name,
      issuer: cert.issuer,
      issue_date: formatDateForDB(cert.issueDate),
      expiry_date: formatDateForDB(cert.expiryDate),
      credential_id: cert.credentialId
    })));
};

/**
 * Clear and update projects for a user
 */
export const updateProjects = async (userId: string, projects: ProfileData['projects']) => {
  // First delete existing projects
  const deleteResult = await supabase
    .from('candidate_projects')
    .delete()
    .eq('candidate_id', userId);
  
  if (deleteResult.error) throw deleteResult.error;
  
  // Skip insert if no projects to add
  if (!projects || projects.length === 0) return { error: null };
  
  // Then insert new projects
  return await supabase
    .from('candidate_projects')
    .insert(projects.map(project => ({
      candidate_id: userId,
      title: project.title,
      description: project.description,
      link: project.link,
      technologies: project.technologies
    })));
};

/**
 * Clear and update experience entries for a user
 */
export const updateExperience = async (userId: string, experience: ProfileData['experience']) => {
  // First delete existing experience entries
  const deleteResult = await supabase
    .from('candidate_experience')
    .delete()
    .eq('candidate_id', userId);
  
  if (deleteResult.error) throw deleteResult.error;
  
  // Skip insert if no experience entries to add
  if (!experience || experience.length === 0) return { error: null };
  
  // Then insert new experience entries
  return await supabase
    .from('candidate_experience')
    .insert(experience.map(exp => ({
      candidate_id: userId,
      company: exp.company,
      title: exp.title,
      location: exp.location,
      start_date: formatDateForDB(exp.startDate),
      end_date: formatDateForDB(exp.endDate),
      current: exp.current,
      description: exp.description
    })));
};
