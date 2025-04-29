
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
    const { filePath, candidateId, jobId } = await req.json();
    if (!filePath || !candidateId) {
      return new Response(JSON.stringify({ error: "Missing required params: filePath and candidateId" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Processing resume: ${filePath} for candidate: ${candidateId}`);

    // 1. Download the file (resume) from the resume bucket
    const resumeUrl = `${SUPABASE_URL}/storage/v1/object/resume/${filePath}`;
    console.log(`Downloading from URL: ${resumeUrl}`);
    
    const fileRes = await fetch(resumeUrl, {
      headers: { Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` },
    });
    
    if (!fileRes.ok) {
      console.error(`Failed to fetch file from storage: ${await fileRes.text()}`);
      return new Response(JSON.stringify({ error: "Failed to fetch file from storage", status: fileRes.status }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    const resumeBlob = await fileRes.blob();
    console.log(`Resume downloaded, size: ${resumeBlob.size} bytes`);

    // 2. Extract text from the resume using OpenAI Vision API
    let extractedText = "";
    
    // Create a form data for the file
    const formData = new FormData();
    formData.append("file", resumeBlob, "resume.pdf");
    formData.append("model", "gpt-4o");
    
    // For different file types, we'll use different prompts
    const fileName = filePath.toLowerCase();
    let prompt = "";
    
    if (fileName.endsWith(".pdf")) {
      prompt = "Extract all text content from this resume PDF. Include all sections such as contact information, work experience, education, skills, projects, and any other information present. Format the output as plain text, preserving the structure of the document as much as possible.";
    } else if (fileName.endsWith(".doc") || fileName.endsWith(".docx")) {
      prompt = "Extract all text content from this resume Word document. Include all sections such as contact information, work experience, education, skills, projects, and any other information present. Format the output as plain text, preserving the structure of the document as much as possible.";
    } else {
      prompt = "Extract all text content from this resume document. Include all sections such as contact information, work experience, education, skills, projects, and any other information present. Format the output as plain text, preserving the structure of the document as much as possible.";
    }
    
    formData.append("prompt", prompt);

    // If we can't directly use the Vision API with files, we'll use the chat completions API
    // with base64 encoding of the document
    try {
      // Convert the blob to base64 for OpenAI API
      const reader = new FileReader();
      const base64Promise = new Promise((resolve) => {
        reader.onloadend = () => {
          const base64data = reader.result;
          resolve(base64data);
        };
      });
      reader.readAsDataURL(resumeBlob);
      const base64data = await base64Promise;
      
      // Use the OpenAI API to extract text using GPT-4 model
      const openAIResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are a resume parser. Extract all text from the provided resume document."
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: prompt
                },
                {
                  type: "image_url",
                  image_url: {
                    url: base64data.toString()
                  }
                }
              ]
            }
          ],
          max_tokens: 4096,
        })
      });
      
      if (!openAIResponse.ok) {
        throw new Error(`OpenAI API error: ${await openAIResponse.text()}`);
      }
      
      const aiResult = await openAIResponse.json();
      extractedText = aiResult.choices[0].message.content;
      console.log(`Successfully extracted ${extractedText.length} characters from the resume`);
    } catch (e) {
      console.error("Error extracting text with OpenAI:", e);
      return new Response(JSON.stringify({ error: "Failed to extract text from document", details: e.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 3. Upload the extracted text to parsed-data bucket
    // Create a path that includes the candidate ID for organization
    const parsedFileName = `${candidateId}/${filePath.split('/').pop()}.txt`;
    console.log(`Uploading parsed text to: parsed-data/${parsedFileName}`);
    
    const uploadRes = await fetch(
      `${SUPABASE_URL}/storage/v1/object/parsed-data/${parsedFileName}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "text/plain",
          "Cache-Control": "3600",
        },
        body: extractedText,
      }
    );

    if (!uploadRes.ok) {
      console.error(`Upload failed: ${await uploadRes.text()}`);
      return new Response(JSON.stringify({ error: "Supabase upload to parsed-data bucket failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 4. Return success response with the parsed file path
    return new Response(
      JSON.stringify({ 
        success: true, 
        parsedFilePath: parsedFileName,
        parsedTextLength: extractedText.length,
        candidateId: candidateId,
        message: "Resume successfully parsed and stored"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error(`Unexpected error: ${err.message}`, err.stack);
    return new Response(JSON.stringify({ error: err.message, stack: err.stack }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
