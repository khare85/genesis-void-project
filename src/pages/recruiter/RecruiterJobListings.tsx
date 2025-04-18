
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
import JobListingItem from '@/components/recruiter/JobListingItem';
import JobListingsEmpty from '@/components/recruiter/JobListingsEmpty';
import { supabase } from '@/integrations/supabase/client';

// Job data interface
interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  applicants?: number;
  newApplicants?: number;
  posteddate: string;
  closingdate?: string;
  status: string;
  type: string;
  priority?: string;
}

const RecruiterJobListings = () => {
  const [jobsData, setJobsData] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  
  // Fetch jobs from Supabase
  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .order('posteddate', { ascending: false });
        
        if (error) {
          console.error("Error fetching jobs:", error);
          toast({
            title: "Error fetching jobs",
            description: error.message,
            variant: "destructive"
          });
          return;
        }
        
        // Transform data to include default values for missing fields
        const transformedData = data.map(job => ({
          ...job,
          applicants: 0,  // Default values since we don't have real applicant counts yet
          newApplicants: 0,
          priority: job.priority || 'medium'
        }));
        
        setJobsData(transformedData);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchJobs();
  }, []);
  
  // Filter jobs based on search query and active tab
  const filteredJobs = jobsData.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (job.department || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (job.location || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'active') return matchesSearch && job.status === 'active';
    if (activeTab === 'draft') return matchesSearch && job.status === 'draft';
    if (activeTab === 'closed') return matchesSearch && job.status === 'closed';
    
    return matchesSearch;
  });
  
  // Sort jobs based on selected option
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.posteddate || '').getTime() - new Date(a.posteddate || '').getTime();
    }
    if (sortBy === 'oldest') {
      return new Date(a.posteddate || '').getTime() - new Date(b.posteddate || '').getTime();
    }
    if (sortBy === 'applicants-high') {
      return (b.applicants || 0) - (a.applicants || 0);
    }
    if (sortBy === 'applicants-low') {
      return (a.applicants || 0) - (b.applicants || 0);
    }
    return 0;
  });
  
  // Function to handle job status change
  const handleStatusChange = async (job: Job, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ status: newStatus })
        .eq('id', job.id);
      
      if (error) {
        toast({
          title: "Error updating job status",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      // Update local state
      setJobsData(prevJobs => 
        prevJobs.map(j => j.id === job.id ? { ...j, status: newStatus } : j)
      );
      
      let message = '';
      if (newStatus === 'active') {
        message = `${job.title} has been published and is now accepting applications.`;
      } else if (newStatus === 'closed') {
        message = `${job.title} has been closed and is no longer accepting applications.`;
      }
      
      toast({
        title: `Job ${newStatus === 'active' ? 'published' : 'closed'}`,
        description: message
      });
    } catch (err) {
      console.error("Failed to update job status:", err);
    }
  };
  
  // Function to handle job duplication
  const handleDuplicateJob = async (job: Job) => {
    try {
      // Extract relevant fields from the job to duplicate
      const { id, ...jobToDuplicate } = job;
      
      // Create new job with draft status
      const { data, error } = await supabase
        .from('jobs')
        .insert({
          ...jobToDuplicate,
          title: `${jobToDuplicate.title} (Copy)`,
          status: 'draft',
          posteddate: new Date().toISOString().split('T')[0]
        })
        .select();
      
      if (error) {
        toast({
          title: "Error duplicating job",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      // Update local state
      if (data && data[0]) {
        setJobsData(prevJobs => [
          {
            ...data[0],
            applicants: 0,
            newApplicants: 0,
            priority: job.priority || 'medium'
          },
          ...prevJobs
        ]);
      }
      
      toast({
        title: "Job duplicated",
        description: `${job.title} has been duplicated as a draft.`
      });
    } catch (err) {
      console.error("Failed to duplicate job:", err);
    }
  };
  
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
          <div className="space-y-4">
            {isLoading ? (
              <div className="py-8 text-center text-muted-foreground">Loading job listings...</div>
            ) : sortedJobs.length > 0 ? (
              sortedJobs.map((job) => (
                <JobListingItem
                  key={job.id}
                  job={job}
                  onStatusChange={handleStatusChange}
                  onDuplicate={handleDuplicateJob}
                />
              ))
            ) : (
              <JobListingsEmpty />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecruiterJobListings;
