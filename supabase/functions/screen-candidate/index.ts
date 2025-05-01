
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

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
    const { candidateId, resumeText = "", jobDetails = "" } = await req.json();
    
    if (!candidateId) {
      throw new Error('Candidate ID is required');
    }

    // Get OpenAI API key from environment
    const openAiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials are not configured');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch candidate details if resumeText isn't provided
    let candidateInfo = resumeText;
    if (!candidateInfo) {
      // Get resume text or other candidate details
      const { data: application, error: appError } = await supabase
        .from('applications')
        .select('resume_text, parsed_text')
        .eq('candidate_id', candidateId)
        .single();

      if (appError) {
        console.error('Error fetching candidate application:', appError);
      } else if (application?.resume_text || application?.parsed_text) {
        candidateInfo = application.resume_text || application.parsed_text;
      }

      // If still no info, get from candidate details
      if (!candidateInfo) {
        const { data: candidate, error: candError } = await supabase
          .from('candidate_details')
          .select('*')
          .eq('candidate_id', candidateId)
          .single();

        if (!candError && candidate) {
          candidateInfo = JSON.stringify(candidate);
        }
      }
    }

    if (!candidateInfo) {
      throw new Error('Unable to find candidate information for screening');
    }

    // Prepare prompt for OpenAI
    const prompt = `
      You are an expert AI recruiter assistant. Please analyze the following candidate information and provide:
      
      1. A brief summary of the candidate's background
      2. Key strengths and potential fit for the role
      3. Areas that might need further exploration in an interview
      4. An overall match score from 0-100 based on the candidate's qualifications
      5. A recommended decision: "Shortlist", "Consider", or "Not Suitable"
      
      Candidate Information:
      ${candidateInfo}
      
      ${jobDetails ? `Job Requirements:\n${jobDetails}` : ''}
      
      Format your response as structured JSON with the following keys:
      {
        "summary": "candidate summary...",
        "strengths": ["strength1", "strength2"...],
        "areasToExplore": ["area1", "area2"...],
        "matchScore": 85,
        "recommendation": "Shortlist",
        "notes": "Additional notes or observations..."
      }
    `;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert recruiter AI assistant performing candidate screening.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.4,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${error}`);
    }

    const result = await response.json();
    const aiAnalysis = result.choices[0].message.content;

    // Parse the JSON response
    let parsedAnalysis;
    try {
      parsedAnalysis = JSON.parse(aiAnalysis);
    } catch (e) {
      console.error('Error parsing AI response:', e);
      parsedAnalysis = { 
        summary: aiAnalysis,
        matchScore: 50,
        recommendation: "Consider" 
      };
    }

    // Update the application with screening results
    if (parsedAnalysis) {
      const { error: updateError } = await supabase
        .from('applications')
        .update({
          screening_score: parsedAnalysis.matchScore || 0,
          notes: JSON.stringify(parsedAnalysis),
        })
        .eq('candidate_id', candidateId);

      if (updateError) {
        console.error('Error updating application with screening results:', updateError);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        screening: parsedAnalysis 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error in screen-candidate function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 400, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
