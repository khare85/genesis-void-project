
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
    console.log("Processing resume:", { resumeUrl, jobId, candidateId });

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
      console.error("Job fetch error:", jobError);
      throw new Error('Failed to fetch job details');
    }

    console.log("Job details fetched:", job.title);

    // Extract the path from the resumeUrl
    const resumePath = resumeUrl.split('/').pop();
    if (!resumePath) {
      throw new Error('Invalid resume URL format');
    }

    // Download resume content
    const { data: resumeData, error: resumeError } = await supabase
      .storage
      .from('resume')
      .download(resumePath);

    if (resumeError || !resumeData) {
      console.error("Resume download error:", resumeError);
      throw new Error('Failed to download resume');
    }

    console.log("Resume downloaded successfully, size:", resumeData.size);

    // Convert resume blob to text
    const resumeText = await resumeData.text();
    console.log("Resume text extracted, length:", resumeText.length);

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
    console.log("Sending to Gemini for analysis");
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    console.log("Gemini response received:", responseText);
    let response;
    try {
      response = JSON.parse(responseText);
    } catch (e) {
      console.error("Error parsing Gemini response:", e);
      console.log("Raw response:", responseText);
      
      // Attempt to extract JSON if the response isn't proper JSON
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          response = JSON.parse(jsonMatch[0]);
        } catch (e2) {
          console.error("Second attempt to parse JSON failed:", e2);
          response = { 
            score: 50, 
            explanation: "Failed to parse AI response. Default score assigned." 
          };
        }
      } else {
        response = { 
          score: 50, 
          explanation: "Failed to parse AI response. Default score assigned." 
        };
      }
    }

    // Update application with screening score
    console.log("Updating application with score:", response.score);
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
      console.error("Application update error:", updateError);
      throw new Error('Failed to update application with screening score');
    }

    console.log("Application updated successfully");
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
