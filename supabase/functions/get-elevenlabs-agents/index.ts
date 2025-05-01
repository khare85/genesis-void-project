
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
            { id: "pNInz6obpgDQGcFmaJgB", name: "Technical Interviewer" },
            { id: "EVQJtCNSo0L6uHQnImQu", name: "AI Recruiter" },
            { id: "EXAVITQu4vr4xnSDxMaL", name: "Professional Recruiter" },
            { id: "XrExE9yKIg1WjnnlVkGX", name: "HR Specialist" }
          ]
        }),
        {
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // First try to fetch Conversational AI agents (preferred)
    const convoResponse = await fetch("https://api.elevenlabs.io/v1/convai/agents", {
      method: "GET",
      headers: {
        "xi-api-key": elevenlabsApiKey,
        "Content-Type": "application/json",
      },
    });

    // If conversational agents API succeeds, use those agents
    if (convoResponse.ok) {
      const data = await convoResponse.json();
      
      // Map the agents to a format for our frontend
      const agents = data.agents?.map((agent: any) => ({
        id: agent.agent_id,
        name: agent.name,
        isConversational: true
      })) || [];

      console.log(`Successfully fetched ${agents.length} conversation agents from ElevenLabs`);

      return new Response(
        JSON.stringify({ agents }),
        {
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    } 
    
    // Fall back to fetching voices
    const voiceResponse = await fetch("https://api.elevenlabs.io/v1/voices", {
      method: "GET",
      headers: {
        "xi-api-key": elevenlabsApiKey,
        "Content-Type": "application/json",
      },
    });

    if (!voiceResponse.ok) {
      throw new Error(`ElevenLabs API error: ${voiceResponse.statusText}`);
    }

    const voiceData = await voiceResponse.json();
    
    // Map the voices to a simpler format for our frontend
    const voiceAgents = voiceData.voices.map((voice: any) => ({
      id: voice.voice_id,
      name: voice.name,
      isConversational: false
    }));

    console.log(`Successfully fetched ${voiceAgents.length} voices from ElevenLabs`);

    return new Response(
      JSON.stringify({
        agents: voiceAgents,
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
          { id: "pNInz6obpgDQGcFmaJgB", name: "Technical Interviewer", isConversational: true },
          { id: "EVQJtCNSo0L6uHQnImQu", name: "AI Recruiter", isConversational: true },
          { id: "EXAVITQu4vr4xnSDxMaL", name: "Professional Recruiter", isConversational: true }
        ]
      }),
      {
        status: 200, // Still return 200 with mock data on error
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
