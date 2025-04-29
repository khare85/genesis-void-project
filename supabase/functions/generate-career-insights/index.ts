
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
    
    // Fetch user profile data
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (profileError) {
      throw new Error(`Error fetching profile: ${profileError.message}`);
    }
    
    // Fetch candidate skills
    const { data: skills, error: skillsError } = await supabase
      .from('candidate_skills')
      .select('skill_name, skill_level')
      .eq('candidate_id', userId);
    
    if (skillsError) {
      console.error('Error fetching skills:', skillsError);
      // Continue without skills data
    }
    
    // Fetch candidate experience
    const { data: experience, error: experienceError } = await supabase
      .from('candidate_experience')
      .select('*')
      .eq('candidate_id', userId)
      .order('end_date', { ascending: false });
    
    if (experienceError) {
      console.error('Error fetching experience:', experienceError);
      // Continue without experience data
    }
    
    // Fetch candidate education
    const { data: education, error: educationError } = await supabase
      .from('candidate_education')
      .select('*')
      .eq('candidate_id', userId);
    
    if (educationError) {
      console.error('Error fetching education:', educationError);
      // Continue without education data
    }
    
    // Construct the candidate profile for AI analysis
    const candidateProfile = {
      profile: profileData,
      skills: skills || [],
      experience: experience || [],
      education: education || [],
    };
    
    console.log('Candidate profile data constructed, sending to OpenAI API');
    
    // Generate prompt based on user data
    const prompt = `
    You are an AI career coach specialized in tech and professional careers.
    Analyze this candidate's profile and provide actionable career insights.
    
    Candidate Profile:
    ${JSON.stringify(candidateProfile)}
    
    Provide insights in JSON format with these sections:
    1. profileStrength: numeric value between 0-100
    2. suggestedImprovements: array of 3 specific suggestions to improve their profile
    3. careerPathRecommendations: array of 2 potential career paths with title and explanation
    4. skillGaps: Short analysis of skills they should develop based on market trends
    5. marketTrends: Brief market insight related to their experience
    6. interviewPerformance: Brief tip for interviews relevant to their background
    7. resumeEnhancement: One specific suggestion to improve their resume
    
    Keep it concise and actionable. Focus on specific, tailored advice.
    `;
    
    // Call OpenAI API for insights generation
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a career advisor specializing in tech careers.' },
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
    const aiResponse = data.choices[0].message.content;
    
    console.log('AI insights generated successfully');
    
    // Parse the AI response to get the JSON content
    let insights;
    try {
      // Extract JSON from the response - it might be wrapped in backticks
      const jsonMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/) || 
                        aiResponse.match(/{[\s\S]*?}/);
      
      const jsonContent = jsonMatch 
        ? jsonMatch[1] || jsonMatch[0] 
        : aiResponse;
        
      insights = JSON.parse(jsonContent);
    } catch (error) {
      console.error('Failed to parse AI response as JSON:', error);
      console.log('Raw AI response:', aiResponse);
      
      // Fallback to a basic structure if parsing fails
      insights = {
        profileStrength: 70,
        suggestedImprovements: [
          "Add more quantifiable achievements to your experience",
          "Expand your skills section with emerging technologies",
          "Consider adding a portfolio with examples of your work"
        ],
        careerPathRecommendations: [
          {
            title: "Senior Developer",
            explanation: "Your experience suggests you're ready for more senior roles"
          },
          {
            title: "Tech Lead",
            explanation: "Consider leadership paths given your technical background"
          }
        ],
        skillGaps: "Consider strengthening your cloud and DevOps skills",
        marketTrends: "Remote work opportunities continue to expand in your field",
        interviewPerformance: "Prepare specific examples of your problem-solving process",
        resumeEnhancement: "Highlight measurable achievements with specific metrics"
      };
    }
    
    // Store insights in the database for caching
    const { error: insertError } = await supabase
      .from('candidate_insights')
      .upsert({
        candidate_id: userId,
        insights: insights,
        generated_at: new Date().toISOString()
      })
      .select();
    
    if (insertError) {
      console.error('Error storing insights:', insertError);
      // Continue anyway since we can still return the insights directly
    }
    
    return new Response(
      JSON.stringify({ insights }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error generating career insights:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate career insights',
        message: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
