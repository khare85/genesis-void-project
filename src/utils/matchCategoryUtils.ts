
// Get match category from a numeric score
export function getMatchCategory(score: number): 'High Match' | 'Medium Match' | 'Low Match' | 'No Match' {
  if (score >= 85) return 'High Match';
  if (score >= 70) return 'Medium Match';
  if (score >= 50) return 'Low Match';
  return 'No Match';
}

// Extract match category from screening notes
export function extractMatchCategory(notes?: string): string | null {
  if (!notes) return null;
  const match = notes.match(/Match Category: (High Match|Medium Match|Low Match|No Match)/i);
  return match ? match[1] : null;
}

// Get the explanation part from screening notes
export function getScreeningExplanation(notes?: string): string {
  if (!notes) return "No screening notes available.";
  // Remove the "Match Category: X." prefix if it exists
  return notes.replace(/Match Category: (High|Medium|Low|No) Match\.\s*/i, '').trim();
}
