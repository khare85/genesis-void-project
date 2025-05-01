
/**
 * Determines the match category based on a match score
 */
export const getMatchCategory = (score: number): "High Match" | "Medium Match" | "Low Match" | "No Match" => {
  if (score >= 80) return "High Match";
  if (score >= 50) return "Medium Match";
  if (score > 0) return "Low Match";
  return "No Match";
};

/**
 * Extracts match category from screening notes if it exists
 */
export const extractMatchCategory = (notes: string): string | null => {
  if (!notes) return null;
  const match = notes.match(/Match Category: (High Match|Medium Match|Low Match|No Match)/i);
  return match ? match[1] : null;
};

/**
 * Extracts the explanation part from screening notes
 */
export const getScreeningExplanation = (notes: string): string => {
  if (!notes) return "No screening notes available.";
  // Remove the "Match Category: X." prefix if it exists
  return notes.replace(/Match Category: (High|Medium|Low|No) Match\.\s*/i, '').trim();
};
