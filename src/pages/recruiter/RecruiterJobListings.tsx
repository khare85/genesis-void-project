
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import PageHeader from '@/components/shared/PageHeader';
import { useJobListings } from '@/hooks/recruiter/useJobListings';
import JobListingsFilters from '@/components/recruiter/jobs/JobListingsFilters';
import JobListingsTable from '@/components/recruiter/jobs/JobListingsTable';
import JobListingsCardView from '@/components/recruiter/jobs/JobListingsCardView';

const RecruiterJobListings = () => {
  const { 
    jobsData, 
    isLoading, 
    filteredJobs, 
    searchQuery, 
    setSearchQuery,
    view,
    setView,
    handleStatusChange,
    handleDuplicateJob,
    confirmDelete,
    handleDeleteJob,
    cancelDelete,
    isDeleteDialogOpen,
    jobToDelete
  } = useJobListings();
  
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  // Filter jobs based on the selected filters
  const filteredByCompanyAndType = filteredJobs.filter(job => {
    const matchesCompany = selectedCompany === 'All' || job.company === selectedCompany;
    const matchesType = selectedType === 'All' || job.type === selectedType;
    return matchesCompany && matchesType;
  });

  // Get unique companies for the filter dropdown
  const companies = ['All', ...new Set(jobsData.map(job => job.company).filter(Boolean))];
  
  // Get unique job types for the filter dropdown
  const jobTypes = ['All', ...new Set(jobsData.map(job => job.type).filter(Boolean))];
  
  return (
    <div className="space-y-6">
      <PageHeader
        title="Job Listings"
        description="Manage your current job openings and track applications"
        icon={<Briefcase className="h-6 w-6" />}
        actions={
          <div className="flex gap-2">
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button asChild>
              <Link to="/recruiter/jobs/create">
                <Plus className="h-4 w-4 mr-2" />
                Post New Job
              </Link>
            </Button>
          </div>
        }
      />
      
      <Card>
        <CardHeader className="pb-0">
          <div>
            <h2 className="text-xl font-bold">All Job Listings</h2>
            <p className="text-sm text-muted-foreground">
              Manage and track all your current job postings
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          {/* Search and filters */}
          <JobListingsFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCompany={selectedCompany}
            setSelectedCompany={setSelectedCompany}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            companies={companies}
            jobTypes={jobTypes}
            view={view}
            onViewChange={setView}
          />
          
          {/* Jobs View (Table or Cards) */}
          {view === 'table' ? (
            <JobListingsTable
              jobs={filteredByCompanyAndType}
              isLoading={isLoading}
              onStatusChange={handleStatusChange}
              onDuplicateJob={handleDuplicateJob}
              onDeleteJob={confirmDelete}
            />
          ) : (
            <JobListingsCardView
              jobs={filteredByCompanyAndType}
              isLoading={isLoading}
              onStatusChange={handleStatusChange}
              onDuplicateJob={handleDuplicateJob}
              onDeleteJob={confirmDelete}
            />
          )}
        </CardContent>
      </Card>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={isDeleteDialogOpen} 
        onOpenChange={cancelDelete}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this job?</AlertDialogTitle>
            <AlertDialogDescription>
              {jobToDelete && (
                <>
                  You are about to delete "{jobToDelete.title}". This action cannot be undone and will permanently 
                  remove this job listing and all associated applications.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteJob} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RecruiterJobListings;
