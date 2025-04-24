
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS headers for browser access
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const LLMWHISPERER_API_KEY = Deno.env.get('LLMWHISPERER_API_KEY');

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { filePath, bucket, jobId } = await req.json();
    if (!filePath || !bucket || !jobId) {
      return new Response(JSON.stringify({ error: "Missing required params" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Processing resume: ${filePath} in bucket: ${bucket} for job: ${jobId}`);

    // 1. Download the file (resume)
    const resumeUrl = `${SUPABASE_URL}/storage/v1/object/${bucket}/${filePath}`;
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

    // 2. Prepare form data for LLMWhisperer
    const form = new FormData();
    form.append("file", resumeBlob, "resume.pdf");
    console.log("Form data prepared for LLMWhisperer");

    // 3. Send to LLMWhisperer API
    console.log("Sending to LLMWhisperer API...");
    const llmwRes = await fetch("https://api.llmwhisperer.com/v1/parse", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LLMWHISPERER_API_KEY}`,
      },
      body: form,
    });

    if (!llmwRes.ok) {
      const errText = await llmwRes.text();
      console.error(`LLMWhisperer error: ${errText}`);
      return new Response(JSON.stringify({ error: "LLMWhisperer error", details: errText }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    const llmwData = await llmwRes.json();
    console.log("Received response from LLMWhisperer");

    let parsedText = "";
    if (typeof llmwData.text === "string") {
      parsedText = llmwData.text;
    } else if (llmwData.result) {
      parsedText = typeof llmwData.result === "string"
        ? llmwData.result
        : JSON.stringify(llmwData.result, null, 2);
    } else {
      parsedText = JSON.stringify(llmwData, null, 2);
    }

    console.log(`Parsed text extracted, length: ${parsedText.length} characters`);

    // Make sure we have a storage bucket for parsed data
    try {
      // Create parsed-data bucket if it doesn't exist (first attempt)
      const checkBucketRes = await fetch(
        `${SUPABASE_URL}/storage/v1/bucket/parsed-data`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          },
        }
      );

      if (!checkBucketRes.ok && checkBucketRes.status === 404) {
        console.log("Creating parsed-data bucket as it doesn't exist");
        await fetch(
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
              public: false,
            }),
          }
        );
      }
    } catch (bucketError) {
      console.error("Error checking/creating bucket:", bucketError);
      // Continue anyway, bucket might already exist
    }

    // 4. Upload to parsed-data bucket
    console.log(`Uploading parsed text to bucket: parsed-data/${jobId}/${filePath.split('/').pop()}.txt`);
    const uploadRes = await fetch(
      `${SUPABASE_URL}/storage/v1/object/parsed-data/${jobId}/${filePath.split('/').pop()}.txt`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "text/plain",
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

    console.log("Successfully uploaded parsed resume text");
    return new Response(
      JSON.stringify({ 
        status: "success", 
        parsed: true, 
        filePath: `${jobId}/${filePath.split('/').pop()}.txt`,
        textLength: parsedText.length
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error(`Unexpected error: ${err.message}`);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
