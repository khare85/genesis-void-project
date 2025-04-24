
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
    const requestData = await req.json();
    const { title, company, department, type, level } = requestData;
    
    console.log("Request data received:", requestData);
    
    // Validate only the essential required fields: title and company
    const missingFields = [];
    if (!title) missingFields.push('title');
    if (!company) missingFields.push('company');
    
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

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: "OPENAI_API_KEY is not set in environment variables" }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const openai = new OpenAI({
      apiKey: openaiApiKey
    })

    // Construct the prompt to explicitly request bullet-point formatting
    let prompt = `Generate a detailed job posting for the following position:
    - Job Title: ${title}
    - Company: ${company}`;
    
    // Add optional fields if available
    if (department) prompt += `\n    - Department: ${department}`;
    if (type) prompt += `\n    - Job Type: ${type}`;
    if (level) prompt += `\n    - Experience Level: ${level}`;
    
    prompt += `\n
    Please provide:
    1. A professional job description (2-3 paragraphs)
    2. A list of 5-7 responsibilities, each starting with a • bullet point
    3. A list of 5-7 requirements/qualifications, each starting with a • bullet point
    4. A list of 5-10 relevant technical and soft skills for this role

    Format the response as a JSON object with these keys:
    {
      "description": "...",
      "responsibilities": ["• Responsibility 1", "• Responsibility 2", ...],
      "requirements": ["• Requirement 1", "• Requirement 2", ...],
      "skills": "skill1, skill2, skill3"
    }
    `;

    console.log("Sending request to OpenAI");
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a professional job description writer. Provide detailed, well-structured job descriptions with bullet points." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    })

    const content = completion.choices[0].message.content;
    console.log("OpenAI response received");

    try {
      const generatedContent = JSON.parse(content);
      
      // Ensure responsibilities and requirements start with • if they don't already
      generatedContent.responsibilities = generatedContent.responsibilities.map(resp => 
        resp.startsWith('•') ? resp : `• ${resp}`
      );
      generatedContent.requirements = generatedContent.requirements.map(req => 
        req.startsWith('•') ? req : `• ${req}`
      );

      console.log("Successfully parsed and formatted OpenAI response");

      return new Response(
        JSON.stringify(generatedContent),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError);
      console.log("Raw content from OpenAI:", content);
      
      return new Response(
        JSON.stringify({ 
          error: "Failed to parse the AI-generated content", 
          details: parseError.message 
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
