
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS headers for browser access
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { applicationId, resumeUrl, resumeText, jobId } = await req.json();
    if (!applicationId || !jobId) {
      return new Response(JSON.stringify({ error: "Missing required parameters" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!resumeUrl && !resumeText) {
      return new Response(JSON.stringify({ error: "Either resumeUrl or resumeText must be provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Calculating match score for application: ${applicationId}, job: ${jobId}`);

    // Get job details
    const jobResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/jobs?id=eq.${jobId}&select=*`,
      {
        headers: {
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!jobResponse.ok) {
      throw new Error(`Failed to fetch job details: ${await jobResponse.text()}`);
    }

    const jobs = await jobResponse.json();
    if (jobs.length === 0) {
      throw new Error(`Job with ID ${jobId} not found`);
    }
    
    const job = jobs[0];
    console.log(`Job found: ${job.title}`);

    // Get resume text - either from storage or directly from the request
    let candidateResumeText = '';
    
    if (resumeText) {
      // Use the provided resume text directly
      candidateResumeText = resumeText;
      console.log(`Using provided resume text (${resumeText.length} chars)`);
    } else if (resumeUrl) {
      // Get resume from storage URL
      const storageUrl = `${SUPABASE_URL}/storage/v1/object/public/resume/${resumeUrl.split('/').pop()}`;
      console.log(`Fetching resume from: ${storageUrl}`);
      
      try {
        const resumeResponse = await fetch(storageUrl);
        if (!resumeResponse.ok) {
          // Try to get parsed resume from parsed-data bucket
          const parsedDataResponse = await fetch(
            `${SUPABASE_URL}/rest/v1/applications?id=eq.${applicationId}&select=parsed_text`,
            {
              headers: {
                Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
                "Content-Type": "application/json",
              },
            }
          );
          
          if (parsedDataResponse.ok) {
            const parsedData = await parsedDataResponse.json();
            if (parsedData.length > 0 && parsedData[0].parsed_text) {
              candidateResumeText = parsedData[0].parsed_text;
              console.log(`Using parsed text from database (${candidateResumeText.length} chars)`);
            } else {
              throw new Error('No parsed text available in database');
            }
          } else {
            throw new Error(`Failed to fetch parsed resume: ${await parsedDataResponse.text()}`);
          }
        } else {
          candidateResumeText = await resumeResponse.text();
          console.log(`Resume fetched (${candidateResumeText.length} chars)`);
        }
      } catch (error) {
        console.error(`Error fetching resume: ${error.message}`);
        throw new Error(`Failed to fetch resume content: ${error.message}`);
      }
    }

    if (!candidateResumeText) {
      throw new Error("Could not obtain resume text from any source");
    }

    // Prepare job requirements context
    let jobRequirements = '';
    if (job.requirements && job.requirements.length > 0) {
      jobRequirements = "Requirements:\n- " + job.requirements.join("\n- ");
    }
    
    let jobResponsibilities = '';
    if (job.responsibilities && job.responsibilities.length > 0) {
      jobResponsibilities = "Responsibilities:\n- " + job.responsibilities.join("\n- ");
    }
    
    const jobContext = `
Job Title: ${job.title}
Job Description: ${job.description || 'No description provided'}
${jobRequirements}
${jobResponsibilities}
Job Type: ${job.type}
Experience Level: ${job.level || 'Not specified'}
`;

    // Calculate match score using OpenAI
    console.log("Calculating match score with OpenAI...");
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a talent acquisition specialist analyzing how well a candidate's resume matches a job description. Provide a percentage match score (0-100) and a brief explanation of the match."
          },
          {
            role: "user",
            content: `
I need to evaluate how well this candidate's resume matches the job requirements.

CANDIDATE RESUME:
${candidateResumeText.substring(0, 7000)}

JOB DETAILS:
${jobContext}

Please provide:
1. A percentage match score (just the number, 0-100)
2. A one paragraph explanation of the match
`
          }
        ],
        temperature: 0.3,
      }),
    });

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${await openaiResponse.text()}`);
    }

    const openaiData = await openaiResponse.json();
    console.log(`OpenAI response received: ${openaiData.choices[0].message.content}`);
    
    // Extract score from response
    const responseText = openaiData.choices[0].message.content;
    const scoreRegex = /(\d+)%|(\d+)\s*%|(\d+)/;
    const match = responseText.match(scoreRegex);
    
    let matchScore = 0;
    if (match) {
      matchScore = parseInt(match[0].replace('%', ''), 10);
    }
    console.log(`Match score extracted: ${matchScore}`);
    
    // Extract explanation part
    let explanation = responseText;
    if (explanation.includes('2.')) {
      explanation = explanation.split('2.')[1].trim();
    } else if (explanation.includes('\n\n')) {
      explanation = explanation.split('\n\n')[1].trim();
    }

    // Update the application with the match score
    console.log(`Updating application ${applicationId} with match score ${matchScore}`);
    const updateResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/applications?id=eq.${applicationId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({
          match_score: matchScore,
        }),
      }
    );

    if (!updateResponse.ok) {
      throw new Error(`Failed to update match score: ${await updateResponse.text()}`);
    }
    
    console.log(`Match score updated successfully`);

    return new Response(
      JSON.stringify({
        success: true,
        matchScore: matchScore,
        explanation: explanation,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
