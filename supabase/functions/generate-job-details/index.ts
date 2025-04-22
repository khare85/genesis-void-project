
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
    const { title, company, location, type, department, level, salaryRange } = await req.json()

    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY')
    })

    const prompt = `Generate a detailed job posting for the following position:
    - Job Title: ${title}
    - Company: ${company}
    - Location: ${location}
    - Job Type: ${type}
    - Department: ${department}
    - Experience Level: ${level}
    - Salary Range: ${salaryRange}

    Please provide:
    1. A professional job description
    2. A list of key responsibilities (as an array)
    3. A list of requirements/qualifications (as an array)

    Format the response as a JSON object with these keys:
    {
      "description": "...",
      "responsibilities": ["...", "..."],
      "requirements": ["...", "..."]
    }
    `

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a professional job description writer. Provide detailed, well-structured job descriptions." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    })

    const generatedContent = JSON.parse(completion.choices[0].message.content)

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
