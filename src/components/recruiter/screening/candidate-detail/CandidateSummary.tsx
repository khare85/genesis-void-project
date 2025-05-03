
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
  // Check if there's actual content in the screening notes or AI summary
  const hasScreeningData = !!screeningNotes || !!aiSummary;
  
  // Combine AI summary with screening notes
  const getCombinedAISummary = () => {
    // If there's no screening data, show "not yet performed"
    if (!hasScreeningData) {
      return "AI screening not yet performed.";
    }
    
    const summary = aiSummary || "";
    const explanation = getScreeningExplanation(screeningNotes);
    
    if (explanation === "No screening notes available." && !summary) {
      return "AI screening not yet performed.";
    } else if (summary && explanation !== "No screening notes available.") {
      return `${summary}\n\nScreening Notes: ${explanation}`;
    } else if (summary) {
      return summary;
    } else {
      return `Screening Notes: ${explanation}`;
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
