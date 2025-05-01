
import { ScreeningCandidate } from "@/types/screening";

// Extract match category from screening notes if it exists
export const extractMatchCategory = (notes: string): string | null => {
  if (!notes) return null;
  const match = notes.match(/Match Category: (High Match|Medium Match|Low Match|No Match)/i);
  return match ? match[1] : null;
};

// Get displayed match category combining notes and candidate original category
export const getDisplayedMatchCategory = (candidate: ScreeningCandidate): string => {
  const notesMatchCategory = extractMatchCategory(candidate.screeningNotes);
  // Use the extracted match category if available, otherwise use the original matchCategory
  return notesMatchCategory || candidate.matchCategory || 'Unrated';
};

// Extract the explanation part from screening notes (excluding the Match Category prefix)
export const getScreeningExplanation = (notes: string): string => {
  if (!notes) return "No screening notes available.";
  // Remove the "Match Category: X." prefix if it exists
  return notes.replace(/Match Category: (High|Medium|Low|No) Match\.\s*/i, '').trim();
};
