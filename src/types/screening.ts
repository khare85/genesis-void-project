
export interface ScreeningCandidate {
  id: number | string;
  candidate_id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  status: "pending" | "approved" | "rejected" | "shortlisted" | "interview" | string;
  dateApplied?: string;
  jobRole?: string;
  skills: string[];
  experience: string;
  education: string;
  salary?: string;
  avatar: string;
  videoIntro: string;
  resume?: string;
  matchScore: number;
  matchCategory?: "High Match" | "Medium Match" | "Low Match" | "No Match";
  screeningScore?: number;
  screeningNotes?: string;
  aiSummary?: string;
  reviewTime?: number;
  position: string;
  stage?: number;
  applicationDate?: string;
  notes?: string;
  company?: string; // Added company field
  applied_date?: string; // Added for compatibility with recent components
  reviewed_date?: string; // Added for compatibility with recent components
  job_id?: string; // Added for compatibility with recent components
  job_title?: string; // Added for compatibility with recent components
}

export type ScreeningState = 'idle' | 'running' | 'completed' | 'failed';

export interface OnboardingProgress {
  hasStarted: boolean;
  step: number;
  completedSteps: {
    resume: boolean;
    video: boolean;
  };
  resumeData: {
    file: File | null;
    text: string | null;
    uploadedUrl: string | null;
  };
  videoData: {
    blob: Blob | null;
    uploadedUrl: string | null;
  };
  isMinimized: boolean;
}

export type OnboardingStep = 'welcome' | 'resume' | 'video' | 'completion';
