
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Google Gemini API
const genAI = new GoogleGenerativeAI(Deno.env.get("GEMINI_API_KEY") || "");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      resumeText,
      videoTranscript, 
      jobDescription,
      candidateId,
      email,
      firstName,
      lastName 
    } = await req.json();
    
    if (!resumeText) {
      throw new Error("Resume text is required");
    }

    console.log("Processing application for candidate:", candidateId);
    console.log("Resume length:", resumeText.length, "characters");
    if (videoTranscript) {
      console.log("Video transcript length:", videoTranscript.length, "characters");
    }

    // Step 1: Parse resume with Gemini
    const resumeParsingResults = await parseResumeWithGemini(resumeText);
    console.log("Resume parsing complete");

    // Step 2: Analyze video if provided
    let videoAnalysis = null;
    if (videoTranscript) {
      videoAnalysis = await analyzeVideoWithGemini(videoTranscript);
      console.log("Video analysis complete");
    }

    // Step 3: Calculate match score if job description is provided
    let matchScore = null;
    let matchJustification = "";
    if (jobDescription && resumeParsingResults) {
      const matchResults = await calculateMatchScore(
        jobDescription, 
        resumeParsingResults,
        videoAnalysis
      );
      matchScore = matchResults.match_score;
      matchJustification = matchResults.justification;
      console.log("Match score calculated:", matchScore);
    }

    // Step 4: Generate insights
    const insights = await generateInsights(resumeParsingResults, videoAnalysis, jobDescription);
    console.log("Insights generated");

    // Step 5: Generate welcome email content
    const emailContent = await generateWelcomeEmail({
      firstName: firstName || resumeParsingResults.name.split(" ")[0],
      email,
      nextSteps: "Your application is currently under review. You'll be notified of next steps within 3-5 business days."
    });
    console.log("Welcome email generated");

    return new Response(
      JSON.stringify({
        parsing_results: resumeParsingResults,
        video_analysis: videoAnalysis,
        match_score: matchScore,
        match_justification: matchJustification,
        insights,
        email_content: emailContent
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error in application processing:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An error occurred during application processing" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});

async function parseResumeWithGemini(resumeText: string) {
  try {
    // Create a more robustly formatted prompt to handle various resume formats
    const prompt = `
    Analyze the following resume text and extract the following details in JSON format:
    - name: Full name of the candidate
    - skills: Array of technical and soft skills
    - experience: Array of objects containing job title, company, duration, and responsibilities
    - education: Array of objects containing degree, institution, and year
    - projects: Array of objects containing name and description
    - certifications: Array of objects containing name and issuing organization

    Resume Text:
    ${resumeText}

    Return only valid JSON without explanation.`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      // Extract just the JSON part from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : text;
      return JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Error parsing Gemini JSON output:", parseError);
      console.log("Raw Gemini output:", text);
      
      // Fallback parsing with regex for more resilience
      const fallbackParsing = {
        name: extractWithRegex(text, /name["']?\s*:\s*["']([^"']+)["']/),
        skills: extractArrayWithRegex(text, /skills["']?\s*:\s*\[(.*?)\]/s),
        experience: [],
        education: [],
        projects: [],
        certifications: []
      };
      
      return fallbackParsing;
    }
  } catch (error) {
    console.error("Error in resume parsing:", error);
    throw new Error("Failed to parse resume: " + error.message);
  }
}

async function analyzeVideoWithGemini(videoTranscript: string) {
  try {
    const prompt = `
    Analyze the following video transcript from a job applicant and provide insights:
    - communication_style: Describe their communication style (formal, casual, technical, etc.)
    - motivation: Extract their motivations for applying to this position
    - strengths: List key strengths mentioned or demonstrated
    - unique_qualities: Identify any unique qualities or experiences that stand out

    Video Transcript:
    ${videoTranscript}

    Return only valid JSON without explanation.`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      // Extract just the JSON part from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : text;
      return JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Error parsing Gemini JSON output for video:", parseError);
      // Return a simplified version if parsing fails
      return {
        communication_style: "Could not determine",
        motivation: "Could not extract",
        strengths: [],
        unique_qualities: []
      };
    }
  } catch (error) {
    console.error("Error in video analysis:", error);
    return null;
  }
}

async function calculateMatchScore(
  jobDescription: string,
  resumeData: any,
  videoAnalysis: any
) {
  try {
    let candidateDetails = JSON.stringify(resumeData);
    if (videoAnalysis) {
      candidateDetails += "\n\nVideo Analysis: " + JSON.stringify(videoAnalysis);
    }

    const prompt = `
    Calculate a match score (0-100) for this candidate based on the following job description:
    
    Job Description:
    ${jobDescription}
    
    Candidate Details:
    ${candidateDetails}
    
    Return a JSON object with:
    - match_score: A number between 0-100
    - justification: Brief explanation of the score
    
    Return only valid JSON without explanation.`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      // Extract just the JSON part from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : text;
      return JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Error parsing Gemini JSON output for match score:", parseError);
      // Fallback to a default object
      return {
        match_score: 50, // Default middle score
        justification: "Score could not be calculated precisely due to parsing error."
      };
    }
  } catch (error) {
    console.error("Error calculating match score:", error);
    return {
      match_score: 0,
      justification: "Could not calculate due to an error: " + error.message
    };
  }
}

async function generateInsights(
  resumeData: any,
  videoAnalysis: any,
  jobDescription: string
) {
  try {
    let candidateDetails = JSON.stringify(resumeData);
    if (videoAnalysis) {
      candidateDetails += "\n\nVideo Analysis: " + JSON.stringify(videoAnalysis);
    }

    const prompt = `
    Generate actionable insights about this candidate based on their resume and video analysis:
    
    ${jobDescription ? `Job Description: ${jobDescription}\n\n` : ''}
    
    Candidate Details:
    ${candidateDetails}
    
    Provide a JSON object with:
    - strengths: Array of 3-5 key strengths
    - skill_gaps: Array of potential skill gaps (if job description provided)
    - cultural_fit: Assessment of potential cultural fit
    - summary: Brief summary of the candidate (2-3 sentences max)
    
    Return only valid JSON without explanation.`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      // Extract just the JSON part from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : text;
      return JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Error parsing Gemini JSON output for insights:", parseError);
      // Fallback to a simpler structure
      return {
        strengths: ["Communication skills", "Technical knowledge"],
        skill_gaps: [],
        cultural_fit: "Could not determine",
        summary: "Candidate has potential but detailed insights could not be generated."
      };
    }
  } catch (error) {
    console.error("Error generating insights:", error);
    return {
      strengths: [],
      skill_gaps: [],
      cultural_fit: "Could not analyze",
      summary: "Insights generation failed due to an error."
    };
  }
}

async function generateWelcomeEmail({
  firstName,
  email,
  nextSteps
}: {
  firstName: string;
  email: string;
  nextSteps: string;
}) {
  try {
    const prompt = `
    Write a brief, professional welcome email for a job applicant with the following details:
    - First Name: ${firstName}
    - Email: ${email}
    - Next Steps: ${nextSteps}
    
    The email should be friendly but professional, no more than 4-5 short paragraphs.
    Format it with Subject line and email body only.
    No need for HTML formatting or complex styling.
    
    Response should be the raw email text only, no explanation.`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating welcome email:", error);
    // Fallback to a template email if generation fails
    return `
Subject: Welcome to Our Application Process, ${firstName}!

Hi ${firstName},

Thank you for submitting your application. We've received your information and it's currently being reviewed by our team.

${nextSteps}

You can use your email address (${email}) to log in to our candidate portal and check the status of your application.

Best regards,
The Hiring Team
    `;
  }
}

// Helper functions for fallback parsing
function extractWithRegex(text: string, regex: RegExp): string {
  const match = text.match(regex);
  return match ? match[1] : "";
}

function extractArrayWithRegex(text: string, regex: RegExp): string[] {
  const match = text.match(regex);
  if (!match) return [];
  
  const arrayContent = match[1];
  const itemsRegex = /["']([^"']+)["']/g;
  const items: string[] = [];
  let itemMatch;
  
  while ((itemMatch = itemsRegex.exec(arrayContent)) !== null) {
    items.push(itemMatch[1]);
  }
  
  return items;
}
