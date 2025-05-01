
import React from 'react';
import AIGenerated from "@/components/shared/AIGenerated";
import { getScreeningExplanation } from '@/utils/matchCategoryUtils';

interface CandidateSummaryProps {
  aiSummary?: string;
  screeningNotes?: string;
}

export const CandidateSummary: React.FC<CandidateSummaryProps> = ({
  aiSummary,
  screeningNotes
}) => {
  // Combine AI summary with screening notes
  const getCombinedAISummary = () => {
    const summary = aiSummary || "No AI summary available.";
    const explanation = getScreeningExplanation(screeningNotes);
    
    if (explanation === "No screening notes available.") {
      return summary;
    } else {
      return `${summary}\n\nScreening Notes: ${explanation}`;
    }
  };

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">AI Screening Summary</h4>
      <AIGenerated>
        <p className="text-sm whitespace-pre-line">{getCombinedAISummary()}</p>
      </AIGenerated>
    </div>
  );
};
