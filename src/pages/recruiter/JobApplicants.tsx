
import React from "react";
import { Link, useParams } from "react-router-dom";
import { Briefcase, ChevronLeft, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "@/components/shared/PageHeader";
import { useJobApplicantsData } from "@/hooks/recruiter/useJobApplicantsData";
import { ApplicantFilters } from "@/components/recruiter/applicants/ApplicantFilters";
import { JobInfo } from "@/components/recruiter/applicants/JobInfo";
import { ApplicantViewSwitcher } from "@/components/recruiter/applicants/ApplicantViewSwitcher";

const JobApplicants: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  const { 
    job,
    applicants: sortedApplicants,
    isLoading,
    error,
    totalCount,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy
  } = useJobApplicantsData(id);
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48" />
              <div className="space-y-2 pt-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
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
            <Button asChild>
              <Link to="/recruiter/jobs">Back to Jobs</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <PageHeader
        title={`Applicants: ${job.title}`}
        description={`${totalCount} applicants for this position`}
        icon={<Users className="h-6 w-6" />}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/recruiter/jobs">
                <ChevronLeft className="h-4 w-4 mr-1" /> Back to Jobs
              </Link>
            </Button>
            <Button>
              Email All
            </Button>
          </div>
        }
      />
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>All Applicants</CardTitle>
              <CardDescription>
                {job.title} - {job.department} - {job.location}
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to={`/recruiter/jobs/${job.id}/edit`}>Edit Job</Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <JobInfo job={job} />
          
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
          
          <ApplicantViewSwitcher applicants={sortedApplicants} />
        </CardContent>
      </Card>
    </div>
  );
};

export default JobApplicants;
