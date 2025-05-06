
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import * as officeparser from "npm:officeparser@1.1.0";

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
    const resumeUrl = `${SUPABASE_URL}/storage/v1/object/public/resume/${filePath}`;
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
      
      // Check what functions are available on the officeparser object
      console.log("Available methods on officeparser:", Object.keys(officeparser));
      
      // Try using the default export if parseOffice is not directly accessible
      if (typeof officeparser.default === 'function') {
        parsedText = await officeparser.default(fileBuffer);
      } 
      // Try using parse method if it exists
      else if (typeof officeparser.parse === 'function') {
        parsedText = await officeparser.parse(fileBuffer);
      }
      // Try direct function call if the module itself is a function
      else if (typeof officeparser === 'function') {
        parsedText = await officeparser(fileBuffer);
      }
      else {
        throw new Error("Could not find a valid parsing function in the officeparser module");
      }
      
      console.log(`Successfully parsed document, extracted ${parsedText.length} characters`);
      
      if (!parsedText || parsedText.length === 0) {
        throw new Error("No text extracted from document");
      }
    } catch (parseError) {
      console.error("Error parsing document:", parseError);
      return new Response(JSON.stringify({ error: "Failed to parse document", details: parseError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 3. Check if parsed-data bucket exists and create it if needed
    try {
      console.log("Checking if parsed-data bucket exists");
      const checkBucketRes = await fetch(
        `${SUPABASE_URL}/storage/v1/bucket/parsed-data`,
        {
          method: "GET",
          headers: { 
            Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            "Content-Type": "application/json"
          },
        }
      );
      
      if (!checkBucketRes.ok) {
        console.log("Bucket doesn't exist, creating parsed-data bucket");
        const createBucketRes = await fetch(
          `${SUPABASE_URL}/storage/v1/bucket`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: "parsed-data",
              name: "parsed-data",
              public: true, // Making it public for easy access
            }),
          }
        );
        
        if (!createBucketRes.ok) {
          console.error("Failed to create parsed-data bucket:", await createBucketRes.text());
        } else {
          console.log("Successfully created parsed-data bucket");
        }
      } else {
        console.log("parsed-data bucket already exists");
      }
    } catch (bucketError) {
      console.error("Error checking/creating bucket:", bucketError);
      // Continue anyway as the bucket might already exist
    }

    // 4. Upload the parsed text to parsed-data bucket
    // Create a path that includes the candidate ID for organization
    const parsedFileName = jobId 
      ? `${jobId}/${filePath.split('/').pop()}.txt` 
      : `${candidateId}/${filePath.split('/').pop()}.txt`;
      
    console.log(`Uploading parsed text to: parsed-data/${parsedFileName}`);
    
    try {
      const uploadRes = await fetch(
        `${SUPABASE_URL}/storage/v1/object/parsed-data/${parsedFileName}`,
        {
          method: "POST", // Changed from PUT to POST as per Supabase Storage API
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
        
        // Try with PUT method as fallback
        console.log("Trying PUT method as fallback");
        const putRes = await fetch(
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
        
        if (!putRes.ok) {
          console.error(`PUT upload also failed: ${await putRes.text()}`);
          return new Response(JSON.stringify({ error: "Supabase upload to parsed-data bucket failed" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        } else {
          console.log("Upload succeeded with PUT method");
        }
      } else {
        console.log("Upload succeeded with POST method");
      }
    } catch (uploadError) {
      console.error("Error during upload:", uploadError);
      return new Response(JSON.stringify({ error: "Error uploading to parsed-data bucket", details: uploadError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 5. Return success response with the parsed file path
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
