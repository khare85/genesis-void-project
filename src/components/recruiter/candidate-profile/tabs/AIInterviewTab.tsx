
import React, { useState } from 'react';
import { CompleteCandidateProfile } from '@/hooks/recruiter/useCompleteCandidateProfile';
import AIInterviewSession from '@/components/application/AIInterviewSession';
import { ScheduleInterviewModal } from '../ScheduleInterviewModal';

// Import components
import { InterviewHeaderSection } from './interview-components/InterviewHeaderSection';
import { ScheduledInterviewsCard } from './interview-components/ScheduledInterviewsCard';
import { InterviewRecordingCard } from './interview-components/InterviewRecordingCard';
import { AnalysisOverviewCard } from './interview-components/AnalysisOverviewCard';
import { DetailedAnalysisCard } from './interview-components/DetailedAnalysisCard';

// Import hooks and data
import { useInterviews, Interview } from './interview-components/useInterviews';
import { mockAnalysis } from './interview-components/mockAnalysisData';

interface AIInterviewTabProps {
  profile: CompleteCandidateProfile;
}

export const AIInterviewTab: React.FC<AIInterviewTabProps> = ({ profile }) => {
  const [openScheduleModal, setOpenScheduleModal] = useState(false);
  const [showAIInterviewSession, setShowAIInterviewSession] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string>("EVQJtCNSo0L6uHQnImQu"); // Default agent ID
  
  const { interviews, isLoading } = useInterviews(profile.id);

  // Start AI interview function
  const startAIInterview = (interview: Interview) => {
    // Get agent ID from interview metadata if available
    const agentId = interview.metadata?.agentId || selectedAgentId;
    setSelectedAgentId(agentId);
    setShowAIInterviewSession(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <InterviewHeaderSection 
        openScheduleModal={() => setOpenScheduleModal(true)} 
      />
      
      {/* Scheduled Interviews Section */}
      {!isLoading && (
        <ScheduledInterviewsCard
          interviews={interviews}
          onStartInterview={startAIInterview}
        />
      )}
      
      {/* Past interviews with analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Interview Recording Card */}
        <InterviewRecordingCard
          completedOn={mockAnalysis.completedOn}
          duration={mockAnalysis.duration}
          questions={mockAnalysis.questions}
          videoUrl="https://example.com/placeholder-interview.mp4"
          posterImage={profile.avatar}
        />

        {/* AI Analysis Overview Card */}
        <AnalysisOverviewCard
          scores={{
            overallScore: mockAnalysis.overallScore,
            confidence: mockAnalysis.confidence,
            clarity: mockAnalysis.clarity,
            technicalAccuracy: mockAnalysis.technicalAccuracy,
            engagement: mockAnalysis.engagement
          }}
        />
      </div>

      {/* Detailed Analysis Card */}
      <DetailedAnalysisCard
        keyInsights={mockAnalysis.keyInsights}
        skillAssessments={mockAnalysis.skillAssessments}
        interviewSummary={mockAnalysis.interviewSummary}
      />
      
      {/* Modal Components */}
      <ScheduleInterviewModal 
        isOpen={openScheduleModal}
        onClose={() => setOpenScheduleModal(false)}
        candidateId={profile.id}
        candidateName={profile.name}
        candidateEmail={profile.email}
      />

      <AIInterviewSession 
        open={showAIInterviewSession}
        onClose={() => setShowAIInterviewSession(false)}
        agentId={selectedAgentId}
      />
    </div>
  );
};
