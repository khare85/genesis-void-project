
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface OpenAICredits {
  totalCredits: number;
  usedCredits: number;
  availableCredits: number;
  isMock?: boolean;
}

export const useOpenAICredits = () => {
  return useQuery<OpenAICredits>({
    queryKey: ["openai-credits"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.functions.invoke("get-openai-credits", {
          // Add error handling timeout
          abortSignal: AbortSignal.timeout(5000) // 5 second timeout
        });

        if (error) {
          console.error("Supabase error:", error);
          throw new Error(`Failed to fetch OpenAI credits: ${error.message}`);
        }

        // Validate structure
        if (
          typeof data?.totalCredits !== "number" ||
          typeof data?.usedCredits !== "number" ||
          typeof data?.availableCredits !== "number"
        ) {
          console.warn("Invalid data format from API:", data);
          throw new Error("Invalid data format");
        }

        return data as OpenAICredits;
      } catch (err: any) {
        console.error("Fetch error:", err);
        // Silent fallback for better UX - just logging the error
        console.log("Using fallback AI credits data");

        // Return mock data with flag
        return {
          totalCredits: 10,
          usedCredits: 4.38,
          availableCredits: 5.62,
          isMock: true,
        };
      }
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: (failureCount, error: any) => {
      // Retry up to 2 times unless it's a 500
      return failureCount < 2 && !error?.message?.includes('500');
    },
    // Don't show global error, we handle it locally
    meta: {
      errorMessage: false
    },
    // Add shorter staleTime to balance between freshness and performance
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
