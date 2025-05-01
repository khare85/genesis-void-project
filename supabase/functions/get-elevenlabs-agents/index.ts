
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const elevenlabsApiKey = Deno.env.get("ELEVEN_LABS_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // If we don't have an API key, return mock data
    if (!elevenlabsApiKey) {
      return new Response(
        JSON.stringify({
          agents: [
            { id: "pNInz6obpgDQGcFmaJgB", name: "AI Interviewer (Male)" },
            { id: "XrExE9yKIg1WjnnlVkGX", name: "AI Interviewer (Female)" },
            { id: "EXAVITQu4vr4xnSDxMaL", name: "Professional Recruiter" }
          ]
        }),
        {
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Fetch voices from ElevenLabs API
    const response = await fetch("https://api.elevenlabs.io/v1/voices", {
      method: "GET",
      headers: {
        "xi-api-key": elevenlabsApiKey,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Map the voices to a simpler format for our frontend
    const agents = data.voices.map((voice: any) => ({
      id: voice.voice_id,
      name: voice.name,
    }));

    console.log(`Successfully fetched ${agents.length} voices from ElevenLabs`);

    return new Response(
      JSON.stringify({
        agents,
      }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Error in get-elevenlabs-agents function:", error);
    
    return new Response(
      JSON.stringify({
        error: error.message,
        agents: [
          { id: "pNInz6obpgDQGcFmaJgB", name: "AI Interviewer (Male)" },
          { id: "XrExE9yKIg1WjnnlVkGX", name: "AI Interviewer (Female)" },
          { id: "EXAVITQu4vr4xnSDxMaL", name: "Professional Recruiter" }
        ]
      }),
      {
        status: 200, // Still return 200 with mock data on error
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
