
export interface ScreeningCandidate {
  id: number | string;
  name: string;
  email: string;
  phone: string;
  location: string;
  status: "pending" | "approved" | "rejected" | string;
  dateApplied: string;
  jobRole: string;
  skills: string[];
  experience: string;
  education: string;
  avatar: string;
  videoIntro: string;
  matchScore: number;
  matchCategory: "High Match" | "Medium Match" | "Low Match" | "No Match";
  screeningScore: number;
  screeningNotes: string;
  aiSummary: string;
  reviewTime: number;
  position: string;
  stage?: number; // Added stage property
  applicationDate?: string; // Added applicationDate property
}

export type ScreeningState = 'idle' | 'running' | 'completed' | 'failed';
