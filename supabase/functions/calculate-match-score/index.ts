
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

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
    const { applicationId, resumeUrl, jobId } = await req.json();
    
    // Check if we have the required parameters
    if (!applicationId || !resumeUrl || !jobId) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing match score for application ${applicationId}, job ${jobId}`);

    // Create Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Get job details for comparison
    const { data: job, error: jobError } = await supabaseAdmin
      .from('jobs')
      .select('title, description, requirements, responsibilities, skills')
      .eq('id', jobId)
      .single();

    if (jobError) {
      console.error('Error fetching job details:', jobError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch job details' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch the resume content from the parsed data
    // First check if parsed data exists, if not, we'll use the resume URL directly
    let resumeText = '';
    try {
      const { data: parsedData, error: parsedDataError } = await supabaseAdmin
        .storage
        .from('parsed-data')
        .download(`${jobId}/${resumeUrl.split('/').pop()}`);

      if (parsedData) {
        resumeText = await parsedData.text();
        console.log('Successfully retrieved parsed resume data');
      } else {
        console.log('Parsed resume not found, using original resume URL:', resumeUrl);
        // If we don't have parsed data, we'll continue with the resume URL
      }
    } catch (error) {
      console.error('Error fetching parsed resume:', error);
      // Continue with empty resume text if we couldn't get parsed data
    }

    // Prepare job requirements as a string
    const requirementsText = Array.isArray(job.requirements) 
      ? job.requirements.join('\n') 
      : (job.requirements || '');
      
    // Prepare job responsibilities as a string
    const responsibilitiesText = Array.isArray(job.responsibilities)
      ? job.responsibilities.join('\n')
      : (job.responsibilities || '');

    // Prepare the prompt for OpenAI/Gemini API
    const prompt = `
    I need to match a candidate's resume with a job description.
    
    JOB TITLE: ${job.title}
    
    JOB DESCRIPTION: ${job.description}
    
    JOB REQUIREMENTS:
    ${requirementsText}
    
    JOB RESPONSIBILITIES:
    ${responsibilitiesText}
    
    JOB SKILLS REQUIRED:
    ${job.skills || ''}
    
    CANDIDATE RESUME:
    ${resumeText || 'Resume text not available'}
    
    Based on the candidate's qualifications and the job requirements, give me a match score out of 100.
    The score should reflect how well the candidate's skills, experience and qualifications match the job requirements.
    Respond with ONLY a number from 0-100. Do not include any other text.
    `;

    // Determine which API to use based on available API keys
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    
    let matchScore = 0;
    
    if (openaiApiKey) {
      console.log('Using OpenAI API for match score calculation');
      // Call the OpenAI API
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
              content: "You are an AI assistant specializing in HR and recruitment. Your task is to evaluate how well a candidate's resume matches a job description."
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
      
      const openaiData = await openaiResponse.json();
      
      try {
        if (openaiData.choices && openaiData.choices[0].message.content) {
          const scoreText = openaiData.choices[0].message.content.trim();
          // Extract just the number from the response
          const scoreMatch = scoreText.match(/\d+/);
          if (scoreMatch) {
            matchScore = parseInt(scoreMatch[0], 10);
            // Ensure the score is in the 0-100 range
            matchScore = Math.min(100, Math.max(0, matchScore));
          }
        }
      } catch (err) {
        console.error('Error parsing OpenAI response:', err);
        console.log('OpenAI response:', JSON.stringify(openaiData));
      }
    } 
    else if (geminiApiKey) {
      console.log('Using Gemini API for match score calculation');
      // Call the Gemini API
      const geminiResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + geminiApiKey, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 50,
          }
        })
      });

      const geminiData = await geminiResponse.json();
      
      try {
        if (geminiData.candidates && geminiData.candidates[0].content.parts[0].text) {
          const scoreText = geminiData.candidates[0].content.parts[0].text.trim();
          // Extract just the number from the response
          const scoreMatch = scoreText.match(/\d+/);
          if (scoreMatch) {
            matchScore = parseInt(scoreMatch[0], 10);
            // Ensure the score is in the 0-100 range
            matchScore = Math.min(100, Math.max(0, matchScore));
          }
        }
      } catch (err) {
        console.error('Error parsing Gemini response:', err);
        console.log('Gemini response:', JSON.stringify(geminiData));
      }
    } else {
      console.error('No API key available for OpenAI or Gemini');
      return new Response(
        JSON.stringify({ error: 'No API key available for match score calculation' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Calculated match score: ${matchScore} for application ${applicationId}`);

    // Update the application with the match score
    const { error: updateError } = await supabaseAdmin
      .from('applications')
      .update({ match_score: matchScore })
      .eq('id', applicationId);

    if (updateError) {
      console.error('Error updating application with match score:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update application with match score' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, matchScore }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error calculating match score:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
