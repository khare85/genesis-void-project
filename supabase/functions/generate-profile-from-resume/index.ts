
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.1";

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
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header is required');
    }

    // Create a Supabase client for database operations
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Get the user's ID from the JWT
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('Unable to get user information: ' + (userError?.message || 'User not found'));
    }

    const userId = user.id;
    console.log(`Processing profile data for user: ${userId}`);

    // Get the request body
    const requestData = await req.json();
    const forceRefresh = requestData?.forceRefresh || false;

    // 1. First, try to get resume text from applications table for this user
    const { data: applications, error: applicationsError } = await supabase
      .from('applications')
      .select('resume_text')
      .eq('candidate_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (applicationsError) {
      console.error('Error fetching applications:', applicationsError);
    }

    let resumeText = applications?.[0]?.resume_text || '';

    // If no resume text found in applications, check if there's any in the profiles table
    if (!resumeText) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('ai_parsed_data')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
      } else if (profile?.ai_parsed_data) {
        resumeText = profile.ai_parsed_data;
      }
    }

    if (!resumeText) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'No resume text found for this user',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Process the resume with OpenAI
    console.log('Processing resume with OpenAI...');
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not found');
    }

    const prompt = `
    I have a resume text extracted from a candidate's resume. I need you to extract the following information in a structured JSON format:
    
    Resume text: 
    ${resumeText}
    
    Please extract and return ONLY a JSON object with these fields (with word limits specified):
    {
      "personal": {
        "bio": "A professional summary, max 150 words",
        "location": "City, State/Country",
        "title": "Current job title"
      },
      "skills": [
        {"name": "Skill name", "level": rating from 1-100}
      ] (limit to top 8-10 skills),
      "languages": [
        {"name": "Language name", "proficiency": "Basic/Intermediate/Fluent/Native"}
      ],
      "experience": [
        {
          "title": "Job title",
          "company": "Company name",
          "location": "City, State",
          "startDate": "YYYY-MM format",
          "endDate": "YYYY-MM format or null if current",
          "current": boolean,
          "description": "Brief job description, max 100 words"
        }
      ] (limit to 3-5 most recent/relevant experiences),
      "education": [
        {
          "institution": "School/University name",
          "degree": "Degree name",
          "startDate": "YYYY-MM format",
          "endDate": "YYYY-MM format",
          "description": "Brief description, max 50 words"
        }
      ],
      "certificates": [
        {
          "name": "Certificate name",
          "issuer": "Issuing organization",
          "issueDate": "YYYY-MM format",
          "expiryDate": "YYYY-MM format or null if no expiry",
          "credentialId": "ID if available"
        }
      ],
      "projects": [
        {
          "title": "Project name",
          "description": "Brief description, max 75 words",
          "technologies": ["Tech1", "Tech2"],
          "link": "URL if available"
        }
      ] (limit to 2-3 most impressive projects)
    }
    
    Do NOT include any additional text, explanations, or markdown - ONLY return the JSON object.
    If you cannot confidently extract a specific field, omit it rather than guessing.`;

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a professional resume parser extracting structured data.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
      }),
    });

    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      throw new Error(`OpenAI API error: ${openAIResponse.status} ${errorText}`);
    }

    const openAIData = await openAIResponse.json();
    const parsedData = JSON.parse(openAIData.choices[0].message.content);
    console.log('Successfully parsed resume data with OpenAI');

    // 3. Update various candidate profile tables with the extracted data
    const updateTasks = [];

    // Update profiles table with basic info
    if (parsedData.personal) {
      const profileUpdate = {
        bio: parsedData.personal.bio,
        location: parsedData.personal.location,
        title: parsedData.personal.title,
        updated_at: new Date().toISOString()
      };

      updateTasks.push(
        supabase
          .from('profiles')
          .update(profileUpdate)
          .eq('id', userId)
      );
    }

    // Update candidate_skills table
    if (parsedData.skills && parsedData.skills.length > 0) {
      // First delete existing skills
      updateTasks.push(
        supabase
          .from('candidate_skills')
          .delete()
          .eq('candidate_id', userId)
      );

      // Then insert new skills
      const skillsData = parsedData.skills.map(skill => ({
        candidate_id: userId,
        skill_name: skill.name,
        skill_level: skill.level,
        created_at: new Date().toISOString()
      }));

      updateTasks.push(
        supabase
          .from('candidate_skills')
          .insert(skillsData)
      );
    }

    // Update candidate_languages table
    if (parsedData.languages && parsedData.languages.length > 0) {
      // First delete existing languages
      updateTasks.push(
        supabase
          .from('candidate_languages')
          .delete()
          .eq('candidate_id', userId)
      );

      // Then insert new languages
      const languagesData = parsedData.languages.map(language => ({
        candidate_id: userId,
        language_name: language.name,
        proficiency: language.proficiency,
        created_at: new Date().toISOString()
      }));

      updateTasks.push(
        supabase
          .from('candidate_languages')
          .insert(languagesData)
      );
    }

    // Update candidate_experience table
    if (parsedData.experience && parsedData.experience.length > 0) {
      // First delete existing experience
      updateTasks.push(
        supabase
          .from('candidate_experience')
          .delete()
          .eq('candidate_id', userId)
      );

      // Then insert new experience
      const experienceData = parsedData.experience.map(exp => ({
        candidate_id: userId,
        title: exp.title,
        company: exp.company,
        location: exp.location,
        start_date: exp.startDate ? new Date(exp.startDate + "-01").toISOString().split('T')[0] : null,
        end_date: exp.endDate ? new Date(exp.endDate + "-01").toISOString().split('T')[0] : null,
        current: exp.current || false,
        description: exp.description,
        created_at: new Date().toISOString()
      }));

      updateTasks.push(
        supabase
          .from('candidate_experience')
          .insert(experienceData)
      );
    }

    // Update candidate_education table
    if (parsedData.education && parsedData.education.length > 0) {
      // First delete existing education
      updateTasks.push(
        supabase
          .from('candidate_education')
          .delete()
          .eq('candidate_id', userId)
      );

      // Then insert new education
      const educationData = parsedData.education.map(edu => ({
        candidate_id: userId,
        institution: edu.institution,
        degree: edu.degree,
        start_date: edu.startDate ? new Date(edu.startDate + "-01").toISOString().split('T')[0] : null,
        end_date: edu.endDate ? new Date(edu.endDate + "-01").toISOString().split('T')[0] : null,
        description: edu.description,
        created_at: new Date().toISOString()
      }));

      updateTasks.push(
        supabase
          .from('candidate_education')
          .insert(educationData)
      );
    }

    // Update candidate_certificates table
    if (parsedData.certificates && parsedData.certificates.length > 0) {
      // First delete existing certificates
      updateTasks.push(
        supabase
          .from('candidate_certificates')
          .delete()
          .eq('candidate_id', userId)
      );

      // Then insert new certificates
      const certificatesData = parsedData.certificates.map(cert => ({
        candidate_id: userId,
        name: cert.name,
        issuer: cert.issuer,
        issue_date: cert.issueDate ? new Date(cert.issueDate + "-01").toISOString().split('T')[0] : null,
        expiry_date: cert.expiryDate ? new Date(cert.expiryDate + "-01").toISOString().split('T')[0] : null,
        credential_id: cert.credentialId,
        created_at: new Date().toISOString()
      }));

      updateTasks.push(
        supabase
          .from('candidate_certificates')
          .insert(certificatesData)
      );
    }

    // Update candidate_projects table
    if (parsedData.projects && parsedData.projects.length > 0) {
      // First delete existing projects
      updateTasks.push(
        supabase
          .from('candidate_projects')
          .delete()
          .eq('candidate_id', userId)
      );

      // Then insert new projects
      const projectsData = parsedData.projects.map(project => ({
        candidate_id: userId,
        title: project.title,
        description: project.description,
        technologies: project.technologies,
        link: project.link,
        created_at: new Date().toISOString()
      }));

      updateTasks.push(
        supabase
          .from('candidate_projects')
          .insert(projectsData)
      );
    }

    // Execute all database updates in parallel
    const results = await Promise.allSettled(updateTasks);
    
    // Check for any errors
    const errors = results
      .filter(result => result.status === 'rejected')
      .map(result => (result as PromiseRejectedResult).reason);
    
    if (errors.length > 0) {
      console.error('Errors updating profile data:', errors);
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Some profile updates failed',
          errors: errors.map(e => e.message || String(e)),
          parsedData
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Successfully updated all profile data');
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Profile successfully updated',
        parsedData
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-profile-from-resume function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || 'An unknown error occurred',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
