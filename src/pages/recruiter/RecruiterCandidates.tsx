
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Search, Filter, ChevronDown } from "lucide-react";
import { CandidateTable } from "@/components/recruiter/candidates/CandidateTable";
import { FolderManagement } from "@/components/recruiter/candidates/FolderManagement";
import { AIScreeningButton } from "@/components/recruiter/candidates/AIScreeningButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCandidatesData } from "@/hooks/recruiter/useCandidatesData";
import { Skeleton } from "@/components/ui/skeleton";

const RecruiterCandidates: React.FC = () => {
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  
  const { 
    candidates,
    isLoading,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    totalCount
  } = useCandidatesData();
  
  const handleSelectCandidate = (candidateId: string) => {
    setSelectedCandidates(prev => 
      prev.includes(candidateId) 
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedCandidates(checked ? candidates.map(c => c.id) : []);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Candidates"
        description="Manage and review job applicants"
        icon={<Users className="h-6 w-6" />}
        actions={
          <div className="flex gap-2">
            <AIScreeningButton
              selectedCount={selectedCandidates.length}
              onScreen={() => {
                console.log("Starting AI screening for:", selectedCandidates);
                // Implement AI screening logic here
              }}
            />
            <Button asChild>
              <Link to="/recruiter/candidates/add">Add Candidate</Link>
            </Button>
          </div>
        }
      />
      
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-3">
          <FolderManagement
            currentFolder={currentFolder}
            onFolderSelect={setCurrentFolder}
          />
        </div>
        
        <div className="col-span-9">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>All Candidates ({totalCount})</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/recruiter/candidates/export">Export</Link>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search candidates..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Filter className="mr-2 h-4 w-4" />
                        Status: {filter === "all" ? "All" : filter.charAt(0).toUpperCase() + filter.slice(1)}
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuCheckboxItem 
                        checked={filter === "all"} 
                        onCheckedChange={() => setFilter("all")}
                      >
                        All
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem 
                        checked={filter === "new"} 
                        onCheckedChange={() => setFilter("new")}
                      >
                        New
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem 
                        checked={filter === "pending"} 
                        onCheckedChange={() => setFilter("pending")}
                      >
                        Pending
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem 
                        checked={filter === "approved"} 
                        onCheckedChange={() => setFilter("approved")}
                      >
                        Approved
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem 
                        checked={filter === "rejected"} 
                        onCheckedChange={() => setFilter("rejected")}
                      >
                        Rejected
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
              ) : (
                <CandidateTable
                  candidates={candidates}
                  selectedCandidates={selectedCandidates}
                  onSelectCandidate={handleSelectCandidate}
                  onSelectAll={handleSelectAll}
                  currentFolder={currentFolder}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RecruiterCandidates;
