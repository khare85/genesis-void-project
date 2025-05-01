
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
import { Share, SlidersHorizontal, ScanSearch, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScreeningCandidate } from "@/types/screening";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const RecruiterScreening = () => {
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
  const [showFilters, setShowFilters] = useState(true);
  const [showScreeningDialog, setShowScreeningDialog] = useState(false);
  
  // State for candidate selection
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [isScreening, setIsScreening] = useState(false);

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
      toast.error("No candidates to screen. Please select at least one candidate.");
      return;
    }

    setCandidatesToScreen(filteredCandidates);
    setShowScreeningDialog(true);
  };

  const onSelectCandidate = (candidate) => {
    setSelectedCandidate(candidate);
  };
  
  const handleSelectCandidateChange = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedCandidates(prev => [...prev, id]);
    } else {
      setSelectedCandidates(prev => prev.filter(candidateId => candidateId !== id));
    }
  };
  
  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedCandidates(filteredCandidates.map(c => c.id.toString()));
    } else {
      setSelectedCandidates([]);
    }
  };
  
  const runAIScreening = async () => {
    if (selectedCandidates.length === 0) {
      toast.error("Please select at least one candidate to screen");
      return;
    }
    
    setIsScreening(true);
    
    try {
      // Process candidates one by one
      for (const candidateId of selectedCandidates) {
        toast.info(`Screening candidate ${candidateId}...`);
        
        const candidate = screeningData.find(c => c.id.toString() === candidateId);
        if (!candidate) continue;
        
        const { data, error } = await supabase.functions.invoke('screen-candidate', {
          body: { 
            candidateId,
            resumeText: candidate.resume || '',
            jobRole: candidate.jobRole || ''
          }
        });
        
        if (error) {
          console.error("Error screening candidate:", error);
          toast.error(`Failed to screen candidate ${candidate.name}: ${error.message}`);
        } else if (data.success) {
          toast.success(`Successfully screened ${candidate.name}`);
          
          // Update local data with screening results
          if (data.screening) {
            const updatedCandidate = {
              ...candidate,
              screeningScore: data.screening.matchScore || 0,
              screeningNotes: JSON.stringify(data.screening)
            };
            
            // Call status change handler to update the candidate
            handleStatusChange(updatedCandidate, "pending");
          }
        } else {
          toast.error(`Failed to screen ${candidate.name}`);
        }
      }
    } catch (err) {
      console.error("AI screening error:", err);
      toast.error("An error occurred during AI screening");
    } finally {
      setIsScreening(false);
      setSelectedCandidates([]);
    }
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
              Batch AI Screening
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={runAIScreening}
              disabled={selectedCandidates.length === 0 || isScreening}
            >
              {isScreening ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <ScanSearch className="h-4 w-4 mr-2" />
              )}
              Screen Selected
            </Button>
          </div>
        }
      />

      {showFilters && (
        <div className="mb-6">
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

      <div>
        <ScreeningTable
          candidates={filteredCandidates}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          onSelectCandidate={onSelectCandidate}
          onStatusChange={handleStatusChange}
          isLoading={screeningData === null}
          selectedCandidates={selectedCandidates}
          onSelectCandidateChange={handleSelectCandidateChange}
        />
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
