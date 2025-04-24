
export const parseAIResponse = (openaiData: any) => {
  let matchScore = 50; // Default score
  
  try {
    if (openaiData.choices && openaiData.choices[0].message.content) {
      const scoreText = openaiData.choices[0].message.content.trim();
      console.log('Raw OpenAI response:', scoreText);
      
      const scoreMatch = scoreText.match(/\d+/);
      if (scoreMatch) {
        matchScore = parseInt(scoreMatch[0], 10);
        matchScore = Math.min(100, Math.max(0, matchScore));
      } else {
        console.error('Could not parse a number from OpenAI response:', scoreText);
      }
    }
  } catch (err) {
    console.error('Error parsing OpenAI response:', err);
    console.log('OpenAI response:', JSON.stringify(openaiData));
  }
  
  return matchScore;
};
