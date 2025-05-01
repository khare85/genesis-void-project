
export interface ScreeningCandidate {
  id: number | string;
  candidate_id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  status: "pending" | "approved" | "rejected" | string;
  dateApplied?: string;
  jobRole?: string;
  skills: string[];
  experience: string;
  education: string;
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
  salary?: string;
  notes?: string;
}

export type ScreeningState = 'idle' | 'running' | 'completed' | 'failed';
