
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const geminiApiKey = Deno.env.get("GEMINI_API_KEY") || "";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, forceRefresh, resumeUrl } = await req.json();
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Missing required param: userId" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Generating profile for user ${userId}`);
    
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if we already have profile data for this user
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    // Only generate a new profile if forceRefresh is true or if the profile is incomplete
    const shouldGenerateProfile = forceRefresh || 
      !existingProfile || 
      !existingProfile.bio || 
      existingProfile.bio === "";

    if (!shouldGenerateProfile) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Profile already exists and is complete", 
          generated: false 
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Get the most recent parsed resume for this user
    let resumeText;
    
    if (resumeUrl) {
      // If resumeUrl is provided, get this specific parsed resume
      const parsedFileName = resumeUrl.split('/').pop() + ".txt";
      const { data: parsedFile } = await supabase.storage
        .from("parsed-data")
        .download(`${userId}/${parsedFileName}`);
      
      if (parsedFile) {
        resumeText = await parsedFile.text();
      }
    } else {
      // Otherwise, find the most recent parsed resume
      const { data: parsedFiles } = await supabase.storage
        .from("parsed-data")
        .list(userId);
      
      if (parsedFiles && parsedFiles.length > 0) {
        // Sort files by created_at (most recent first)
        parsedFiles.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        
        const { data: parsedFile } = await supabase.storage
          .from("parsed-data")
          .download(`${userId}/${parsedFiles[0].name}`);
          
        if (parsedFile) {
          resumeText = await parsedFile.text();
        }
      }
    }

    if (!resumeText) {
      return new Response(
        JSON.stringify({ error: "No parsed resume found for this user" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Use Gemini API to extract structured data from resume text
    const prompt = `
Extract the following information from this resume text. Format your response as a JSON object without any additional explanations:

{
  "personal": {
    "name": "Full Name",
    "title": "Professional Title",
    "location": "City, State/Country",
    "phone": "Phone Number",
    "email": "Email Address",
    "bio": "A professional summary in first person of about 100-150 words"
  },
  "skills": [
    {"name": "Skill Name", "level": number from 1-5}
  ],
  "languages": [
    {"name": "Language Name", "proficiency": "Basic|Conversational|Fluent|Native"}
  ],
  "experience": [
    {
      "company": "Company Name",
      "title": "Job Title",
      "location": "City, State/Country",
      "startDate": "YYYY-MM-DD (if only year is available, use YYYY-01-01)",
      "endDate": "YYYY-MM-DD or null if current",
      "current": true/false,
      "description": "Job description including responsibilities and achievements"
    }
  ],
  "education": [
    {
      "institution": "Institution Name",
      "degree": "Degree and Field of Study",
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD",
      "description": "Additional details about coursework, achievements, etc."
    }
  ],
  "certificates": [
    {
      "name": "Certificate Name",
      "issuer": "Issuing Organization",
      "issueDate": "YYYY-MM-DD",
      "expiryDate": "YYYY-MM-DD or null if no expiry",
      "credentialId": "ID if available"
    }
  ],
  "projects": [
    {
      "title": "Project Name",
      "description": "Project description",
      "link": "URL to project if available",
      "technologies": ["Tech1", "Tech2"]
    }
  ],
  "links": {
    "portfolio": "URL or null",
    "github": "URL or null",
    "linkedin": "URL or null",
    "twitter": "URL or null"
  }
}

Don't generate or make up any information that doesn't exist in the resume. Leave fields as null or empty array [] if the information is not present.

Resume Text:
${resumeText}
    `;

    // Call Gemini API to extract structured data
    // Setting temperature to 0.1 to match OpenAI's consistency in profile generation
    // Lower temperature provides more deterministic and consistent outputs
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            temperature: 0.1, // Changed from 0.2 to 0.1 to match OpenAI's controlled output
            maxOutputTokens: 8192
          }
        })
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error(`Gemini API error: ${errorText}`);
      throw new Error(`Gemini API error: ${errorText}`);
    }

    const geminiResult = await geminiResponse.json();
    let profileData;
    
    try {
      if (geminiResult.candidates && geminiResult.candidates[0] && geminiResult.candidates[0].content) {
        const rawText = geminiResult.candidates[0].content.parts[0].text;
        // Extract JSON from the response (it might be wrapped in markdown code blocks)
        const jsonMatch = rawText.match(/```json\n([\s\S]*?)\n```/) || 
                         rawText.match(/```\n([\s\S]*?)\n```/) || 
                         [null, rawText];
        profileData = JSON.parse(jsonMatch[1] || rawText);
      } else {
        throw new Error("Unexpected Gemini API response format");
      }
    } catch (e) {
      console.error("Error parsing Gemini response:", e);
      return new Response(
        JSON.stringify({ error: "Failed to parse profile data from Gemini response" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Update the profile information
    await supabase
      .from("profiles")
      .update({
        bio: profileData.personal.bio || existingProfile?.bio,
        location: profileData.personal.location || existingProfile?.location,
        title: profileData.personal.title || existingProfile?.title,
        portfolio_url: profileData.links?.portfolio || existingProfile?.portfolio_url,
        github_url: profileData.links?.github || existingProfile?.github_url,
        linkedin_url: profileData.links?.linkedin || existingProfile?.linkedin_url,
        twitter_url: profileData.links?.twitter || existingProfile?.twitter_url,
        phone: profileData.personal.phone || existingProfile?.phone,
        updated_at: new Date().toISOString()
      })
      .eq("id", userId);

    // Update skills
    if (profileData.skills && profileData.skills.length > 0) {
      // First delete existing skills
      await supabase
        .from("candidate_skills")
        .delete()
        .eq("candidate_id", userId);
      
      // Then insert new skills
      await supabase
        .from("candidate_skills")
        .insert(profileData.skills.map(skill => ({
          candidate_id: userId,
          skill_name: skill.name,
          skill_level: skill.level
        })));
    }

    // Update languages
    if (profileData.languages && profileData.languages.length > 0) {
      // First delete existing languages
      await supabase
        .from("candidate_languages")
        .delete()
        .eq("candidate_id", userId);
      
      // Then insert new languages
      await supabase
        .from("candidate_languages")
        .insert(profileData.languages.map(lang => ({
          candidate_id: userId,
          language_name: lang.name,
          proficiency: lang.proficiency
        })));
    }

    // Update experience
    if (profileData.experience && profileData.experience.length > 0) {
      // First delete existing experience entries
      await supabase
        .from("candidate_experience")
        .delete()
        .eq("candidate_id", userId);
      
      // Then insert new experience entries
      await supabase
        .from("candidate_experience")
        .insert(profileData.experience.map(exp => ({
          candidate_id: userId,
          company: exp.company,
          title: exp.title,
          location: exp.location,
          start_date: exp.startDate,
          end_date: exp.endDate,
          current: exp.current,
          description: exp.description
        })));
    }

    // Update education
    if (profileData.education && profileData.education.length > 0) {
      // First delete existing education entries
      await supabase
        .from("candidate_education")
        .delete()
        .eq("candidate_id", userId);
      
      // Then insert new education entries
      await supabase
        .from("candidate_education")
        .insert(profileData.education.map(edu => ({
          candidate_id: userId,
          institution: edu.institution,
          degree: edu.degree,
          start_date: edu.startDate,
          end_date: edu.endDate,
          description: edu.description
        })));
    }

    // Update certificates
    if (profileData.certificates && profileData.certificates.length > 0) {
      // First delete existing certificates
      await supabase
        .from("candidate_certificates")
        .delete()
        .eq("candidate_id", userId);
      
      // Then insert new certificates
      await supabase
        .from("candidate_certificates")
        .insert(profileData.certificates.map(cert => ({
          candidate_id: userId,
          name: cert.name,
          issuer: cert.issuer,
          issue_date: cert.issueDate,
          expiry_date: cert.expiryDate,
          credential_id: cert.credentialId
        })));
    }

    // Update projects
    if (profileData.projects && profileData.projects.length > 0) {
      // First delete existing projects
      await supabase
        .from("candidate_projects")
        .delete()
        .eq("candidate_id", userId);
      
      // Then insert new projects
      await supabase
        .from("candidate_projects")
        .insert(profileData.projects.map(project => ({
          candidate_id: userId,
          title: project.title,
          description: project.description,
          link: project.link,
          technologies: project.technologies
        })));
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Profile generated successfully from resume",
        generated: true,
        profileData
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error(`Unexpected error: ${err.message}`, err.stack);
    return new Response(
      JSON.stringify({ error: err.message, stack: err.stack }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
