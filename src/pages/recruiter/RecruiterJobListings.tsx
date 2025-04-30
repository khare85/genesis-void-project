
import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageHeader from '@/components/shared/PageHeader';
import JobFilters from '@/components/recruiter/JobFilters';
import JobListingsTab from '@/components/recruiter/JobListingsTab';
import { useJobListings } from '@/hooks/recruiter/useJobListings';

const RecruiterJobListings = () => {
  const { 
    jobsData, 
    isLoading, 
    filteredJobs, 
    searchQuery, 
    setSearchQuery, 
    activeTab, 
    setActiveTab, 
    sortBy, 
    setSortBy,
    handleStatusChange,
    handleDuplicateJob
  } = useJobListings();

  const totalJobs = jobsData.length;
  const activeJobs = jobsData.filter(job => job.status === 'active').length;
  const draftJobs = jobsData.filter(job => job.status === 'draft').length;
  const closedJobs = jobsData.filter(job => job.status === 'closed').length;
  
  return (
    <div className="space-y-6">
      <PageHeader
        title="Job Listings"
        description="Manage and monitor all job postings"
        icon={<Briefcase className="h-6 w-6" />}
        actions={
          <Button asChild>
            <Link to="/recruiter/jobs/create">
              <PlusCircle className="h-4 w-4 mr-2" />
              New Job
            </Link>
          </Button>
        }
      />
      
      <JobFilters 
        searchQuery={searchQuery}
        sortBy={sortBy}
        onSearchChange={setSearchQuery}
        onSortChange={setSortBy}
      />
      
      <Card>
        <CardHeader className="pb-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>All Job Listings</CardTitle>
              <CardDescription>
                Showing {filteredJobs.length} of {totalJobs} total jobs
              </CardDescription>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
              <TabsList className="grid grid-cols-3 w-full sm:w-auto">
                <TabsTrigger value="all">All ({totalJobs})</TabsTrigger>
                <TabsTrigger value="active">Active ({activeJobs})</TabsTrigger>
                <TabsTrigger value="draft">Draft ({draftJobs})</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <JobListingsTab 
            isLoading={isLoading}
            jobs={filteredJobs}
            onStatusChange={handleStatusChange}
            onDuplicate={handleDuplicateJob}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default RecruiterJobListings;
