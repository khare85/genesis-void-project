
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useScreeningData } from "@/hooks/recruiter/useScreeningData";
import { ScreeningTable } from "@/components/recruiter/screening/ScreeningTable";
import { ScreeningFilters } from "@/components/recruiter/screening/ScreeningFilters";
import PageHeader from "@/components/shared/PageHeader";
import { AIScreeningDialog } from "@/components/recruiter/screening/AIScreeningDialog";
import { CandidateDetail } from "@/components/recruiter/screening/CandidateDetail";
import { Share, ScanSearch } from "lucide-react";
import { toast } from "sonner";
import { ScreeningCandidate } from "@/types/screening";

const RecruiterScreening = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const candidateIdFromQuery = queryParams.get('candidateId');

  const {
    screeningData,
    setScreeningData,
    filteredCandidates,
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    sortField,
    sortDirection,
    handleSort,
    jobRoleFilter,
    setJobRoleFilter,
    uniqueJobRoles,
    handleStatusChange,
    getCandidateCountByStatus,
    screeningState,
    setScreeningState,
    candidatesToScreen,
    setCandidatesToScreen,
  } = useScreeningData();

  const [selectedCandidate, setSelectedCandidate] = useState<ScreeningCandidate | null>(null);
  const [showScreeningDialog, setShowScreeningDialog] = useState(false);

  // Effect to handle candidate filtering from query parameter
  useEffect(() => {
    if (candidateIdFromQuery && screeningData && screeningData.length > 0) {
      const candidate = screeningData.find(c => c.id.toString() === candidateIdFromQuery);
      if (candidate) {
        setSelectedCandidate(candidate);
      }
    }
  }, [candidateIdFromQuery, screeningData]);

  const handleScreeningStart = () => {
    if (filteredCandidates.length === 0) {
      toast.error("No candidates to screen. Please select at least one candidate.");
      return;
    }

    // Only include pending candidates that have not been screened yet
    const pendingCandidates = filteredCandidates.filter(c => 
      c.status === "pending" && (!c.screeningScore || c.screeningScore === 0)
    );
    
    if (pendingCandidates.length === 0) {
      toast.info("All visible candidates have already been screened.");
      return;
    }

    setCandidatesToScreen(pendingCandidates);
    setShowScreeningDialog(true);
  };

  const onSelectCandidate = (candidate: ScreeningCandidate) => {
    setSelectedCandidate(candidate);
  };

  const handleScreeningComplete = (screenedCandidates: ScreeningCandidate[]) => {
    // Update the screening data with the screened candidates
    if (screenedCandidates && screenedCandidates.length > 0) {
      setScreeningData(prevData => {
        if (!prevData) return screenedCandidates;
        
        // Create a new array with updated candidates
        return prevData.map(candidate => {
          const screenedCandidate = screenedCandidates.find(c => c.id === candidate.id);
          return screenedCandidate || candidate;
        });
      });
    }
  };

  return (
    <div className="container py-6 space-y-6">
      <PageHeader
        title="Candidate Screening"
        description="Review and manage candidate applications"
        actions={
          <div className="flex items-center space-x-2">
            <Button size="sm" onClick={handleScreeningStart}>
              <ScanSearch className="h-4 w-4 mr-2" />
              Start AI Screening
            </Button>
            <Button variant="secondary" size="sm">
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        }
      />

      {/* Filters are now always at the top */}
      <ScreeningFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        jobRoleFilter={jobRoleFilter}
        setJobRoleFilter={setJobRoleFilter}
        uniqueJobRoles={uniqueJobRoles}
        getCandidateCountByStatus={getCandidateCountByStatus}
      />

      <ScreeningTable
        candidates={filteredCandidates}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        onSelectCandidate={onSelectCandidate}
        onStatusChange={handleStatusChange}
        isLoading={screeningData === null}
      />

      <AIScreeningDialog
        open={showScreeningDialog}
        onOpenChange={setShowScreeningDialog}
        candidatesToScreen={candidatesToScreen}
        setCandidatesToScreen={setCandidatesToScreen}
        screeningState={screeningState}
        setScreeningState={setScreeningState}
        onScreeningComplete={handleScreeningComplete}
      />

      {selectedCandidate && (
        <CandidateDetail
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

export default RecruiterScreening;
