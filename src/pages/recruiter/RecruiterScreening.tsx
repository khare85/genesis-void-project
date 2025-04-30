
import React, { useState } from 'react';
import { FileCheck, Zap, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScreeningFilters } from "@/components/recruiter/screening/ScreeningFilters";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScreeningTable } from "@/components/recruiter/screening/ScreeningTable";
import { CandidateDetail } from "@/components/recruiter/screening/CandidateDetail";
import { AIScreeningDialog } from "@/components/recruiter/screening/AIScreeningDialog";
import { ScreeningCandidate } from "@/types/screening";
import { useScreeningData } from '@/hooks/recruiter/useScreeningData';

const RecruiterScreening: React.FC = () => {
  const [selectedCandidate, setSelectedCandidate] = useState<ScreeningCandidate | null>(null);
  const [screeningDialogOpen, setScreeningDialogOpen] = useState(false);
  
  const {
    isLoading,
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
    candidatesToScreen,
    setCandidatesToScreen
  } = useScreeningData();

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
                candidates={filteredCandidates} 
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                onSelectCandidate={setSelectedCandidate}
                onStatusChange={handleStatusChange}
                isLoading={isLoading}
              />
            </TabsContent>
            
            <TabsContent value="pending" className="mt-4">
              <ScreeningTable 
                candidates={filteredCandidates} 
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                onSelectCandidate={setSelectedCandidate}
                onStatusChange={handleStatusChange}
                isLoading={isLoading}
              />
            </TabsContent>
            
            <TabsContent value="approved" className="mt-4">
              <ScreeningTable 
                candidates={filteredCandidates} 
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                onSelectCandidate={setSelectedCandidate}
                onStatusChange={handleStatusChange}
                isLoading={isLoading}
              />
            </TabsContent>
            
            <TabsContent value="rejected" className="mt-4">
              <ScreeningTable 
                candidates={filteredCandidates} 
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                onSelectCandidate={setSelectedCandidate}
                onStatusChange={handleStatusChange}
                isLoading={isLoading}
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
