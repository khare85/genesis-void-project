
import React from 'react';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription
} from "@/components/ui/sheet";
import { ScreeningCandidate } from "@/types/screening";
import { CandidateHeader } from './candidate-detail/CandidateHeader';
import { CandidateContactInfo } from './candidate-detail/CandidateContactInfo';
import { CandidateApplicationDetails } from './candidate-detail/CandidateApplicationDetails';
import { CandidateSkills } from './candidate-detail/CandidateSkills';
import { CandidateVideo } from './candidate-detail/CandidateVideo';
import { CandidateSummary } from './candidate-detail/CandidateSummary';
import { CandidateDetailFooter } from './candidate-detail/CandidateDetailFooter';
import { getDisplayedMatchCategory } from './candidate-detail/utils';

interface CandidateDetailProps {
  candidate: ScreeningCandidate;
  onClose: () => void;
  onStatusChange: (candidate: ScreeningCandidate, status: "approved" | "rejected") => void;
}

export const CandidateDetail: React.FC<CandidateDetailProps> = ({
  candidate,
  onClose,
  onStatusChange
}) => {
  // Get the displayed match category
  const displayedMatchCategory = getDisplayedMatchCategory(candidate);

  return (
    <Sheet open={true} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle>Candidate Details</SheetTitle>
          <SheetDescription>
            Review candidate information and screening results
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-6 py-4">
          {/* Candidate Header */}
          <CandidateHeader 
            candidate={candidate} 
            displayedMatchCategory={displayedMatchCategory} 
          />
          
          {/* Contact Information */}
          <CandidateContactInfo candidate={candidate} />
          
          {/* Application Details */}
          <CandidateApplicationDetails candidate={candidate} />
          
          {/* Skills */}
          <CandidateSkills skills={candidate.skills} />
          
          {/* Video Introduction */}
          <CandidateVideo 
            videoUrl={candidate.videoIntro} 
            posterUrl={candidate.avatar}
          />
          
          {/* AI Summary with Screening Notes incorporated */}
          <CandidateSummary 
            aiSummary={candidate.aiSummary} 
            screeningNotes={candidate.screeningNotes}
          />
        </div>
        
        <CandidateDetailFooter 
          candidate={candidate}
          onClose={onClose}
          onStatusChange={onStatusChange}
        />
      </SheetContent>
    </Sheet>
  );
};
