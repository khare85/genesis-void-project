
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Briefcase, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Import refactored components
import { useJobApplicants } from "@/hooks/recruiter/useJobApplicants";
import ApplicantFilters from "@/components/recruiter/applicants/ApplicantFilters";
import ApplicantTable from "@/components/recruiter/applicants/ApplicantTable";
import ApplicantGrid from "@/components/recruiter/applicants/ApplicantGrid";
import JobHeader from "@/components/recruiter/applicants/JobHeader";
import JobDescription from "@/components/recruiter/applicants/JobDescription";

const JobApplicants: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const { job, applicants, isLoading, isLoadingApplicants } = useJobApplicants(id);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");
  
  // Filter applicants based on search and filters
  const filteredApplicants = applicants.filter((applicant) => {
    const matchesSearch = 
      applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (applicant.position && applicant.position.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (filter === "all") return matchesSearch;
    return matchesSearch && applicant.status === filter;
  });
  
  // Sort applicants
  const sortedApplicants = [...filteredApplicants].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime();
      case "oldest":
        return new Date(a.applicationDate).getTime() - new Date(b.applicationDate).getTime();
      case "match-high":
        return (b.matchScore || 0) - (a.matchScore || 0);
      case "match-low":
        return (a.matchScore || 0) - (b.matchScore || 0);
      default:
        return 0;
    }
  });
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!job) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <Briefcase className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-medium mb-2">Job not found</h3>
            <p className="text-muted-foreground mb-4">The job you're looking for doesn't exist.</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <JobHeader job={job} />
      
      <Card>
        <JobDescription job={job} />
        
        <CardContent>
          <div className="mb-6 space-y-4">
            <ApplicantFilters 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filter={filter}
              setFilter={setFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          </div>
          
          <Tabs defaultValue="table" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="table">Table View</TabsTrigger>
              <TabsTrigger value="grid">Card View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="table" className="space-y-4">
              {isLoadingApplicants ? (
                <div className="flex justify-center items-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <ApplicantTable 
                  applicants={sortedApplicants} 
                  isLoading={isLoadingApplicants} 
                />
              )}
            </TabsContent>
            
            <TabsContent value="grid">
              {isLoadingApplicants ? (
                <div className="flex justify-center items-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <ApplicantGrid 
                  applicants={sortedApplicants} 
                  isLoading={isLoadingApplicants} 
                />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobApplicants;
