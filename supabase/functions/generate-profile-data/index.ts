
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

// CORS headers for browser access
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
    const { userId } = await req.json();
    if (!userId) {
      return new Response(JSON.stringify({ error: "Missing userId parameter" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // First, try to fetch resume_text from the applications table for this user
    console.log(`Fetching resume data for user: ${userId}`);
    const applicationResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/applications?candidate_id=eq.${userId}&select=resume_text`,
      {
        headers: {
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    if (!applicationResponse.ok) {
      throw new Error(`Failed to fetch application data: ${await applicationResponse.text()}`);
    }

    const applications = await applicationResponse.json();
    if (applications.length === 0 || !applications[0].resume_text) {
      return new Response(JSON.stringify({ error: "No resume text found for this user" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const resumeText = applications[0].resume_text;
    console.log(`Resume text found (${resumeText.length} chars)`);

    // Call OpenAI to generate profile information
    console.log("Calling OpenAI API to generate profile information");
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a professional profile analyzer. Extract key information from a resume to populate a professional profile. Provide ONLY a JSON response with the fields: bio (100-150 words), skills (array of objects with name and level 1-5), location, current position, company, languages (array of objects with name and proficiency level)."
          },
          {
            role: "user",
            content: `Here is the resume text. Extract the key information in JSON format:\n\n${resumeText}`
          }
        ],
        temperature: 0.3,
      }),
    });

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${await openaiResponse.text()}`);
    }

    const openaiData = await openaiResponse.json();
    console.log("OpenAI response received");
    
    // Parse the content as JSON
    try {
      const profileInfo = JSON.parse(openaiData.choices[0].message.content);
      
      return new Response(JSON.stringify({ 
        success: true,
        profile: profileInfo
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (error) {
      // If there's an issue parsing the JSON, return the raw content
      return new Response(JSON.stringify({ 
        success: true,
        rawContent: openaiData.choices[0].message.content,
        error: "Could not parse as JSON"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

  } catch (error) {
    console.error(`Error: ${error.message}`);
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
