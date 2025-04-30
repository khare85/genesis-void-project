
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { officeParser } from "npm:officeparser@1.1.0";

// CORS headers for browser access
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

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

    console.log(`Processing file: ${filePath} for candidate: ${candidateId}`);

    // 1. Download the file from the resume bucket
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
    
    const fileArrayBuffer = await fileRes.arrayBuffer();
    const fileBuffer = new Uint8Array(fileArrayBuffer);
    console.log(`File downloaded, size: ${fileBuffer.length} bytes`);

    // 2. Parse the document using officeparser
    let parsedText = "";
    try {
      // Get file extension to determine parsing approach
      const fileExtension = filePath.toLowerCase().split('.').pop();
      
      // Parse the document
      console.log(`Parsing file with extension: ${fileExtension}`);
      parsedText = await officeParser.parseOffice(fileBuffer);
      
      console.log(`Successfully parsed document, extracted ${parsedText.length} characters`);
    } catch (parseError) {
      console.error("Error parsing document:", parseError);
      return new Response(JSON.stringify({ error: "Failed to parse document", details: parseError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 3. Upload the parsed text to parsed-data bucket
    // Create a path that includes the candidate ID for organization
    const parsedFileName = jobId 
      ? `${jobId}/${filePath.split('/').pop()}.txt` 
      : `${candidateId}/${filePath.split('/').pop()}.txt`;
      
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
        body: parsedText,
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
        parsedTextLength: parsedText.length,
        candidateId: candidateId,
        jobId: jobId || null,
        message: "Resume successfully parsed and stored using officeparser"
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
