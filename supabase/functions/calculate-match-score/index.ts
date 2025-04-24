
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Function to validate required parameters
const validateRequestParams = (params: { applicationId?: string, resumeUrl?: string, jobId?: string }) => {
  const { applicationId, resumeUrl, jobId } = params;
  if (!applicationId || !resumeUrl || !jobId) {
    console.error('Missing required parameters:', { applicationId, resumeUrl, jobId });
    throw new Error('Missing required parameters');
  }
};

// Function to initialize Supabase client
const initSupabaseClient = () => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    throw new Error('Server configuration error');
  }
  
  return createClient(supabaseUrl, supabaseKey);
};

// Function to fetch job details
const fetchJobDetails = async (supabaseAdmin: any, jobId: string) => {
  const { data: job, error: jobError } = await supabaseAdmin
    .from('jobs')
    .select('title, description, requirements, responsibilities, skills')
    .eq('id', jobId)
    .single();

  if (jobError) {
    console.error('Error fetching job details:', jobError);
    throw new Error(`Failed to fetch job details: ${jobError.message}`);
  }
  
  return job;
};

// Function to fetch parsed resume data
const fetchParsedResume = async (supabaseAdmin: any, jobId: string, resumeUrl: string) => {
  try {
    const { data: parsedData, error: parsedDataError } = await supabaseAdmin
      .storage
      .from('parsed-data')
      .download(`${jobId}/${resumeUrl.split('/').pop()}`);

    if (parsedData) {
      const resumeText = await parsedData.text();
      console.log('Successfully retrieved parsed resume data');
      return resumeText;
    }
    
    console.log('Parsed resume not found, using resume URL reference:', resumeUrl);
    return '';
  } catch (error) {
    console.error('Error fetching parsed resume:', error);
    return '';
  }
};

// Function to prepare job text for AI analysis
const prepareJobText = (job: any) => {
  const requirementsText = Array.isArray(job.requirements) 
    ? job.requirements.join('\n') 
    : (job.requirements || '');
    
  const responsibilitiesText = Array.isArray(job.responsibilities)
    ? job.responsibilities.join('\n')
    : (job.responsibilities || '');

  const skillsText = Array.isArray(job.skills)
    ? job.skills.join(', ')
    : (job.skills || '');

  return {
    requirementsText,
    responsibilitiesText,
    skillsText
  };
};

// Function to generate AI prompt
const generateAIPrompt = (job: any, jobTexts: any, resumeText: string) => {
  return `
    I need to match a candidate's resume with a job description.
    
    JOB TITLE: ${job.title}
    
    JOB DESCRIPTION: ${job.description || 'No description provided'}
    
    JOB REQUIREMENTS:
    ${jobTexts.requirementsText || 'No specific requirements listed'}
    
    JOB RESPONSIBILITIES:
    ${jobTexts.responsibilitiesText || 'No specific responsibilities listed'}
    
    JOB SKILLS REQUIRED:
    ${jobTexts.skillsText || 'No specific skills listed'}
    
    CANDIDATE RESUME INFO:
    ${resumeText || 'Resume text not available, but candidate has applied for this position'}
    
    Based on the available information, give me a match score out of 100.
    The score should reflect how well the candidate's qualifications match the job requirements.
    Respond with ONLY a number from 0-100. Do not include any other text.
    `;
};

// Function to get AI match score
const getAIMatchScore = async (prompt: string) => {
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openaiApiKey) {
    console.error('Missing OpenAI API key');
    throw new Error('Server configuration error - OpenAI API key missing');
  }

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

  if (!openaiResponse.ok) {
    const errorText = await openaiResponse.text();
    console.error('OpenAI API error:', openaiResponse.status, errorText);
    throw new Error(`OpenAI API error: ${openaiResponse.status}`);
  }

  const openaiData = await openaiResponse.json();
  return parseAIResponse(openaiData);
};

// Function to parse AI response and get match score
const parseAIResponse = (openaiData: any) => {
  let matchScore = 50; // Default score
  
  try {
    if (openaiData.choices && openaiData.choices[0].message.content) {
      const scoreText = openaiData.choices[0].message.content.trim();
      console.log('Raw OpenAI response:', scoreText);
      
      const scoreMatch = scoreText.match(/\d+/);
      if (scoreMatch) {
        matchScore = parseInt(scoreMatch[0], 10);
        matchScore = Math.min(100, Math.max(0, matchScore));
      } else {
        console.error('Could not parse a number from OpenAI response:', scoreText);
      }
    }
  } catch (err) {
    console.error('Error parsing OpenAI response:', err);
    console.log('OpenAI response:', JSON.stringify(openaiData));
  }
  
  return matchScore;
};

// Function to update application with match score
const updateApplicationScore = async (supabaseAdmin: any, applicationId: string, matchScore: number) => {
  const { error: updateError } = await supabaseAdmin
    .from('applications')
    .update({ match_score: matchScore })
    .eq('id', applicationId);

  if (updateError) {
    console.error('Error updating application with match score:', updateError);
    throw new Error(`Failed to update application with match score: ${updateError.message}`);
  }
};

// Main handler function
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const params = await req.json();
    validateRequestParams(params);
    
    const { applicationId, resumeUrl, jobId } = params;
    console.log(`Processing match score for application ${applicationId}, job ${jobId}`);

    const supabaseAdmin = initSupabaseClient();
    const job = await fetchJobDetails(supabaseAdmin, jobId);
    const resumeText = await fetchParsedResume(supabaseAdmin, jobId, resumeUrl);
    const jobTexts = prepareJobText(job);
    const prompt = generateAIPrompt(job, jobTexts, resumeText);
    const matchScore = await getAIMatchScore(prompt);
    
    console.log(`Calculated match score: ${matchScore} for application ${applicationId}`);
    
    await updateApplicationScore(supabaseAdmin, applicationId, matchScore);

    return new Response(
      JSON.stringify({ success: true, matchScore }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error calculating match score:', error);
    const status = error.message.includes('configuration error') ? 500 
      : error.message.includes('Missing required parameters') ? 400 
      : 500;
      
    return new Response(
      JSON.stringify({ 
        error: 'An unexpected error occurred', 
        details: error.message 
      }),
      { 
        status, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

