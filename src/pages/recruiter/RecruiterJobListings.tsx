
import React, { useState } from 'react';
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

// Extended job data with closing date
const jobsData = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    department: 'Engineering',
    location: 'San Francisco, CA (Remote)',
    applicants: 48,
    newApplicants: 12,
    postedDate: '2025-03-15',
    closingDate: '2025-04-15',
    status: 'active',
    type: 'Full-time',
    priority: 'high'
  },
  {
    id: 2,
    title: 'Product Manager',
    department: 'Product',
    location: 'New York, NY (Hybrid)',
    applicants: 34,
    newApplicants: 8,
    postedDate: '2025-03-20',
    closingDate: '2025-04-20',
    status: 'active',
    type: 'Full-time',
    priority: 'medium'
  },
  {
    id: 3,
    title: 'UX Designer',
    department: 'Design',
    location: 'Remote',
    applicants: 27,
    newApplicants: 5,
    postedDate: '2025-03-22',
    closingDate: '2025-04-22',
    status: 'active',
    type: 'Full-time',
    priority: 'medium'
  },
  {
    id: 4,
    title: 'DevOps Engineer',
    department: 'Engineering',
    location: 'Austin, TX (On-site)',
    applicants: 19,
    newApplicants: 3,
    postedDate: '2025-03-25',
    closingDate: '2025-04-25',
    status: 'active',
    type: 'Full-time',
    priority: 'low'
  },
  {
    id: 5,
    title: 'Marketing Specialist',
    department: 'Marketing',
    location: 'Chicago, IL (Hybrid)',
    applicants: 31,
    newApplicants: 9,
    postedDate: '2025-03-28',
    status: 'draft',
    type: 'Full-time',
    priority: 'medium'
  },
  {
    id: 6,
    title: 'Customer Support Specialist',
    department: 'Support',
    location: 'Remote',
    applicants: 42,
    newApplicants: 0,
    postedDate: '2025-03-01',
    closingDate: '2025-04-01',
    status: 'closed',
    type: 'Full-time',
    priority: 'low'
  },
  {
    id: 7,
    title: 'Backend Developer',
    department: 'Engineering',
    location: 'Seattle, WA (Remote)',
    applicants: 36,
    newApplicants: 7,
    postedDate: '2025-03-18',
    closingDate: '2025-04-18',
    status: 'active',
    type: 'Full-time',
    priority: 'high'
  },
  {
    id: 8,
    title: 'Data Analyst (Contract)',
    department: 'Data',
    location: 'Remote',
    applicants: 23,
    newApplicants: 4,
    postedDate: '2025-03-26',
    closingDate: '2025-05-26',
    status: 'active',
    type: 'Contract',
    priority: 'medium'
  }
];

const RecruiterJobListings = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  
  // Filter jobs based on search query and active tab
  const filteredJobs = jobsData.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'active') return matchesSearch && job.status === 'active';
    if (activeTab === 'draft') return matchesSearch && job.status === 'draft';
    if (activeTab === 'closed') return matchesSearch && job.status === 'closed';
    
    return matchesSearch;
  });
  
  // Sort jobs based on selected option
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
    }
    if (sortBy === 'oldest') {
      return new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime();
    }
    if (sortBy === 'applicants-high') {
      return b.applicants - a.applicants;
    }
    if (sortBy === 'applicants-low') {
      return a.applicants - b.applicants;
    }
    return 0;
  });
  
  // Function to handle job status change
  const handleStatusChange = (job: any, newStatus: string) => {
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
  };
  
  // Function to handle job duplication
  const handleDuplicateJob = (job: any) => {
    toast({
      title: "Job duplicated",
      description: `${job.title} has been duplicated as a draft.`
    });
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
            {sortedJobs.length > 0 ? (
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
