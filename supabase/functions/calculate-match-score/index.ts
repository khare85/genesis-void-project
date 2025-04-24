
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Import helpers
    const { prepareJobText, generateAIPrompt } = await import('./promptHelpers.ts');
    const { parseAIResponse } = await import('./scoreProcessing.ts');
    
    // Get request parameters
    const { applicationId, resumeUrl, jobId } = await req.json();
    
    if (!applicationId || !resumeUrl || !jobId) {
      throw new Error('Missing required parameters');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

    // Fetch job details
    const { data: job, error: jobError } = await supabaseAdmin
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (jobError) throw jobError;

    // Get parsed resume text
    const filename = resumeUrl.split('/').pop();
    const { data: parsedData } = await supabaseAdmin
      .storage
      .from('parsed-data')
      .download(`${jobId}/${filename}.txt`);

    let resumeText = parsedData ? await parsedData.text() : '';

    // Generate AI prompt
    const jobTexts = prepareJobText(job);
    const prompt = generateAIPrompt(job, jobTexts, resumeText);

    // Get match score from OpenAI
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) throw new Error('Missing OpenAI configuration');

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an AI assistant specializing in HR and recruitment."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 50
      })
    });

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.status}`);
    }

    const openaiData = await openaiResponse.json();
    const matchScore = parseAIResponse(openaiData);

    // Update application with match score
    await supabaseAdmin
      .from('applications')
      .update({ match_score: matchScore })
      .eq('id', applicationId);

    return new Response(
      JSON.stringify({ success: true, matchScore }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error calculating match score:', error);
    return new Response(
      JSON.stringify({ 
        error: 'An unexpected error occurred', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
