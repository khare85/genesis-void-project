
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, FileText, Filter, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import PageHeader from '@/components/shared/PageHeader';
import { useJobListings } from '@/hooks/recruiter/useJobListings';
import { Badge } from '@/components/ui/badge';

const RecruiterJobListings = () => {
  const { 
    jobsData, 
    isLoading, 
    filteredJobs, 
    searchQuery, 
    setSearchQuery,
    handleStatusChange,
    handleDuplicateJob
  } = useJobListings();
  
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  // Filter jobs based on the selected filters
  const filteredByDepartmentAndType = filteredJobs.filter(job => {
    const matchesDepartment = selectedDepartment === 'All' || job.department === selectedDepartment;
    const matchesType = selectedType === 'All' || job.type === selectedType;
    return matchesDepartment && matchesType;
  });

  // Get unique departments for the filter dropdown
  const departments = ['All', ...new Set(jobsData.map(job => job.department).filter(Boolean))];
  
  // Get unique job types for the filter dropdown
  const jobTypes = ['All', ...new Set(jobsData.map(job => job.type).filter(Boolean))];

  const getStatusBadge = (status) => {
    switch(status) {
      case 'active':
        return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      case 'closed':
        return <Badge variant="destructive">Closed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch(priority) {
      case 'high':
        return <Badge className="bg-red-500 hover:bg-red-600">High</Badge>;
      case 'medium':
        return <Badge className="bg-orange-500 hover:bg-orange-600">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-500 hover:bg-green-600">Low</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  // Convert DbJob to Job before passing to components
  const convertDbJobToJob = (dbJob) => {
    return {
      ...dbJob,
      postedDate: dbJob.posteddate,
      closingDate: dbJob.closingdate,
      newApplicants: dbJob.newApplicants || 0
    };
  };
  
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
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Filters */}
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex gap-2">
                    <Filter className="h-4 w-4" /> 
                    Status: All
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>All</DropdownMenuItem>
                  <DropdownMenuItem>Active</DropdownMenuItem>
                  <DropdownMenuItem>Draft</DropdownMenuItem>
                  <DropdownMenuItem>Closed</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex gap-2">
                    <Filter className="h-4 w-4" />
                    Department
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by Department</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {departments.map((dept, index) => (
                    <DropdownMenuItem 
                      key={index}
                      onClick={() => setSelectedDepartment(dept)}
                    >
                      {dept}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex gap-2">
                    <Filter className="h-4 w-4" />
                    Job Type
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by Job Type</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {jobTypes.map((type, index) => (
                    <DropdownMenuItem 
                      key={index}
                      onClick={() => setSelectedType(type)}
                    >
                      {type}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* Jobs Table */}
          {isLoading ? (
            <div className="text-center py-10">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading jobs...</p>
            </div>
          ) : filteredByDepartmentAndType.length === 0 ? (
            <div className="text-center py-10 border rounded-md">
              <h3 className="text-lg font-medium">No jobs found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
              <Button className="mt-4" asChild>
                <Link to="/recruiter/jobs/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Post New Job
                </Link>
              </Button>
            </div>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Position</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead className="text-center">Applicants</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Posted Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredByDepartmentAndType.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell>
                        <div>
                          <Link 
                            to={`/recruiter/jobs/${job.id}/applicants`} 
                            className="font-medium hover:text-primary hover:underline"
                          >
                            {job.title}
                          </Link>
                          <div className="text-sm text-muted-foreground">{job.location}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(job.status)}</TableCell>
                      <TableCell>{job.department || 'N/A'}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center items-center gap-1">
                          <span>{job.applicants || 0}</span>
                          {job.newApplicants > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              +{job.newApplicants} new
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getPriorityBadge(job.priority || 'medium')}</TableCell>
                      <TableCell>{new Date(job.posteddate).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                              >
                                <circle cx="12" cy="12" r="1" />
                                <circle cx="19" cy="12" r="1" />
                                <circle cx="5" cy="12" r="1" />
                              </svg>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link to={`/recruiter/jobs/${job.id}/applicants`}>
                                View Applicants
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Edit Job</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicateJob(convertDbJobToJob(job))}>
                              Duplicate
                            </DropdownMenuItem>
                            {job.status === 'active' ? (
                              <DropdownMenuItem onClick={() => handleStatusChange(convertDbJobToJob(job), 'closed')}>
                                Deactivate Job
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleStatusChange(convertDbJobToJob(job), 'active')}>
                                Activate Job
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              Delete Job
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RecruiterJobListings;
