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
        const { data, error } = await supabase.functions.invoke("get-openai-credits");

        if (error) {
          console.error("Supabase error:", error);
          throw new Error("Failed to fetch OpenAI credits");
        }

        // Validate structure
        if (
          typeof data?.totalCredits !== "number" ||
          typeof data?.usedCredits !== "number" ||
          typeof data?.availableCredits !== "number"
        ) {
          throw new Error("Invalid data format");
        }

        return data as OpenAICredits;
      } catch (err: any) {
        console.error("Fetch error:", err);
        toast.error("Failed to fetch AI credits — using fallback.");

        // Optional: return mock data with flag
        return {
          totalCredits: 10,
          usedCredits: 4.38,
          availableCredits: 5.62,
          isMock: true,
        };
      }
    },
    refetchOnWindowFocus: false,
    retry: (failureCount, error: any) => {
      // Retry up to 2 times unless it's a 500
      return failureCount < 2 && error?.status !== 500;
    },
  });
};
