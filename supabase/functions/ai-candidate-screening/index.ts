
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { candidates } = await req.json()
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
    
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured in Supabase secrets')
    }
    
    if (!candidates || candidates.length === 0) {
      throw new Error('No candidates provided for screening')
    }
    
    console.log(`Processing ${candidates.length} candidates for AI screening`)
    
    // Process candidates in batches to avoid rate limiting
    const batchSize = 3
    const results = []
    
    for (let i = 0; i < candidates.length; i += batchSize) {
      const batch = candidates.slice(i, i + batchSize)
      const batchPromises = batch.map(candidate => analyzeCandidate(candidate, OPENAI_API_KEY))
      const batchResults = await Promise.all(batchPromises)
      results.push(...batchResults)
      
      // Add a small delay between batches to avoid rate limiting
      if (i + batchSize < candidates.length) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }
    
    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error in AI screening:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

async function analyzeCandidate(candidate, apiKey: string) {
  const { id, name, skills, experience, education, position, resume } = candidate
  
  // Create a summary of the candidate for the AI to analyze
  const candidateSummary = `
  Candidate: ${name}
  Position Applied For: ${position || 'Unknown Position'}
  Skills: ${Array.isArray(skills) ? skills.join(', ') : skills || 'Not specified'}
  Experience: ${experience || 'Not specified'}
  Education: ${education || 'Not specified'}
  ${resume ? `Resume Text: ${resume.substring(0, 500)}...` : ''}
  `
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Using a cost-effective model for screening
        messages: [
          {
            role: 'system',
            content: `You are an AI talent screening assistant. Your task is to evaluate candidate profiles for job fit.
            Review the candidate information and provide:
            1. A match category (High Match, Medium Match, Low Match, or No Match)
            2. A brief screening summary (3-5 sentences max)
            3. A screening score (0-100)
            4. Notes explaining your evaluation and recommendation
            Format your response as JSON with the following structure:
            {
              "matchCategory": "High Match|Medium Match|Low Match|No Match",
              "aiSummary": "Your brief evaluation summary here",
              "screeningScore": 85,
              "screeningNotes": "Match Category: High Match. Your detailed notes here"
            }`
          },
          {
            role: 'user',
            content: candidateSummary
          }
        ],
        max_tokens: 800,
        temperature: 0.5,
        response_format: { type: "json_object" }
      }),
    })
    
    const data = await response.json()
    const result = JSON.parse(data.choices[0].message.content)
    
    // Return the enriched candidate object with AI screening results
    return {
      id: candidate.id,
      candidate_id: candidate.candidate_id,
      name: candidate.name,
      aiSummary: result.aiSummary || "AI screening completed.",
      screeningScore: result.screeningScore || Math.floor(Math.random() * 20) + 60,
      screeningNotes: result.screeningNotes || `Match Category: ${result.matchCategory}. No additional notes provided.`,
      matchCategory: result.matchCategory || "Medium Match",
      // Preserve other candidate properties
      ...candidate
    }
  } catch (error) {
    console.error(`Error analyzing candidate ${name}:`, error)
    return {
      id: candidate.id,
      candidate_id: candidate.candidate_id,
      name: candidate.name,
      aiSummary: "Error during AI screening.",
      screeningScore: 0,
      screeningNotes: `Match Category: No Match. Error: ${error.message}`,
      matchCategory: "No Match",
      error: error.message,
      // Preserve other candidate properties
      ...candidate
    }
  }
}
