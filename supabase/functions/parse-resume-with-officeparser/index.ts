
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

    // 2. Redirect to the "best method" parser
    // Instead of using officeparser which is problematic in Deno environment, 
    // we'll forward the request to our best parser
    console.log("Forwarding to best method parser");
    
    const bestParserUrl = `${SUPABASE_URL}/functions/v1/parse-resume-with-gemini`;
    const bestParserRes = await fetch(bestParserUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        filePath,
        candidateId,
        jobId: jobId || ''
      })
    });
    
    if (!bestParserRes.ok) {
      console.error(`Best parser failed: ${await bestParserRes.text()}`);
      
      // Try fallback parser
      console.log("Trying fallback parser");
      const fallbackParserUrl = `${SUPABASE_URL}/functions/v1/parse-resume`;
      const fallbackParserRes = await fetch(fallbackParserUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          filePath,
          candidateId,
          jobId: jobId || ''
        })
      });
      
      if (!fallbackParserRes.ok) {
        throw new Error(`All parsers failed. Fallback error: ${await fallbackParserRes.text()}`);
      }
      
      // Return the fallback response
      const fallbackData = await fallbackParserRes.json();
      return new Response(JSON.stringify(fallbackData), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    
    // Return the best method response
    const bestParserData = await bestParserRes.json();
    return new Response(JSON.stringify(bestParserData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (err) {
    console.error(`Unexpected error: ${err.message}`, err.stack);
    return new Response(JSON.stringify({ error: err.message, stack: err.stack }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
