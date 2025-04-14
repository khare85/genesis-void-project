import React, { useState } from 'react';
import { FileCheck, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { ScreeningFilters } from "@/components/recruiter/screening/ScreeningFilters";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScreeningTable } from "@/components/recruiter/screening/ScreeningTable";
import { CandidateDetail } from "@/components/recruiter/screening/CandidateDetail";
import { AIScreeningDialog } from "@/components/recruiter/screening/AIScreeningDialog";
import { useToast } from "@/hooks/use-toast";
import { screeningData } from "@/data/screening-data";

// Interface for our screening data
interface ScreeningCandidate {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  status: "pending" | "approved" | "rejected";
  dateApplied: string;
  jobRole: string;
  skills: string[];
  experience: string;
  education: string;
  avatar: string;
  videoIntro: string;
  matchScore: number;
  screeningScore: number;
  screeningNotes: string;
  aiSummary: string;
  reviewTime: number;
  position: string;
}

// AI Screening states
type ScreeningState = 'idle' | 'running' | 'completed' | 'failed';

const RecruiterScreening: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [sortField, setSortField] = useState<keyof ScreeningCandidate | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedCandidate, setSelectedCandidate] = useState<ScreeningCandidate | null>(null);
  const [jobRoleFilter, setJobRoleFilter] = useState<string>("all");
  const [screeningDialogOpen, setScreeningDialogOpen] = useState(false);
  
  // AI Screening states
  const [screeningState, setScreeningState] = useState<ScreeningState>('idle');
  const [screeningProgress, setScreeningProgress] = useState(0);
  const [candidatesToScreen, setCandidatesToScreen] = useState<ScreeningCandidate[]>([]);
  
  // Filter candidates based on search term, status, and job role
  const filteredCandidates = screeningData.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          candidate.skills.join(" ").toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = activeTab === "all" || candidate.status === activeTab;
    
    const matchesJobRole = jobRoleFilter === "all" || candidate.jobRole === jobRoleFilter;
    
    return matchesSearch && matchesStatus && matchesJobRole;
  });

  // Sort candidates
  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    if (!sortField) return 0;
    
    if (sortField === 'screeningScore' || sortField === 'matchScore' || sortField === 'reviewTime') {
      return sortDirection === 'asc' 
        ? a[sortField] - b[sortField]
        : b[sortField] - a[sortField];
    }
    
    // For string fields
    return sortDirection === 'asc'
      ? String(a[sortField]).localeCompare(String(b[sortField]))
      : String(b[sortField]).localeCompare(String(a[sortField]));
  });

  // Handle sorting
  const handleSort = (field: keyof ScreeningCandidate) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Get unique job roles for filtering
  const uniqueJobRoles = Array.from(new Set(screeningData.map(c => c.jobRole)));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Candidate Screening"
        description="Review and screen job applicants"
        icon={<FileCheck className="h-6 w-6" />}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Advanced Filters
            </Button>
            <Button size="sm" onClick={() => setScreeningDialogOpen(true)}>
              <Zap className="mr-2 h-4 w-4" />
              Start AI Screening
            </Button>
          </div>
        }
      />
      
      <Card className="p-6">
        <CardContent className="p-0 space-y-6">
          <ScreeningFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            jobRoleFilter={jobRoleFilter}
            onJobRoleFilterChange={setJobRoleFilter}
            uniqueJobRoles={uniqueJobRoles}
            onClearFilters={() => {
              setSearchTerm("");
              setJobRoleFilter("all");
            }}
          />
          
          <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">
                All
                <Badge variant="secondary" className="ml-2">
                  {getCandidateCountByStatus('all')}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending
                <Badge variant="secondary" className="ml-2">
                  {getCandidateCountByStatus('pending')}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved
                <Badge variant="secondary" className="ml-2">
                  {getCandidateCountByStatus('approved')}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected
                <Badge variant="secondary" className="ml-2">
                  {getCandidateCountByStatus('rejected')}
                </Badge>
              </TabsTrigger>
            </TabsList>
          
            <TabsContent value="all" className="mt-4">
              <ScreeningTable 
                candidates={sortedCandidates} 
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                onSelectCandidate={setSelectedCandidate}
                onStatusChange={handleStatusChange}
              />
            </TabsContent>
            
            <TabsContent value="pending" className="mt-4">
              <ScreeningTable 
                candidates={sortedCandidates} 
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                onSelectCandidate={setSelectedCandidate}
                onStatusChange={handleStatusChange}
              />
            </TabsContent>
            
            <TabsContent value="approved" className="mt-4">
              <ScreeningTable 
                candidates={sortedCandidates} 
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                onSelectCandidate={setSelectedCandidate}
                onStatusChange={handleStatusChange}
              />
            </TabsContent>
            
            <TabsContent value="rejected" className="mt-4">
              <ScreeningTable 
                candidates={sortedCandidates} 
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                onSelectCandidate={setSelectedCandidate}
                onStatusChange={handleStatusChange}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {selectedCandidate && (
        <CandidateDetail 
          candidate={selectedCandidate} 
          onClose={() => setSelectedCandidate(null)} 
          onStatusChange={handleStatusChange}
        />
      )}

      <AIScreeningDialog 
        open={screeningDialogOpen}
        onOpenChange={setScreeningDialogOpen}
        candidatesToScreen={candidatesToScreen}
      />
    </div>
  );
};

export default RecruiterScreening;
