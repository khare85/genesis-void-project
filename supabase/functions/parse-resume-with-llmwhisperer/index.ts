
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

    // 1. Download the file (resume)
    const resumeUrl = `${SUPABASE_URL}/storage/v1/object/${bucket}/${filePath}`;
    const fileRes = await fetch(resumeUrl, {
      headers: { Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` },
    });
    if (!fileRes.ok) {
      return new Response(JSON.stringify({ error: "Failed to fetch file from storage" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const resumeBlob = await fileRes.blob();

    // 2. Prepare form data for LLMWhisperer
    const form = new FormData();
    form.append("file", resumeBlob, "resume.pdf");
    // Add further LLMWhisperer params if required

    // 3. Send to LLMWhisperer API
    const llmwRes = await fetch("https://api.llmwhisperer.com/v1/parse", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LLMWHISPERER_API_KEY}`,
      },
      body: form,
    });

    if (!llmwRes.ok) {
      const errText = await llmwRes.text();
      return new Response(JSON.stringify({ error: "LLMWhisperer error", details: errText }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const llmwData = await llmwRes.json();

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

    // 4. Upload to parsed-data bucket
    const uploadRes = await fetch(
      `${SUPABASE_URL}/storage/v1/object/parsed-data/${jobId}/parsed.txt`,
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
      return new Response(JSON.stringify({ error: "Supabase upload to parsed-data bucket failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ status: "success", parsed: true, filePath: `${jobId}/parsed.txt` }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
