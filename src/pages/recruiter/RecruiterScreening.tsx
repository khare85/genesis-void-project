
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useScreeningData } from "@/hooks/recruiter/useScreeningData";
import { ScreeningTable } from "@/components/recruiter/screening/ScreeningTable";
import { ScreeningFilters } from "@/components/recruiter/screening/ScreeningFilters";
import PageHeader from "@/components/shared/PageHeader";
import { AIScreeningDialog } from "@/components/recruiter/screening/AIScreeningDialog";
import { CandidateDetail } from "@/components/recruiter/screening/CandidateDetail";
import { Share, SlidersHorizontal, ScanSearch } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const RecruiterScreening = () => {
  const { toast } = useToast();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const candidateIdFromQuery = queryParams.get('candidateId');

  const {
    screeningData,
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

  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showScreeningDialog, setShowScreeningDialog] = useState(false);

  // Effect to handle candidate filtering from query parameter
  useEffect(() => {
    if (candidateIdFromQuery && screeningData.length > 0) {
      const candidate = screeningData.find(c => c.id.toString() === candidateIdFromQuery);
      if (candidate) {
        setSelectedCandidate(candidate);
      }
    }
  }, [candidateIdFromQuery, screeningData]);

  const handleScreeningStart = () => {
    if (filteredCandidates.length === 0) {
      toast({
        title: "No candidates to screen",
        description: "Please select at least one candidate.",
        variant: "destructive",
      });
      return;
    }

    setCandidatesToScreen(filteredCandidates);
    setShowScreeningDialog(true);
  };

  const onSelectCandidate = (candidate) => {
    setSelectedCandidate(candidate);
  };

  return (
    <div className="container py-6 space-y-6">
      <PageHeader
        title="Candidate Screening"
        description="Review and manage candidate applications"
        actions={
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {showFilters && (
          <div className="md:col-span-1">
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
          </div>
        )}

        <div className={showFilters ? "md:col-span-3" : "md:col-span-4"}>
          <ScreeningTable
            candidates={filteredCandidates}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            onSelectCandidate={onSelectCandidate}
            onStatusChange={handleStatusChange}
            isLoading={screeningData === null}
          />
        </div>
      </div>

      <AIScreeningDialog
        open={showScreeningDialog}
        onOpenChange={setShowScreeningDialog}
        candidatesToScreen={candidatesToScreen}
        setCandidatesToScreen={setCandidatesToScreen}
        screeningState={screeningState}
        setScreeningState={setScreeningState}
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
