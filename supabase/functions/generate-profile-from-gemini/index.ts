
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
    const { userId, forceRefresh, resumeUrl, parsedData } = await req.json();
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
    console.log("Parsed data provided:", parsedData ? "Yes" : "No");
    
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

    // If parsedData is provided directly, use it
    let profileData;
    let rawResumeText;
    
    if (parsedData) {
      console.log("Using provided parsed resume data");
      
      // Check if parsedData is already structured or if it's raw text
      if (typeof parsedData === 'string') {
        try {
          // Try to parse it as JSON
          profileData = JSON.parse(parsedData);
          console.log("Successfully parsed JSON data from string");
        } catch (e) {
          // If it's not valid JSON, it's probably raw text
          console.log("Using provided data as raw text for parsing");
          rawResumeText = parsedData;
        }
      } else {
        // It's already an object
        profileData = parsedData;
      }
    } else {
      // First check if we have parsed data in the profiles table
      if (existingProfile?.ai_parsed_data) {
        try {
          // Check if it's already a JSON object
          if (typeof existingProfile.ai_parsed_data === 'object') {
            profileData = existingProfile.ai_parsed_data;
          } else {
            // Try to parse it as JSON
            profileData = JSON.parse(existingProfile.ai_parsed_data);
          }
          console.log("Using parsed resume data from profiles table");
        } catch (e) {
          console.error("Error parsing profile data:", e);
          // If it's not valid JSON, it might be raw text
          rawResumeText = existingProfile.ai_parsed_data;
          console.log("Using raw text from ai_parsed_data for parsing");
        }
      }
      
      // If we still don't have profile data or raw text, get the most recent parsed resume
      if (!profileData && !rawResumeText) {
        // Get the most recent parsed resume for this user or from a specific URL
        let resumeText;
        
        if (resumeUrl) {
          // If resumeUrl is provided, get this specific parsed resume
          const parsedFileName = resumeUrl.split('/').pop() + ".txt";
          const { data: parsedFile } = await supabase.storage
            .from("parsed-data")
            .download(`${userId}/${parsedFileName}`);
          
          if (parsedFile) {
            resumeText = await parsedFile.text();
            console.log("Retrieved text from parsed file, length:", resumeText.length);
            rawResumeText = resumeText;
          } else {
            console.log("No parsed file found for the provided URL");
          }
        } else {
          // Otherwise, find the most recent parsed resume
          const { data: parsedFiles } = await supabase.storage
            .from("parsed-data")
            .list(userId);
          
          if (parsedFiles && parsedFiles.length > 0) {
            // First check for JSON files
            const jsonFiles = parsedFiles.filter(file => file.name.endsWith('.json'));
            
            if (jsonFiles.length > 0) {
              // Sort JSON files by created_at (most recent first)
              jsonFiles.sort((a, b) => 
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
              );
              
              console.log("Found JSON files:", jsonFiles.map(f => f.name).join(', '));
              
              const { data: jsonFile } = await supabase.storage
                .from("parsed-data")
                .download(`${userId}/${jsonFiles[0].name}`);
                
              if (jsonFile) {
                const jsonText = await jsonFile.text();
                try {
                  profileData = JSON.parse(jsonText);
                  console.log("Using previously parsed JSON data from file:", jsonFiles[0].name);
                  
                  // Save this data to the profile table
                  await supabase
                    .from("profiles")
                    .update({ 
                      ai_parsed_data: jsonText,
                      updated_at: new Date().toISOString()
                    })
                    .eq("id", userId);
                  console.log("Saved parsed data to profile table");
                } catch (e) {
                  console.error("Error parsing JSON file:", e);
                }
              }
            }
            
            // If we couldn't get JSON data, try with text files
            if (!profileData) {
              // Sort files by created_at (most recent first)
              parsedFiles.sort((a, b) => 
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
              );
              
              const textFiles = parsedFiles.filter(file => file.name.endsWith('.txt'));
              
              if (textFiles.length > 0) {
                console.log("Found text files:", textFiles.map(f => f.name).join(', '));
                const { data: parsedFile } = await supabase.storage
                  .from("parsed-data")
                  .download(`${userId}/${textFiles[0].name}`);
                  
                if (parsedFile) {
                  rawResumeText = await parsedFile.text();
                  console.log("Retrieved text from text file, length:", rawResumeText ? rawResumeText.length : 0);
                }
              }
            }
          }
        }
      }
    }

    // Parse raw text into structured data if needed
    if (!profileData && rawResumeText) {
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
${rawResumeText}
      `;

      console.log("Calling Gemini API to parse resume text...");
      // Call Gemini API to extract structured data
      // Setting temperature to 0.1 for consistent outputs
      try {
        const geminiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
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
                temperature: 0.1,
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
        
        if (geminiResult.candidates && geminiResult.candidates[0] && geminiResult.candidates[0].content) {
          const rawText = geminiResult.candidates[0].content.parts[0].text;
          // Extract JSON from the response (it might be wrapped in markdown code blocks)
          const jsonMatch = rawText.match(/```json\n([\s\S]*?)\n```/) || 
                          rawText.match(/```\n([\s\S]*?)\n```/) || 
                          [null, rawText];
          
          try {
            profileData = JSON.parse(jsonMatch[1] || rawText);
            console.log("Successfully parsed resume with Gemini");
            
            // Save this parsed data to the profiles table
            await supabase
              .from("profiles")
              .update({ 
                ai_parsed_data: JSON.stringify(profileData),
                updated_at: new Date().toISOString()
              })
              .eq("id", userId);
            console.log("Saved parsed data to profile table");
            
            // Also save to storage for future use
            const timestamp = new Date().getTime();
            const jsonFilePath = `${userId}/${timestamp}_parsed_resume.json`;
            
            await supabase.storage
              .from("parsed-data")
              .upload(jsonFilePath, new Blob([JSON.stringify(profileData, null, 2)]), {
                contentType: 'application/json',
                upsert: true
              });
              
            console.log(`Saved parsed resume data to: ${jsonFilePath}`);
          } catch (parseError) {
            console.error("Error parsing JSON from Gemini response:", parseError);
            console.error("Raw text sample:", rawText.substring(0, 200));
          }
        } else {
          console.error("Unexpected Gemini API response format:", geminiResult);
          throw new Error("Unexpected Gemini API response format");
        }
      } catch (geminiError) {
        console.error("Error with Gemini API:", geminiError);
        throw geminiError;
      }
    }

    if (!profileData && !rawResumeText) {
      return new Response(
        JSON.stringify({ error: "No resume data found for this user" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Update the profile information
    if (profileData) {
      console.log("Updating profile with parsed data");
      try {
        await supabase
          .from("profiles")
          .update({
            bio: profileData.personal?.bio || existingProfile?.bio,
            location: profileData.personal?.location || existingProfile?.location,
            title: profileData.personal?.title || existingProfile?.title,
            portfolio_url: profileData.links?.portfolio || existingProfile?.portfolio_url,
            github_url: profileData.links?.github || existingProfile?.github_url,
            linkedin_url: profileData.links?.linkedin || existingProfile?.linkedin_url,
            twitter_url: profileData.links?.twitter || existingProfile?.twitter_url,
            phone: profileData.personal?.phone || existingProfile?.phone,
            updated_at: new Date().toISOString()
          })
          .eq("id", userId);
          
        console.log("Profile basic info updated successfully");

        // Update skills
        if (profileData.skills && profileData.skills.length > 0) {
          // First delete existing skills
          await supabase
            .from("candidate_skills")
            .delete()
            .eq("candidate_id", userId);
          
          // Then insert new skills
          const skillsToInsert = profileData.skills.map(skill => ({
            candidate_id: userId,
            skill_name: skill.name,
            skill_level: skill.level
          })).filter(skill => skill.skill_name); // Filter out any skills without a name
          
          if (skillsToInsert.length > 0) {
            const { error: skillsError } = await supabase
              .from("candidate_skills")
              .insert(skillsToInsert);
              
            if (skillsError) {
              console.error("Error inserting skills:", skillsError);
            } else {
              console.log(`${skillsToInsert.length} skills inserted`);
            }
          }
        }

        // Update languages
        if (profileData.languages && profileData.languages.length > 0) {
          // First delete existing languages
          await supabase
            .from("candidate_languages")
            .delete()
            .eq("candidate_id", userId);
          
          // Then insert new languages
          const languagesToInsert = profileData.languages.map(lang => ({
            candidate_id: userId,
            language_name: lang.name,
            proficiency: lang.proficiency
          })).filter(lang => lang.language_name); // Filter out any languages without a name
          
          if (languagesToInsert.length > 0) {
            const { error: languagesError } = await supabase
              .from("candidate_languages")
              .insert(languagesToInsert);
              
            if (languagesError) {
              console.error("Error inserting languages:", languagesError);
            } else {
              console.log(`${languagesToInsert.length} languages inserted`);
            }
          }
        }

        // Update experience
        if (profileData.experience && profileData.experience.length > 0) {
          // First delete existing experience entries
          await supabase
            .from("candidate_experience")
            .delete()
            .eq("candidate_id", userId);
          
          // Process each experience entry to ensure dates are valid
          const experiencesToInsert = profileData.experience.map(exp => {
            // Process start date
            let startDate = exp.startDate;
            if (typeof startDate === 'string') {
              // If it's just a year, convert to YYYY-01-01 format
              if (/^\d{4}$/.test(startDate)) {
                startDate = `${startDate}-01-01`;
              }
              // Validate the date is in YYYY-MM-DD format
              if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
                // Default to a valid date format
                console.warn(`Invalid start date format: ${startDate}, using default`);
                startDate = '2000-01-01'; // Default date
              }
            }
            
            // Process end date
            let endDate = exp.endDate;
            if (exp.current || endDate === 'Till date' || endDate === 'Present') {
              endDate = null; // Use null for current positions
            } else if (typeof endDate === 'string') {
              // If it's just a year, convert to YYYY-12-31 format
              if (/^\d{4}$/.test(endDate)) {
                endDate = `${endDate}-12-31`;
              }
              // Validate the date is in YYYY-MM-DD format
              if (!/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
                // Default to a valid date format
                console.warn(`Invalid end date format: ${endDate}, using default`);
                endDate = null; // Use null if invalid
              }
            }
            
            return {
              candidate_id: userId,
              company: exp.company,
              title: exp.title,
              location: exp.location,
              start_date: startDate,
              end_date: endDate,
              current: !!exp.current,
              description: exp.description
            };
          }).filter(exp => exp.company && exp.title); // Filter out any experiences without company or title
          
          if (experiencesToInsert.length > 0) {
            const { error: expError } = await supabase
              .from("candidate_experience")
              .insert(experiencesToInsert);
              
            if (expError) {
              console.error("Error inserting experience:", expError);
            } else {
              console.log(`${experiencesToInsert.length} experience items inserted`);
            }
          }
        }

        // Update education
        if (profileData.education && profileData.education.length > 0) {
          // First delete existing education entries
          await supabase
            .from("candidate_education")
            .delete()
            .eq("candidate_id", userId);
          
          // Process each education entry to ensure dates are valid
          const educationToInsert = profileData.education.map(edu => {
            // Process start date
            let startDate = edu.startDate;
            if (typeof startDate === 'string') {
              // If it's just a year, convert to YYYY-01-01 format
              if (/^\d{4}$/.test(startDate)) {
                startDate = `${startDate}-01-01`;
              }
              // Validate the date is in YYYY-MM-DD format
              if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
                // Default to a valid date format
                console.warn(`Invalid start date format: ${startDate}, using default`);
                startDate = '2000-01-01'; // Default date
              }
            }
            
            // Process end date
            let endDate = edu.endDate;
            if (typeof endDate === 'string') {
              // If it's just a year, convert to YYYY-12-31 format
              if (/^\d{4}$/.test(endDate)) {
                endDate = `${endDate}-12-31`;
              }
              // Validate the date is in YYYY-MM-DD format
              if (!/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
                // Default to a valid date format
                console.warn(`Invalid end date format: ${endDate}, using default`);
                endDate = null; // Use null if invalid
              }
            }
            
            return {
              candidate_id: userId,
              institution: edu.institution,
              degree: edu.degree,
              start_date: startDate,
              end_date: endDate,
              description: edu.description
            };
          }).filter(edu => edu.institution && edu.degree); // Filter out any education without institution or degree
          
          if (educationToInsert.length > 0) {
            const { error: eduError } = await supabase
              .from("candidate_education")
              .insert(educationToInsert);
              
            if (eduError) {
              console.error("Error inserting education:", eduError);
            } else {
              console.log(`${educationToInsert.length} education items inserted`);
            }
          }
        }

        // Update certificates
        if (profileData.certificates && profileData.certificates.length > 0) {
          // First delete existing certificates
          await supabase
            .from("candidate_certificates")
            .delete()
            .eq("candidate_id", userId);
          
          // Process each certificate to ensure dates are valid
          const certificatesToInsert = profileData.certificates.map(cert => {
            // Process issue date
            let issueDate = cert.issueDate;
            if (typeof issueDate === 'string') {
              // If it's just a year, convert to YYYY-01-01 format
              if (/^\d{4}$/.test(issueDate)) {
                issueDate = `${issueDate}-01-01`;
              }
              // Validate the date is in YYYY-MM-DD format
              if (!/^\d{4}-\d{2}-\d{2}$/.test(issueDate)) {
                // Default to a valid date format
                console.warn(`Invalid issue date format: ${issueDate}, using default`);
                issueDate = null; // Use null if invalid
              }
            }
            
            // Process expiry date
            let expiryDate = cert.expiryDate;
            if (typeof expiryDate === 'string') {
              // If it's just a year, convert to YYYY-12-31 format
              if (/^\d{4}$/.test(expiryDate)) {
                expiryDate = `${expiryDate}-12-31`;
              }
              // Validate the date is in YYYY-MM-DD format
              if (!/^\d{4}-\d{2}-\d{2}$/.test(expiryDate)) {
                // Default to a valid date format
                console.warn(`Invalid expiry date format: ${expiryDate}, using default`);
                expiryDate = null; // Use null if invalid
              }
            }
            
            return {
              candidate_id: userId,
              name: cert.name,
              issuer: cert.issuer,
              issue_date: issueDate,
              expiry_date: expiryDate,
              credential_id: cert.credentialId
            };
          }).filter(cert => cert.name && cert.issuer); // Filter out any certificates without a name or issuer
          
          if (certificatesToInsert.length > 0) {
            const { error: certError } = await supabase
              .from("candidate_certificates")
              .insert(certificatesToInsert);
              
            if (certError) {
              console.error("Error inserting certificates:", certError);
            } else {
              console.log(`${certificatesToInsert.length} certificates inserted`);
            }
          }
        }

        // Update projects
        if (profileData.projects && profileData.projects.length > 0) {
          // First delete existing projects
          await supabase
            .from("candidate_projects")
            .delete()
            .eq("candidate_id", userId);
          
          // Then insert new projects
          const projectsToInsert = profileData.projects.map(project => ({
            candidate_id: userId,
            title: project.title,
            description: project.description,
            link: project.link,
            technologies: project.technologies
          })).filter(project => project.title); // Filter out any projects without a title
          
          if (projectsToInsert.length > 0) {
            const { error: projError } = await supabase
              .from("candidate_projects")
              .insert(projectsToInsert);
              
            if (projError) {
              console.error("Error inserting projects:", projError);
            } else {
              console.log(`${projectsToInsert.length} projects inserted`);
            }
          }
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
      } catch (updateError) {
        console.error("Error updating profile data:", updateError);
        throw updateError;
      }
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: "No profile data could be extracted",
          generated: false
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
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
