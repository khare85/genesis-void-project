
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Make request to OpenAI API to fetch usage data
    const response = await fetch('https://api.openai.com/v1/dashboard/billing/subscription', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const subscriptionData = await response.json();
    
    // Get usage for the current billing period
    const usageResponse = await fetch(
      'https://api.openai.com/v1/dashboard/billing/usage?start_date=' + 
      getStartOfMonth() + '&end_date=' + getEndOfMonth(),
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!usageResponse.ok) {
      const errorText = await usageResponse.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${usageResponse.status}`);
    }

    const usageData = await usageResponse.json();

    // Calculate available credits
    const totalCredits = subscriptionData.hard_limit_usd;
    const usedCredits = usageData.total_usage / 100; // Convert from cents to dollars
    const availableCredits = totalCredits - usedCredits;

    return new Response(
      JSON.stringify({
        totalCredits,
        usedCredits,
        availableCredits
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in get-openai-credits function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        // Return mock data as fallback
        totalCredits: 10,
        usedCredits: 4.38,
        availableCredits: 5.62
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

// Helper functions to get date ranges
function getStartOfMonth() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  return startOfMonth.toISOString().split('T')[0];
}

function getEndOfMonth() {
  const now = new Date();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return endOfMonth.toISOString().split('T')[0];
}
