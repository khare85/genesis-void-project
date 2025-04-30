
export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  avatarUrl: string;
  bio: string;
  links: {
    portfolio: string;
    github: string;
    linkedin: string;
    twitter: string;
  };
}

export interface ExperienceItem {
  id: number | string;
  company: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
  skills: string[] | any[];
}

export interface EducationItem {
  id: number | string;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface CertificateItem {
  id: number | string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string | null;
  credentialId: string;
}

export interface ProjectItem {
  id: number | string;
  title: string;
  description: string;
  link: string;
  technologies: string[] | any[];
}

export interface SkillItem {
  name: string;
  level: number;
}

export interface LanguageItem {
  name: string;
  proficiency: string;
}

export interface ProfileData {
  personal: PersonalInfo;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillItem[];
  languages: LanguageItem[];
  certificates: CertificateItem[];
  projects: ProjectItem[];
  resumeUrl: string;
  videoInterview: any;
}
