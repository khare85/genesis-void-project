
import React from 'react';
import { Link } from 'react-router-dom';
import JobListingItem, { Job, DbJob } from './JobListingItem';
import JobListingsEmpty from './JobListingsEmpty';
import { Skeleton } from '@/components/ui/skeleton';
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

interface JobListingsTabProps {
  isLoading: boolean;
  jobs: DbJob[];
  onStatusChange: (job: Job, newStatus: string) => void;
  onDuplicate: (job: Job) => void;
  onDelete?: (job: Job) => void; // Add delete functionality
  isDeleteDialogOpen?: boolean;
  jobToDelete?: Job | null;
  handleDeleteConfirm?: () => void;
  handleDeleteCancel?: () => void;
}

const JobListingsTab: React.FC<JobListingsTabProps> = ({ 
  isLoading, 
  jobs, 
  onStatusChange, 
  onDuplicate,
  onDelete,
  isDeleteDialogOpen = false,
  jobToDelete = null,
  handleDeleteConfirm,
  handleDeleteCancel
}) => {
  // Function to map database job to component job
  const mapToComponentJob = (dbJob: DbJob): Job => ({
    id: dbJob.id,
    title: dbJob.title,
    department: dbJob.department || '',
    location: dbJob.location,
    applicants: dbJob.applicants || 0,
    newApplicants: dbJob.newApplicants || 0,
    postedDate: dbJob.posteddate,
    closingDate: dbJob.closingdate,
    status: dbJob.status,
    type: dbJob.type,
    priority: dbJob.priority || 'medium',
    company: dbJob.company || '' // Add company property to fix the type error
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((index) => (
          <div key={index} className="border rounded-md p-4">
            <Skeleton className="h-6 w-1/3 mb-2" />
            <div className="flex gap-2 mb-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-24" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return <JobListingsEmpty />;
  }

  return (
    <>
      <div className="space-y-4">
        {jobs.map((job) => (
          <JobListingItem
            key={job.id}
            job={mapToComponentJob(job)}
            onStatusChange={onStatusChange}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
          />
        ))}
      </div>
      
      {/* Delete Confirmation Dialog */}
      {handleDeleteConfirm && handleDeleteCancel && (
        <AlertDialog 
          open={isDeleteDialogOpen} 
          onOpenChange={handleDeleteCancel}
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
              <AlertDialogCancel onClick={handleDeleteCancel}>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteConfirm} 
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};

export default JobListingsTab;
