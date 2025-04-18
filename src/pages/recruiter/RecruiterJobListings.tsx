
import React, { useState, useEffect } from 'react';
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
import { toast } from '@/hooks/use-toast';
import PageHeader from '@/components/shared/PageHeader';
import JobFilters from '@/components/recruiter/JobFilters';
import JobListingItem, { Job, DbJob } from '@/components/recruiter/JobListingItem';
import JobListingsEmpty from '@/components/recruiter/JobListingsEmpty';
import { supabase } from '@/integrations/supabase/client';
import { useJobListings } from '@/hooks/recruiter/useJobListings';
import JobListingsTab from '@/components/recruiter/JobListingsTab';

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
                Showing {filteredJobs.length} of {jobsData.length} total jobs
              </CardDescription>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
              <TabsList className="grid grid-cols-3 w-full sm:w-auto">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="draft">Draft</TabsTrigger>
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
