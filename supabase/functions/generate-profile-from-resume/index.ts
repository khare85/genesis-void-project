
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

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

    // Get request body
    const { userId, forceRefresh } = await req.json();
    
    if (!userId) {
      return new Response(
        JSON.stringify({ success: false, message: 'User ID is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Get user's resume text
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('Error fetching user data:', userError);
      return new Response(
        JSON.stringify({ success: false, message: 'User not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    // If AI already parsed the resume and we don't want to force refresh
    if (userData.ai_parsed_data && !forceRefresh) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Profile data already exists',
          profileData: JSON.parse(userData.ai_parsed_data)
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the user's parsed resume text or application data
    const { data: applications, error: applicationsError } = await supabase
      .from('applications')
      .select('parsed_text, resume_text')
      .eq('candidate_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (applicationsError || !applications || applications.length === 0) {
      console.error('Error fetching application data:', applicationsError);
      return new Response(
        JSON.stringify({ success: false, message: 'No resume data found for user' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    const resumeText = applications[0].parsed_text || applications[0].resume_text;
    if (!resumeText) {
      return new Response(
        JSON.stringify({ success: false, message: 'No parsed resume text found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    console.log(`Processing resume data for user ${userId}. Text length: ${resumeText.length}`);

    // Helper function to format partial dates
    const formatDateForDB = (partialDate: string | null): string | null => {
      if (!partialDate) return null;
      
      // If the date is already in YYYY-MM-DD format, return it as is
      if (/^\d{4}-\d{2}-\d{2}$/.test(partialDate)) return partialDate;
      
      // If the date is in YYYY-MM format, add '-01' to make it the first day of the month
      if (/^\d{4}-\d{2}$/.test(partialDate)) return `${partialDate}-01`;
      
      // Return null for invalid formats
      return null;
    };

    // Use OpenAI to extract structured data from the resume
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
            content: `You are an AI specialized in parsing resumes and extracting structured data. Extract all relevant information from the resume text and provide it as JSON. Follow these strict guidelines:
            1. Format dates as YYYY-MM or YYYY-MM-DD format only. NEVER use other formats.
            2. Only include valid JSON. No markdown formatting or explanation text.
            3. If a date field is missing, use null rather than inferring a date.
            4. Use the following structure exactly:
            {
              "personal": {
                "name": "Full name",
                "title": "Professional title",
                "email": "Email address",
                "phone": "Phone number",
                "location": "City, State",
                "bio": "Professional summary or objective (2-3 sentences)"
              },
              "skills": [
                {"name": "Skill name", "level": number from 1-100 representing proficiency}
              ],
              "languages": [
                {"name": "Language name", "proficiency": "Basic/Intermediate/Advanced/Native"}
              ],
              "experience": [
                {
                  "company": "Company name",
                  "title": "Job title",
                  "location": "City, State",
                  "startDate": "YYYY-MM",
                  "endDate": "YYYY-MM or null if current",
                  "current": boolean,
                  "description": "Job description",
                  "skills": ["Skills used in this role"]
                }
              ],
              "education": [
                {
                  "institution": "School name",
                  "degree": "Degree and major",
                  "startDate": "YYYY-MM",
                  "endDate": "YYYY-MM",
                  "description": "Additional details about education"
                }
              ],
              "certificates": [
                {
                  "name": "Certificate name",
                  "issuer": "Issuing organization",
                  "issueDate": "YYYY-MM",
                  "expiryDate": "YYYY-MM or null if no expiration",
                  "credentialId": "Credential ID if available"
                }
              ],
              "projects": [
                {
                  "title": "Project name",
                  "description": "Project description",
                  "link": "Project URL if available",
                  "technologies": ["Technologies used"]
                }
              ]
            }`
          },
          {
            role: 'user',
            content: `Parse the following resume text. Respond with ONLY valid JSON - no markdown formatting, no code blocks, no explanations: ${resumeText}`
          }
        ],
        temperature: 0.2,
      }),
    });

    const openAIData = await openAIResponse.json();
    
    // Properly extract and parse the content
    if (!openAIData.choices || !openAIData.choices[0] || !openAIData.choices[0].message) {
      throw new Error('Invalid response from OpenAI API');
    }
    
    const responseContent = openAIData.choices[0].message.content.trim();
    
    // Clean the response to ensure it's valid JSON - remove any markdown code block indicators
    const cleanedContent = responseContent
      .replace(/^```json\s*/g, '')
      .replace(/^```\s*/g, '')
      .replace(/```$/g, '')
      .trim();
    
    console.log('Cleaned parsed data:', cleanedContent.substring(0, 100) + '...');
    
    let parsedData;
    try {
      parsedData = JSON.parse(cleanedContent);
      console.log('Successfully parsed resume data from OpenAI');
    } catch (parseError) {
      console.error('Error parsing JSON from OpenAI response:', parseError);
      console.error('Response content preview:', cleanedContent.substring(0, 200));
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Failed to parse AI response',
          error: parseError.message
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Enhanced console logging to track the data flow
    console.log('Parsed data structure:', Object.keys(parsedData).join(', '));
    console.log('Skills found:', parsedData.skills?.length || 0);
    console.log('Languages found:', parsedData.languages?.length || 0);
    console.log('Experience entries found:', parsedData.experience?.length || 0);
    console.log('Education entries found:', parsedData.education?.length || 0);

    // Save the parsed data back to the user's profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        ai_parsed_data: JSON.stringify(parsedData),
        bio: parsedData.personal?.bio || userData.bio,
        title: parsedData.personal?.title || userData.title,
        phone: parsedData.personal?.phone || userData.phone,
        location: parsedData.personal?.location || userData.location,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating profile data:', updateError);
      return new Response(
        JSON.stringify({ success: false, message: 'Failed to update profile' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // First clear all existing data for this user to avoid duplicates
    console.log('Clearing existing profile data records for user', userId);
    
    try {
      await Promise.all([
        supabase.from('candidate_skills').delete().eq('candidate_id', userId),
        supabase.from('candidate_languages').delete().eq('candidate_id', userId),
        supabase.from('candidate_experience').delete().eq('candidate_id', userId),
        supabase.from('candidate_education').delete().eq('candidate_id', userId),
        supabase.from('candidate_certificates').delete().eq('candidate_id', userId),
        supabase.from('candidate_projects').delete().eq('candidate_id', userId)
      ]);
      console.log('Successfully cleared existing profile data');
    } catch (clearError) {
      console.error('Error clearing existing profile data:', clearError);
    }
    
    // Create transaction batches to save all data
    const insertPromises = [];
    
    // Save skills
    if (parsedData.skills && parsedData.skills.length > 0) {
      console.log(`Inserting ${parsedData.skills.length} skills`);
      insertPromises.push(
        supabase
          .from('candidate_skills')
          .insert(parsedData.skills.map((skill: any) => ({
            candidate_id: userId,
            skill_name: skill.name,
            skill_level: skill.level || 50 // Default level if not provided
          })))
      );
    }
    
    // Save languages
    if (parsedData.languages && parsedData.languages.length > 0) {
      console.log(`Inserting ${parsedData.languages.length} languages`);
      insertPromises.push(
        supabase
          .from('candidate_languages')
          .insert(parsedData.languages.map((lang: any) => ({
            candidate_id: userId,
            language_name: lang.name,
            proficiency: lang.proficiency || "Intermediate" // Default proficiency if not provided
          })))
      );
    }
    
    // Save experience
    if (parsedData.experience && parsedData.experience.length > 0) {
      console.log(`Inserting ${parsedData.experience.length} experience items`);
      insertPromises.push(
        supabase
          .from('candidate_experience')
          .insert(parsedData.experience.map((exp: any) => ({
            candidate_id: userId,
            company: exp.company,
            title: exp.title,
            location: exp.location || "",
            start_date: formatDateForDB(exp.startDate) || null,
            end_date: formatDateForDB(exp.endDate) || null,
            current: exp.current || false,
            description: exp.description || ""
          })))
      );
    }
    
    // Save education
    if (parsedData.education && parsedData.education.length > 0) {
      console.log(`Inserting ${parsedData.education.length} education items`);
      insertPromises.push(
        supabase
          .from('candidate_education')
          .insert(parsedData.education.map((edu: any) => ({
            candidate_id: userId,
            institution: edu.institution,
            degree: edu.degree,
            start_date: formatDateForDB(edu.startDate) || null,
            end_date: formatDateForDB(edu.endDate) || null,
            description: edu.description || ""
          })))
      );
    }
    
    // Save certificates
    if (parsedData.certificates && parsedData.certificates.length > 0) {
      console.log(`Inserting ${parsedData.certificates.length} certificates`);
      insertPromises.push(
        supabase
          .from('candidate_certificates')
          .insert(parsedData.certificates.map((cert: any) => ({
            candidate_id: userId,
            name: cert.name,
            issuer: cert.issuer || "",
            issue_date: formatDateForDB(cert.issueDate) || null,
            expiry_date: formatDateForDB(cert.expiryDate) || null,
            credential_id: cert.credentialId || ""
          })))
      );
    }
    
    // Save projects
    if (parsedData.projects && parsedData.projects.length > 0) {
      console.log(`Inserting ${parsedData.projects.length} projects`);
      insertPromises.push(
        supabase
          .from('candidate_projects')
          .insert(parsedData.projects.map((project: any) => ({
            candidate_id: userId,
            title: project.title,
            description: project.description || "",
            link: project.link || "",
            technologies: project.technologies || []
          })))
      );
    }

    // Execute all insert operations
    try {
      const results = await Promise.all(insertPromises);
      for (let i = 0; i < results.length; i++) {
        if (results[i].error) {
          console.error(`Error in batch ${i+1}:`, results[i].error);
        }
      }
      console.log('All profile data inserted successfully');
    } catch (insertError) {
      console.error('Error inserting profile data:', insertError);
    }

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Profile generated successfully',
        profileData: parsedData 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-profile-from-resume function:', error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
