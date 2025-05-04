
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
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { filePath, candidateId } = await req.json();
    if (!filePath || !candidateId) {
      return new Response(
        JSON.stringify({ error: "Missing required params: filePath and candidateId" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Processing resume with Gemini: ${filePath} for candidate: ${candidateId}`);

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if the file path is a URL or just a path segment
    let fullResumeUrl = filePath;
    if (!filePath.startsWith("http")) {
      fullResumeUrl = `${supabaseUrl}/storage/v1/object/public/resume/${filePath}`;
      console.log(`Converted path to full URL: ${fullResumeUrl}`);
    }
    
    // 1. Download the resume file from storage
    console.log(`Downloading from URL: ${fullResumeUrl}`);
    
    const fileRes = await fetch(fullResumeUrl, {
      headers: { Authorization: `Bearer ${supabaseServiceKey}` },
    });
    
    if (!fileRes.ok) {
      console.error(`Failed to fetch file from storage: ${await fileRes.text()}`);
      // Try alternative URL format
      const alternativeUrl = `${supabaseUrl}/storage/v1/object/resume/${filePath.split('/').pop()}`;
      console.log(`Trying alternative URL: ${alternativeUrl}`);
      
      const altFileRes = await fetch(alternativeUrl, {
        headers: { Authorization: `Bearer ${supabaseServiceKey}` },
      });
      
      if (!altFileRes.ok) {
        return new Response(
          JSON.stringify({ 
            error: "Failed to fetch file from storage after multiple attempts", 
            status: fileRes.status,
            path: filePath
          }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      // Continue with the alternative response
      const resumeBlob = await altFileRes.blob();
      console.log(`Resume downloaded from alternative URL, size: ${resumeBlob.size} bytes`);
      
      // Process with this blob...
    }
    
    const resumeBlob = await fileRes.blob();
    console.log(`Resume downloaded, size: ${resumeBlob.size} bytes`);

    // 2. Convert the blob to base64
    const reader = new FileReader();
    const base64Promise = new Promise((resolve) => {
      reader.onloadend = () => {
        const base64data = reader.result;
        resolve(base64data);
      };
    });
    reader.readAsDataURL(resumeBlob);
    const base64data = await base64Promise;
    const base64String = base64data.toString().split(',')[1]; // Remove data URL prefix
    
    // 3. Extract text from the resume using Google Gemini API
    let extractedText = "";
    const fileExtension = filePath.toLowerCase().split('.').pop();
    
    try {
      // Call Gemini API to extract text from the resume
      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro-latest:generateContent?key=${geminiApiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `Extract all text content from this resume ${fileExtension} document. Include all sections such as contact information, work experience, education, skills, projects, and any other information present. Format the output as plain text, preserving the structure of the document as much as possible.`
                  },
                  {
                    inline_data: {
                      mime_type: resumeBlob.type,
                      data: base64String
                    }
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.2,
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
        extractedText = geminiResult.candidates[0].content.parts[0].text;
      } else {
        throw new Error("Unexpected Gemini API response format");
      }
      
      console.log(`Successfully extracted ${extractedText.length} characters from the resume using Gemini`);
    } catch (e) {
      console.error("Error extracting text with Gemini:", e);
      return new Response(
        JSON.stringify({ error: "Failed to extract text from document", details: e.message }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 4. Save the extracted text to the parsed-data bucket
    const parsedFileName = `${candidateId}/${filePath.split('/').pop()}.txt`;
    console.log(`Uploading parsed text to: parsed-data/${parsedFileName}`);
    
    const uploadRes = await fetch(
      `${supabaseUrl}/storage/v1/object/parsed-data/${parsedFileName}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${supabaseServiceKey}`,
          "Content-Type": "text/plain",
          "Cache-Control": "3600",
        },
        body: extractedText,
      }
    );

    if (!uploadRes.ok) {
      console.error(`Upload failed: ${await uploadRes.text()}`);
      return new Response(
        JSON.stringify({ error: "Supabase upload to parsed-data bucket failed" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 5. Return success response
    return new Response(
      JSON.stringify({
        success: true,
        parsedFilePath: parsedFileName,
        parsedTextLength: extractedText.length,
        candidateId: candidateId,
        message: "Resume successfully parsed with Gemini and stored"
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
