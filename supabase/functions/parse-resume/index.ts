
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS headers for browser access
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const LLMWHISPERER_API_KEY = Deno.env.get('LLMWHISPERER_API_KEY');

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !LLMWHISPERER_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Missing environment variables" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { filePath, bucket, jobId, applicationId } = await req.json();
    
    if (!filePath || !bucket || !jobId) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Processing resume at ${bucket}/${filePath} for job ${jobId}`);

    // 1. Download the resume from storage
    const resumeUrl = `${SUPABASE_URL}/storage/v1/object/${bucket}/${filePath}`;
    const fileRes = await fetch(resumeUrl, {
      headers: { Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` },
    });

    if (!fileRes.ok) {
      console.error("Failed to fetch file:", await fileRes.text());
      return new Response(
        JSON.stringify({ error: "Failed to fetch file from storage" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const resumeBlob = await fileRes.blob();

    // 2. Prepare form data for LLMWhisperer
    const form = new FormData();
    form.append("file", resumeBlob, "resume.pdf");

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
      console.error("LLMWhisperer API error:", errText);
      return new Response(
        JSON.stringify({ error: "LLMWhisperer error", details: errText }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const llmwData = await llmwRes.json();
    console.log("LLMWhisperer response received", Object.keys(llmwData));

    // Format the parsed data
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

    // 4. Upload parsed data to the parsed-data bucket
    console.log(`Uploading parsed data to parsed-data/${jobId}/parsed_${applicationId || 'resume'}.txt`);
    const parsedPath = `${jobId}/parsed_${applicationId || 'resume'}.txt`;
    const uploadRes = await fetch(
      `${SUPABASE_URL}/storage/v1/object/parsed-data/${parsedPath}`,
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
      console.error("Upload error:", await uploadRes.text());
      return new Response(
        JSON.stringify({ error: "Failed to upload parsed data" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 5. Update the application record with screening score if applicationId is provided
    if (applicationId) {
      // Calculate a simple screening score based on content length (demo purpose)
      // In a real app, this would be a more sophisticated algorithm
      const screeningScore = Math.min(Math.floor(parsedText.length / 100), 100);
      
      const updateRes = await fetch(
        `${SUPABASE_URL}/rest/v1/applications?id=eq.${applicationId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            "Content-Type": "application/json",
            "Prefer": "return=minimal",
          },
          body: JSON.stringify({
            screening_score: screeningScore
          }),
        }
      );

      if (!updateRes.ok) {
        console.error("Failed to update application:", await updateRes.text());
      } else {
        console.log(`Updated application ${applicationId} with screening score ${screeningScore}`);
      }
    }

    return new Response(
      JSON.stringify({ 
        status: "success", 
        parsed: true, 
        filePath: parsedPath,
        url: `${SUPABASE_URL}/storage/v1/object/public/parsed-data/${parsedPath}`
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error in parse-resume function:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
