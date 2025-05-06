
import { ReactNode } from 'react';

export interface Interview {
  id: string;
  jobTitle: string;
  company: string;
  type: string;
  date: string;
  time: string;
  status: string;
  statusBadge: "default" | "outline" | "secondary" | "destructive";
  icon: ReactNode;
  notes?: string;
  duration?: string;
  agentId?: string;
  agentName?: string;
}

export interface InterviewData {
  id: string;
  type: string;
  status: string;
  scheduled_at: string;
  duration?: number;
  metadata?: any;
  applications?: {
    jobs?: {
      title?: string;
      company?: string;
    };
    candidate_id?: string;
  };
}

export interface InterviewMetadata {
  candidateId?: string;
  notes?: string;
  agentId?: string;
  selectedAgent?: string;
  [key: string]: any; // Allow other properties
}
