
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import * as mammoth from "https://esm.sh/mammoth@1.6.0";

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
    const { filePath, candidateId, jobId = '' } = await req.json();
    console.log(`Processing file: ${filePath} for candidate: ${candidateId}`);

    // Get environment variables for Supabase connection
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Convert path to full URL if needed
    let fileUrl = filePath;
    if (!filePath.startsWith('http')) {
      fileUrl = `${supabaseUrl}/storage/v1/object/public/resume/${filePath}`;
      console.log(`Converted path to full URL: ${fileUrl}`);
    }
    
    // Download the file
    console.log(`Downloading from URL: ${fileUrl}`);
    const fileResponse = await fetch(fileUrl);
    if (!fileResponse.ok) {
      throw new Error(`Failed to download file: ${fileResponse.status} ${fileResponse.statusText}`);
    }
    
    const fileBuffer = await fileResponse.arrayBuffer();
    console.log(`File downloaded, size: ${fileBuffer.byteLength} bytes`);
    
    // Use Mammoth to extract text from the DOCX file
    console.log("Converting DOC/DOCX to text with mammoth...");
    let extractedText;
    try {
      const result = await mammoth.extractRawText({ arrayBuffer: fileBuffer });
      extractedText = result.value;
      console.log(`Successfully extracted ${extractedText.length} characters of text with Mammoth`);
    } catch (error) {
      console.error("Error extracting text with Mammoth:", error);
      throw new Error(`Mammoth extraction error: ${error.message}`);
    }
    
    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error("No text extracted from document");
    }
    
    // Save the extracted text to a file in the parsed-data bucket
    const timestamp = new Date().getTime();
    const parsedFilePath = `${candidateId}/${timestamp}_parsed_resume.txt`;
    
    console.log(`Saving extracted text to parsed-data/${parsedFilePath}`);
    const { error: uploadError } = await supabase
      .storage
      .from('parsed-data')
      .upload(parsedFilePath, new Blob([extractedText]), {
        contentType: 'text/plain',
        upsert: true
      });
    
    if (uploadError) {
      console.error("Error uploading parsed text:", uploadError);
      throw new Error(`Failed to save parsed text: ${uploadError.message}`);
    }
    
    console.log("Text extraction successful, now sending to AI for parsing...");

    // Use the best available model for parsing (try Gemini first, fallback to OpenAI)
    try {
      // Try Gemini first for parsing the extracted text
      const geminiApiKey = Deno.env.get('GEMINI_API_KEY') || '';
      
      if (geminiApiKey) {
        try {
          const parseResponse = await parseWithGemini(extractedText, geminiApiKey);
          
          // Save the structured data as JSON
          const jsonFilePath = `${candidateId}/${timestamp}_parsed_resume.json`;
          await supabase
            .storage
            .from('parsed-data')
            .upload(jsonFilePath, new Blob([JSON.stringify(parseResponse, null, 2)]), {
              contentType: 'application/json',
              upsert: true
            });
            
          return new Response(
            JSON.stringify({
              success: true,
              parsedFilePath,
              jsonFilePath,
              message: "Successfully parsed resume with Mammoth and Gemini"
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } catch (geminiError) {
          console.error("Gemini parsing failed, falling back to OpenAI:", geminiError);
        }
      }
      
      // Fallback to OpenAI
      const openaiApiKey = Deno.env.get('OPENAI_API_KEY') || '';
      if (!openaiApiKey) {
        throw new Error("No AI API keys available");
      }
      
      const parseResponse = await parseWithOpenAI(extractedText, openaiApiKey);
      
      // Save the structured data as JSON
      const jsonFilePath = `${candidateId}/${timestamp}_parsed_resume.json`;
      await supabase
        .storage
        .from('parsed-data')
        .upload(jsonFilePath, new Blob([JSON.stringify(parseResponse, null, 2)]), {
          contentType: 'application/json',
          upsert: true
        });
        
      return new Response(
        JSON.stringify({
          success: true,
          parsedFilePath,
          jsonFilePath,
          message: "Successfully parsed resume with Mammoth and OpenAI"
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (parsingError) {
      console.error("AI parsing error:", parsingError);
      
      // Return success for the text extraction even if AI parsing failed
      return new Response(
        JSON.stringify({
          success: true,
          parsedFilePath,
          message: "Extracted text successfully but AI parsing failed",
          error: parsingError.message
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
  } catch (error) {
    console.error("Error processing document:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Unknown error occurred"
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Helper function to parse resume text with Gemini
async function parseWithGemini(text: string, apiKey: string) {
  console.log("Parsing with Gemini...");
  // Updated to use the correct Gemini model and API endpoint
  const geminiUrl = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent";
  
  const response = await fetch(`${geminiUrl}?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `Extract structured information from this resume text and return a JSON object with the following fields:
              - name: the candidate's full name
              - email: the candidate's email address
              - phone: the candidate's phone number
              - location: the candidate's location
              - skills: an array of skills mentioned
              - experience: an array of work experience entries, each with company, title, startDate, endDate, and description
              - education: an array of education entries, each with institution, degree, field, startDate, and endDate
              - certifications: an array of certifications/licenses
              - languages: an array of languages spoken
              - summary: a brief professional summary
              
              Resume text:
              ${text}`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.2
      }
    }),
  });
  
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(`Gemini API error: ${JSON.stringify(result)}`);
  }
  
  try {
    // Updated to handle the correct response format for gemini-1.5-flash
    const textContent = result.candidates[0].content.parts[0].text;
    
    // Extract JSON from text (in case Gemini surrounds it with markdown)
    const jsonMatch = textContent.match(/```json\s*([\s\S]*?)\s*```/) || 
                     textContent.match(/```\s*([\s\S]*?)\s*```/) ||
                     [null, textContent];
    
    const jsonText = jsonMatch[1].trim();
    return JSON.parse(jsonText);
  } catch (e) {
    throw new Error(`Failed to parse Gemini response: ${e.message}`);
  }
}

// Helper function to parse resume text with OpenAI
async function parseWithOpenAI(text: string, apiKey: string) {
  console.log("Parsing with OpenAI...");
  
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a professional resume parser. Extract structured information from the resume text provided and return it as a valid JSON object."
        },
        {
          role: "user",
          content: `Extract structured information from this resume text and return ONLY a JSON object with the following fields:
          - name: the candidate's full name
          - email: the candidate's email address
          - phone: the candidate's phone number
          - location: the candidate's location
          - skills: an array of skills mentioned
          - experience: an array of work experience entries, each with company, title, startDate, endDate, and description
          - education: an array of education entries, each with institution, degree, field, startDate, and endDate
          - certifications: an array of certifications/licenses
          - languages: an array of languages spoken
          - summary: a brief professional summary
          
          Resume text:
          ${text}`
        }
      ],
      temperature: 0.2
    }),
  });
  
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(`OpenAI API error: ${JSON.stringify(result)}`);
  }
  
  try {
    const content = result.choices[0].message.content;
    
    // Extract JSON from text (in case GPT surrounds it with markdown)
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || 
                     content.match(/```\s*([\s\S]*?)\s*```/) ||
                     [null, content];
    
    const jsonText = jsonMatch[1].trim();
    return JSON.parse(jsonText);
  } catch (e) {
    throw new Error(`Failed to parse OpenAI response: ${e.message}`);
  }
}
