
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ScreeningCandidate } from "@/types/screening";
import { CandidateHeader } from './candidate-detail/CandidateHeader';
import { CandidateContactInfo } from './candidate-detail/CandidateContactInfo';
import { CandidateApplicationDetails } from './candidate-detail/CandidateApplicationDetails';
import { CandidateSkills } from './candidate-detail/CandidateSkills';
import { CandidateVideo } from './candidate-detail/CandidateVideo';
import { CandidateSummary } from './candidate-detail/CandidateSummary';
import { CandidateDetailFooter } from './candidate-detail/CandidateDetailFooter';
import { CandidateHistory } from './candidate-detail/CandidateHistory';
import { getDisplayedMatchCategory } from './candidate-detail/utils';
import { useServices } from '@/hooks/recruiter/screening/useServices';
import { Separator } from "@/components/ui/separator";

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
  const { VideoDialog } = useServices();

  return (
    <Sheet open={true} onOpenChange={open => !open && onClose()}>
      <SheetContent className="sm:max-w-md overflow-y-auto bg-background border-l">
        <SheetHeader className="pb-4">
          <SheetTitle>Candidate Details</SheetTitle>
          <SheetDescription>
            Review candidate information for {candidate.jobRole || 'this position'}
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-6 py-4">
          {/* Candidate Header */}
          <CandidateHeader candidate={candidate} displayedMatchCategory={displayedMatchCategory} />
          
          {/* Contact Information */}
          <CandidateContactInfo candidate={candidate} />
          
          {/* Application Details */}
          <CandidateApplicationDetails candidate={candidate} />
          
          {/* Candidate History */}
          <div className="space-y-2">
            <Separator className="my-4" />
            <CandidateHistory candidateId={candidate.candidate_id} />
          </div>
          
          {/* Skills */}
          <CandidateSkills skills={candidate.skills} />
          
          {/* Video Introduction */}
          <CandidateVideo videoUrl={candidate.videoIntro} posterUrl={candidate.avatar} candidateId={candidate.candidate_id} />
          
          {/* AI Summary with Screening Notes incorporated */}
          <CandidateSummary aiSummary={candidate.aiSummary} screeningNotes={candidate.screeningNotes} />
        </div>
        
        <CandidateDetailFooter candidate={candidate} onClose={onClose} onStatusChange={onStatusChange} />
        
        {/* Video Dialog */}
        <VideoDialog />
      </SheetContent>
    </Sheet>
  );
};
