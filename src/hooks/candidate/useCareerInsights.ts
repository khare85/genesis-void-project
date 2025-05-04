
import { useState } from 'react';

export type CareerInsight = {
  profileStrength: number;
  suggestedImprovements: string[];
  careerPathRecommendations: Array<{
    title: string;
    explanation: string;
  }>;
  skillGaps: string;
  marketTrends: string;
  interviewPerformance: string;
  resumeEnhancement: string;
};

export const useCareerInsights = () => {
  const [insights, setInsights] = useState<CareerInsight | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  // This hook is now disabled, so all functions do nothing
  const fetchInsights = async () => {
    // No-op
  };

  return {
    insights: null,
    isLoading: false,
    error: null,
    lastFetched: null,
    refetchInsights: () => Promise.resolve()
  };
};
