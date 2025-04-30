
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
      .select('resume_text, parsed_text')
      .eq('candidate_id', userId)
      .order('created_at', { ascending: false })
      .maybeSingle();
    
    if (applicationError) {
      console.error('Error fetching application data:', applicationError);
      throw new Error(`Error fetching application: ${applicationError.message}`);
    }
    
    if (!application || (!application.resume_text && !application.parsed_text)) {
      throw new Error('No resume text found for this candidate');
    }
    
    // Use parsed_text if available, otherwise use resume_text
    const resumeText = application.parsed_text || application.resume_text;
    console.log(`Found resume text of length: ${resumeText.length} characters`);
    
    // Generate skills and languages using OpenAI
    const prompt = `
    Extract skills and languages from this resume text:
    
    ${resumeText}
    
    Format the response as a valid JSON object with two arrays:
    1. "skills" - An array of objects with "name" (string) and "level" (number between 1-100)
    2. "languages" - An array of objects with "name" (string) and "proficiency" (string: "Basic", "Intermediate", "Advanced", "Native", or "Fluent")
    
    For skills, make an educated guess about the level based on context, experience mentioned, or certifications.
    For languages, infer the proficiency level from context if possible.
    
    Return ONLY valid JSON, no explanations or code blocks. The JSON should be parseable directly.
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
          { role: 'system', content: 'You are a skilled resume parser specializing in identifying technical skills and languages. You must return valid, parseable JSON without code blocks or markdown formatting.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        response_format: { type: "json_object" }, // Use the JSON response format to ensure we get valid JSON
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Got response from OpenAI API');
    
    // Get the content from the response
    const extractedContent = data.choices[0].message.content;
    console.log('Extracted content sample:', extractedContent.substring(0, 100));
    
    // Parse the JSON content directly - should be valid JSON because we used response_format: { type: "json_object" }
    let parsedData;
    try {
      parsedData = JSON.parse(extractedContent);
      
      // Validate the structure
      if (!parsedData.skills || !Array.isArray(parsedData.skills) || 
          !parsedData.languages || !Array.isArray(parsedData.languages)) {
        throw new Error('Invalid data format: missing skills or languages arrays');
      }
      
      console.log(`Successfully parsed data with ${parsedData.skills?.length || 0} skills and ${parsedData.languages?.length || 0} languages`);
    } catch (error) {
      console.error('Error parsing AI response:', error);
      console.log('Raw AI response:', extractedContent);
      
      // Fallback: attempt to extract JSON even if it's in a markdown code block
      try {
        // Try to extract JSON if it's wrapped in code blocks
        const jsonMatch = extractedContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || 
                           extractedContent.match(/\{[\s\S]*\}/);
        
        if (jsonMatch) {
          const jsonContent = jsonMatch[1] || jsonMatch[0];
          parsedData = JSON.parse(jsonContent.trim());
          console.log('Successfully extracted JSON from code block');
        } else {
          throw new Error('Could not find JSON in the response');
        }
      } catch (fallbackError) {
        console.error('Fallback parsing failed:', fallbackError);
        throw new Error('Failed to parse AI generated data');
      }
    }
    
    // Make sure skills have valid levels (1-100)
    if (parsedData.skills) {
      parsedData.skills = parsedData.skills.map(skill => ({
        name: skill.name,
        level: Math.min(Math.max(parseInt(skill.level) || 50, 1), 100) // Ensure level is between 1-100
      }));
    }
    
    // Make sure languages have valid proficiency values
    const validProficiencies = ["Basic", "Intermediate", "Advanced", "Native", "Fluent"];
    if (parsedData.languages) {
      parsedData.languages = parsedData.languages.map(lang => ({
        name: lang.name,
        proficiency: validProficiencies.includes(lang.proficiency) ? lang.proficiency : "Intermediate"
      }));
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
