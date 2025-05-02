
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
        // Create a timeout promise
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Request timed out")), 5000);
        });

        // Create the actual fetch promise
        const fetchPromise = supabase.functions.invoke("get-openai-credits");

        // Race the promises
        const result = await Promise.race([fetchPromise, timeoutPromise]);
        
        // Properly await and type the Supabase response
        const response = await result;
        
        // Type assertion since we know the expected structure
        const responseData = response as { data?: OpenAICredits; error?: { message: string } };
        
        if (responseData.error) {
          console.error("Supabase error:", responseData.error);
          throw new Error(`Failed to fetch OpenAI credits: ${responseData.error.message}`);
        }

        // Validate structure
        if (
          !responseData.data ||
          typeof responseData.data?.totalCredits !== "number" ||
          typeof responseData.data?.usedCredits !== "number" ||
          typeof responseData.data?.availableCredits !== "number"
        ) {
          console.warn("Invalid data format from API:", responseData.data);
          throw new Error("Invalid data format");
        }

        return responseData.data as OpenAICredits;
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
