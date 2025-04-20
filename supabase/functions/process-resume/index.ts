
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY') || '');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeUrl, jobId, candidateId } = await req.json();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch job details
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (jobError || !job) {
      throw new Error('Failed to fetch job details');
    }

    // Download resume content
    const { data: resumeData, error: resumeError } = await supabase
      .storage
      .from('resume')
      .download(resumeUrl.split('/').pop() || '');

    if (resumeError || !resumeData) {
      throw new Error('Failed to download resume');
    }

    // Convert resume blob to text
    const resumeText = await resumeData.text();

    // Prepare prompt for Gemini
    const prompt = `
    You are an AI recruitment assistant. Analyze this resume and job description to determine a screening score from 0-100.
    
    Job Description:
    Title: ${job.title}
    Requirements: ${job.requirements?.join(', ')}
    Description: ${job.description}
    
    Resume Content:
    ${resumeText}
    
    Provide a score and brief explanation in JSON format:
    {
      "score": number,
      "explanation": "string"
    }
    `;

    // Generate analysis with Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = JSON.parse(result.response.text());

    // Update application with screening score
    const { error: updateError } = await supabase
      .from('applications')
      .update({
        screening_score: response.score,
        notes: response.explanation,
        updated_at: new Date().toISOString()
      })
      .eq('job_id', jobId)
      .eq('candidate_id', candidateId);

    if (updateError) {
      throw new Error('Failed to update application with screening score');
    }

    return new Response(
      JSON.stringify({ success: true, score: response.score, explanation: response.explanation }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing resume:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
