
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId } = await req.json();
    
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);
    
    // Get resume text from applications table
    const { data: application, error: applicationError } = await supabase
      .from('applications')
      .select('resume_text')
      .eq('candidate_id', userId)
      .order('created_at', { ascending: false })
      .maybeSingle();
    
    if (applicationError) {
      console.error('Error fetching application data:', applicationError);
      throw new Error(`Error fetching application: ${applicationError.message}`);
    }
    
    if (!application || !application.resume_text) {
      throw new Error('No resume text found for this candidate');
    }
    
    const resumeText = application.resume_text;
    console.log(`Found resume text of length: ${resumeText.length} characters`);
    
    // Generate skills and languages using OpenAI
    const prompt = `
    Extract skills and languages from this resume text:
    
    ${resumeText}
    
    Format the response as a JSON object with two arrays:
    1. "skills" - An array of objects with "name" (string) and "level" (number between 1-100)
    2. "languages" - An array of objects with "name" (string) and "proficiency" (string: "Basic", "Intermediate", "Advanced", "Native", or "Fluent")
    
    For skills, make an educated guess about the level based on context, experience mentioned, or certifications.
    For languages, infer the proficiency level from context if possible.
    
    Example response format:
    {
      "skills": [
        {"name": "JavaScript", "level": 85},
        {"name": "React", "level": 80}
      ],
      "languages": [
        {"name": "English", "proficiency": "Fluent"},
        {"name": "Spanish", "proficiency": "Intermediate"}
      ]
    }
    
    Only include skills and languages you're confident are mentioned in the text.
    `;
    
    console.log('Sending request to OpenAI API');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a skilled resume parser specializing in identifying technical skills and languages.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.5,
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    const extractedData = data.choices[0].message.content;
    
    console.log('Successfully extracted skills and languages from resume');
    
    // Parse the AI response to get the JSON content
    let parsedData;
    try {
      // Extract JSON from the response - it might be wrapped in backticks
      const jsonMatch = extractedData.match(/```json\n([\s\S]*?)\n```/) || 
                      extractedData.match(/{[\s\S]*?}/);
      
      const jsonContent = jsonMatch 
        ? jsonMatch[1] || jsonMatch[0] 
        : extractedData;
        
      parsedData = JSON.parse(jsonContent);
      
      if (!parsedData.skills || !parsedData.languages) {
        throw new Error('Invalid data format from AI response');
      }
    } catch (error) {
      console.error('Failed to parse AI response as JSON:', error);
      console.log('Raw AI response:', extractedData);
      throw new Error('Failed to parse AI generated data');
    }
    
    return new Response(
      JSON.stringify({ 
        skills: parsedData.skills || [],
        languages: parsedData.languages || []
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error generating skills and languages:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate skills and languages',
        message: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
