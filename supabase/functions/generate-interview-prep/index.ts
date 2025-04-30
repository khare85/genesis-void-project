
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
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
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY') ?? '';

    if (!openaiApiKey) {
      throw new Error('OpenAI API key not found in environment variables');
    }

    // Get request body
    const { userId, jobTitle } = await req.json();
    
    if (!userId) {
      return new Response(
        JSON.stringify({ success: false, message: 'User ID is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Fetch user's profile data to generate personalized interview prep
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching profile data:', profileError);
      return new Response(
        JSON.stringify({ success: false, message: 'User profile not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    // Fetch skills, experience, etc.
    const [
      { data: skills },
      { data: experience },
      { data: education }
    ] = await Promise.all([
      supabase.from('candidate_skills').select('*').eq('candidate_id', userId),
      supabase.from('candidate_experience').select('*').eq('candidate_id', userId),
      supabase.from('candidate_education').select('*').eq('candidate_id', userId)
    ]);

    // Create a profile summary for OpenAI
    const skillsText = skills ? skills.map((s: any) => s.skill_name).join(', ') : '';
    const experienceText = experience ? experience.map((e: any) => 
      `${e.title} at ${e.company} (${e.start_date ? new Date(e.start_date).getFullYear() : 'N/A'} - ${e.end_date ? new Date(e.end_date).getFullYear() : 'Present'})`
    ).join('; ') : '';
    const educationText = education ? education.map((e: any) => 
      `${e.degree} from ${e.institution}`
    ).join('; ') : '';

    const targetJob = jobTitle || profileData.title || 'your target role';
    
    // Use OpenAI to generate interview prep content
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert interview coach helping a candidate prepare for job interviews. 
            Create personalized interview preparation guidance based on their profile.
            Include common questions, suggested answers, and tips for demonstrating their skills.`
          },
          {
            role: 'user',
            content: `Please create interview preparation content for me based on my profile:
            
            Job Title: ${targetJob}
            Skills: ${skillsText || 'Not specified'}
            Experience: ${experienceText || 'Not specified'}
            Education: ${educationText || 'Not specified'}
            
            Include:
            1. 5 common interview questions for this role with suggested answer approaches
            2. 3 behavioral questions with frameworks for answering them
            3. Key skills to emphasize during the interview
            4. Tips for answering technical questions
            5. Questions I should ask the interviewer
            
            Format the response in a well-structured JSON object.`
          }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    const openAIData = await openAIResponse.json();
    
    if (!openAIData.choices || !openAIData.choices[0] || !openAIData.choices[0].message) {
      throw new Error('Invalid response from OpenAI API');
    }
    
    const responseContent = openAIData.choices[0].message.content;
    
    // Parse the JSON content from OpenAI
    let prepData;
    try {
      // Try to parse as JSON, but handle the case where it's not valid JSON
      prepData = JSON.parse(responseContent);
    } catch (error) {
      console.log("Response was not valid JSON, using raw text");
      // If not valid JSON, use text format
      prepData = {
        commonQuestions: [{ question: "Error parsing response", answer: responseContent }],
        behavioralQuestions: [],
        keySkills: [],
        technicalTips: "",
        questionsToAsk: []
      };
    }

    // Store the interview prep in the database
    const { error: insertError } = await supabase
      .from('candidate_interview_prep')
      .insert({
        candidate_id: userId,
        job_title: targetJob,
        content: prepData,
        created_at: new Date().toISOString()
      });

    if (insertError) {
      console.error('Error saving interview prep:', insertError);
    }

    // Return the interview prep data
    return new Response(
      JSON.stringify({ 
        success: true, 
        prepData,
        jobTitle: targetJob
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-interview-prep function:', error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
