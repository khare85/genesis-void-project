
/**
 * Determines the match category based on a match score
 */
export const getMatchCategory = (score: number): "High Match" | "Medium Match" | "Low Match" | "No Match" => {
  if (score >= 80) return "High Match";
  if (score >= 50) return "Medium Match";
  if (score > 0) return "Low Match";
  return "No Match";
};
