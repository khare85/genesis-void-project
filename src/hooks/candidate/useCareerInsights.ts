
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DEMO_USERS } from '@/lib/auth/mockUsers';

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

// Mock data for demo users
const MOCK_INSIGHTS: CareerInsight = {
  profileStrength: 85,
  suggestedImprovements: [
    "Add more project details",
    "Expand on leadership experiences",
    "Include measurable achievements"
  ],
  careerPathRecommendations: [
    {
      title: "Senior Developer",
      explanation: "Your skills align well with leadership positions in development teams."
    },
    {
      title: "Solutions Architect",
      explanation: "Your technical breadth and system design experience suggest architect roles."
    }
  ],
  skillGaps: "Consider strengthening your cloud infrastructure knowledge, particularly with containerization technologies like Kubernetes.",
  marketTrends: "Full-stack developers with React and Node.js expertise are in high demand, with increasing need for cloud deployment experience.",
  interviewPerformance: "Practice explaining complex technical concepts in simple terms. Focus on your problem-solving approach rather than just the solution.",
  resumeEnhancement: "Highlight your experience with modern JavaScript frameworks and emphasize specific performance improvements you've implemented."
};

export const useCareerInsights = () => {
  const { user } = useAuth();
  const [insights, setInsights] = useState<CareerInsight | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);
  const isDemoUser = user ? Object.values(DEMO_USERS).some(demoUser => demoUser.id === user.id) : false;

  // Function to fetch insights
  const fetchInsights = async (forceRefresh = false) => {
    if (!user) {
      setError('User not authenticated');
      return;
    }

    // For demo users, return mock data immediately
    if (isDemoUser) {
      setInsights(MOCK_INSIGHTS);
      setLastFetched(new Date());
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // First check if we have cached insights in the database and not forcing refresh
      if (!forceRefresh) {
        const { data: cachedInsights, error: fetchError } = await supabase
          .from('candidate_insights')
          .select('insights, generated_at')
          .eq('candidate_id', user.id)
          .maybeSingle();

        if (cachedInsights && !fetchError) {
          // Fix: Explicitly cast the JSON data to our CareerInsight type
          setInsights(cachedInsights.insights as unknown as CareerInsight);
          setLastFetched(new Date(cachedInsights.generated_at));
          setIsLoading(false);
          return;
        }
      }
      
      // If no cached insights or forced refresh, call the edge function
      const { data, error } = await supabase.functions.invoke('generate-career-insights', {
        body: { userId: user.id }
      });

      if (error) throw error;
      
      // Fix: Explicitly cast the insights data to our CareerInsight type
      setInsights(data.insights as unknown as CareerInsight);
      setLastFetched(new Date());
      toast.success("Career insights generated successfully!");
    } catch (err) {
      console.error('Error fetching career insights:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch career insights');
      toast.error('Failed to generate career insights. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load insights on component mount only if we don't have them already
  useEffect(() => {
    if (!user || insights || isLoading) return;

    if (isDemoUser) {
      // For demo users, set mock insights immediately
      setInsights(MOCK_INSIGHTS);
      setLastFetched(new Date());
      return;
    }

    const checkForCachedInsights = async () => {
      try {
        const { data, error } = await supabase
          .from('candidate_insights')
          .select('insights, generated_at')
          .eq('candidate_id', user.id)
          .maybeSingle();

        if (data && !error) {
          setInsights(data.insights as unknown as CareerInsight);
          setLastFetched(new Date(data.generated_at));
        }
      } catch (err) {
        console.error('Error checking for cached insights:', err);
      }
    };
    
    checkForCachedInsights();
  }, [user, insights, isLoading, isDemoUser]);

  return {
    insights,
    isLoading,
    error,
    lastFetched,
    refetchInsights: () => fetchInsights(true)
  };
};
