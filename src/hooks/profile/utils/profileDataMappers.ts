
import { formatDateForUI } from './dateFormatters';
import { ProfileData } from '@/types/profile';
import { User } from '@/lib/auth/types';

/**
 * Transform raw Supabase data into ProfileData format
 */
export const mapSupabaseToProfileData = (
  profileData: any, 
  skills: any[], 
  languages: any[],
  experience: any[],
  education: any[],
  certificates: any[],
  projects: any[],
  user: any
): ProfileData => {
  return {
    personal: {
      name: `${profileData?.first_name || ''} ${profileData?.last_name || ''}`.trim() || user?.user_metadata?.name || user?.email || 'Anonymous User',
      title: profileData?.title || '',
      email: profileData?.email || user?.email || '',
      phone: profileData?.phone || '',
      location: profileData?.location || '',
      avatarUrl: profileData?.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      bio: profileData?.bio || '',
      links: {
        portfolio: profileData?.portfolio_url || '',
        github: profileData?.github_url || '',
        linkedin: profileData?.linkedin_url || '',
        twitter: profileData?.twitter_url || '',
      }
    },
    skills: skills?.map(skill => ({
      name: skill.skill_name,
      level: skill.skill_level
    })) || [],
    languages: languages?.map(lang => ({
      name: lang.language_name,
      proficiency: lang.proficiency
    })) || [],
    experience: experience?.map((exp) => ({
      id: exp.id,
      company: exp.company,
      title: exp.title,
      location: exp.location,
      startDate: formatDateForUI(exp.start_date),
      endDate: formatDateForUI(exp.end_date),
      current: exp.current,
      description: exp.description,
      skills: []
    })) || [],
    education: education?.map(edu => ({
      id: edu.id,
      institution: edu.institution,
      degree: edu.degree,
      startDate: formatDateForUI(edu.start_date),
      endDate: formatDateForUI(edu.end_date),
      description: edu.description
    })) || [],
    certificates: certificates?.map(cert => ({
      id: cert.id,
      name: cert.name,
      issuer: cert.issuer,
      issueDate: formatDateForUI(cert.issue_date),
      expiryDate: formatDateForUI(cert.expiry_date),
      credentialId: cert.credential_id
    })) || [],
    projects: projects?.map(project => ({
      id: project.id,
      title: project.title,
      description: project.description,
      link: project.link,
      technologies: project.technologies || []
    })) || [],
    resumeUrl: '', // Default empty string
    videoInterview: null
  };
};

/**
 * Get empty profile data for a user
 */
export const getEmptyProfileData = (user: User | null): ProfileData => {
  return {
    personal: {
      name: user?.name || user?.email?.split('@')[0] || 'User',
      title: '',
      email: user?.email || '',
      phone: '',
      location: '',
      avatarUrl: user?.avatarUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      bio: '',
      links: {
        portfolio: '',
        github: '',
        linkedin: '',
        twitter: '',
      }
    },
    skills: [],
    languages: [],
    experience: [],
    education: [],
    certificates: [],
    projects: [],
    resumeUrl: '',
    videoInterview: null
  };
};
