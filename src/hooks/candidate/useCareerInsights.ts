
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  const { user } = useAuth();
  const [insights, setInsights] = useState<CareerInsight | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  // Function to fetch insights
  const fetchInsights = async (forceRefresh = false) => {
    if (!user) {
      setError('User not authenticated');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // First check if we have cached insights in the database
      if (!forceRefresh) {
        const { data: cachedInsights, error: fetchError } = await supabase
          .from('candidate_insights')
          .select('insights, generated_at')
          .eq('candidate_id', user.id)
          .maybeSingle();

        // If we have cached insights that are less than 24 hours old, use them
        if (cachedInsights && !fetchError) {
          const generatedAt = new Date(cachedInsights.generated_at);
          const now = new Date();
          const hoursSinceGeneration = (now.getTime() - generatedAt.getTime()) / (1000 * 60 * 60);
          
          if (hoursSinceGeneration < 24) {
            setInsights(cachedInsights.insights);
            setLastFetched(generatedAt);
            setIsLoading(false);
            return;
          }
        }
      }
      
      // If no cached insights or forced refresh, call the edge function
      const { data, error } = await supabase.functions.invoke('generate-career-insights', {
        body: { userId: user.id }
      });

      if (error) throw error;
      
      setInsights(data.insights);
      setLastFetched(new Date());
    } catch (err) {
      console.error('Error fetching career insights:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch career insights');
      toast.error('Failed to generate career insights. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch insights on component mount
  useEffect(() => {
    if (user && !insights && !isLoading) {
      fetchInsights();
    }
  }, [user]);

  return {
    insights,
    isLoading,
    error,
    lastFetched,
    refetchInsights: () => fetchInsights(true)
  };
};
