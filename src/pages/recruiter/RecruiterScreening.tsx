import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useScreeningData } from "@/hooks/recruiter/useScreeningData";
import { ScreeningTable } from "@/components/recruiter/screening/ScreeningTable";
import { ScreeningFilters } from "@/components/recruiter/screening/ScreeningFilters";
import PageHeader from "@/components/shared/PageHeader";
import { AIScreeningDialog } from "@/components/recruiter/screening/AIScreeningDialog";
import { CandidateDetail } from "@/components/recruiter/screening/CandidateDetail";
import { Share, ScanSearch, Check } from "lucide-react";
import { toast } from "sonner";
import { ScreeningCandidate } from "@/types/screening";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
    setCandidatesToScreen
  } = useScreeningData();
  const [selectedCandidate, setSelectedCandidate] = useState<ScreeningCandidate | null>(null);
  const [showScreeningDialog, setShowScreeningDialog] = useState(false);
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>([]);

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
    // Choose candidates based on selection or filtered view
    let candidatesToProcess: ScreeningCandidate[];
    if (selectedCandidateIds.length > 0) {
      // Use selected candidates
      candidatesToProcess = filteredCandidates.filter(c => selectedCandidateIds.includes(String(c.id)));
    } else {
      // Use all filtered candidates
      candidatesToProcess = filteredCandidates;
    }
    if (candidatesToProcess.length === 0) {
      toast.error("No candidates to screen. Please select at least one candidate.");
      return;
    }

    // Only include pending candidates that have not been screened yet
    const pendingCandidates = candidatesToProcess.filter(c => c.status === "pending" && (!c.screeningScore || c.screeningScore === 0));
    if (pendingCandidates.length === 0) {
      toast.info("All selected candidates have already been screened.");
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

      // Clear selections after screening
      setSelectedCandidateIds([]);
    }
  };
  const handleSelectCandidateForScreening = (candidateId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedCandidateIds(prev => [...prev, candidateId]);
    } else {
      setSelectedCandidateIds(prev => prev.filter(id => id !== candidateId));
    }
  };
  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      const allIds = filteredCandidates.map(c => String(c.id));
      setSelectedCandidateIds(allIds);
    } else {
      setSelectedCandidateIds([]);
    }
  };
  return <div className="container py-6 space-y-6 bg-white">
      <PageHeader title="Candidate Screening" description="Review and manage candidate applications" actions={<div className="flex items-center space-x-2">
            <Button size="sm" onClick={handleScreeningStart} className="flex items-center gap-2">
              <ScanSearch className="h-4 w-4" />
              {selectedCandidateIds.length > 0 ? <>Screen {selectedCandidateIds.length} Selected</> : <>Start AI Screening</>}
            </Button>
            <Button variant="secondary" size="sm">
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>} />

      <Card>
        <CardHeader className="pb-0">
          <div>
            <h2 className="text-xl font-semibold">All Candidates</h2>
            <p className="text-sm text-muted-foreground">
              Review and screen all candidate applications in one place.
            </p>
          </div>
          
          {/* Filters are now inside the card header */}
          <ScreeningFilters searchTerm={searchTerm} setSearchTerm={setSearchTerm} activeTab={activeTab} setActiveTab={setActiveTab} jobRoleFilter={jobRoleFilter} setJobRoleFilter={setJobRoleFilter} uniqueJobRoles={uniqueJobRoles} getCandidateCountByStatus={getCandidateCountByStatus} />
        </CardHeader>
        
        <CardContent className="pt-6">
          {selectedCandidateIds.length > 0 && <div className="flex justify-between items-center bg-muted/50 p-2 rounded-md mb-4">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>
                {selectedCandidateIds.length} {selectedCandidateIds.length === 1 ? 'candidate' : 'candidates'} selected
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSelectedCandidateIds([])}>
              Clear selection
            </Button>
          </div>}

          <ScreeningTable candidates={filteredCandidates} sortField={sortField} sortDirection={sortDirection} onSort={handleSort} onSelectCandidate={onSelectCandidate} onStatusChange={handleStatusChange} isLoading={screeningData === null} selectedCandidates={selectedCandidateIds} onSelectCandidateForScreening={handleSelectCandidateForScreening} onSelectAll={handleSelectAll} />
        </CardContent>
      </Card>

      <AIScreeningDialog open={showScreeningDialog} onOpenChange={setShowScreeningDialog} candidatesToScreen={candidatesToScreen} setCandidatesToScreen={setCandidatesToScreen} screeningState={screeningState} setScreeningState={setScreeningState} onScreeningComplete={handleScreeningComplete} />

      {selectedCandidate && <CandidateDetail candidate={selectedCandidate} onClose={() => setSelectedCandidate(null)} onStatusChange={handleStatusChange} />}
    </div>;
};
export default RecruiterScreening;