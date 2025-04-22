
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { OpenAI } from "https://esm.sh/openai@4.20.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { title, company, department, type, level } = await req.json()
    
    // Validate the required fields
    const missingFields = [];
    if (!title) missingFields.push('title');
    if (!company) missingFields.push('company');
    if (!department) missingFields.push('department');
    if (!type) missingFields.push('type');
    if (!level) missingFields.push('level');
    
    if (missingFields.length > 0) {
      console.error("Missing required fields:", missingFields);
      return new Response(
        JSON.stringify({ 
          error: `Missing required fields: ${missingFields.join(', ')}` 
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    console.log("Generating job details for:", { title, company, department, type, level });

    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY')
    })

    const prompt = `Generate a detailed job posting for the following position:
    - Job Title: ${title}
    - Company: ${company}
    - Department: ${department}
    - Job Type: ${type}
    - Experience Level: ${level}

    Please provide:
    1. A professional job description (2-3 paragraphs)
    2. A list of 5-7 key responsibilities
    3. A list of 5-7 requirements/qualifications
    4. A list of 5-10 relevant technical and soft skills for this role

    Format the response as a JSON object with these keys:
    {
      "description": "...",
      "responsibilities": ["...", "..."],
      "requirements": ["...", "..."],
      "skills": "skill1, skill2, skill3"
    }
    `

    console.log("Sending request to OpenAI");
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a professional job description writer. Provide detailed, well-structured job descriptions." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    })

    const content = completion.choices[0].message.content;
    console.log("OpenAI response received");

    const generatedContent = JSON.parse(content);

    return new Response(
      JSON.stringify(generatedContent),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
