
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface OpenAICredits {
  totalCredits: number;
  usedCredits: number;
  availableCredits: number;
}

export const useOpenAICredits = () => {
  return useQuery({
    queryKey: ["openai-credits"],
    queryFn: async (): Promise<OpenAICredits> => {
      try {
        const { data, error } = await supabase.functions.invoke("get-openai-credits");
        
        if (error) {
          console.error("Error fetching OpenAI credits:", error);
          throw error;
        }
        
        return data as OpenAICredits;
      } catch (error) {
        console.error("Failed to fetch OpenAI credits:", error);
        toast.error("Failed to fetch AI credits");
        // Return mock data as fallback
        return {
          totalCredits: 10,
          usedCredits: 4.38,
          availableCredits: 5.62
        };
      }
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
