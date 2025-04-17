
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Briefcase, 
  Search, 
  Filter, 
  Plus, 
  Calendar,
  MoreHorizontal,
  ChevronDown,
  PlusCircle,
  Download,
  ArrowUpDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/shared/PageHeader";
import { toast } from "@/hooks/use-toast";

// Mock jobs data
const jobsData = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    department: 'Engineering',
    location: 'San Francisco, CA (Remote)',
    applicants: 48,
    newApplicants: 12,
    postedDate: '2025-03-15',
    status: 'active',
    type: 'Full-time',
    priority: 'high',
  },
  {
    id: 2,
    title: 'Product Manager',
    department: 'Product',
    location: 'New York, NY (Hybrid)',
    applicants: 34,
    newApplicants: 8,
    postedDate: '2025-03-20',
    status: 'active',
    type: 'Full-time',
    priority: 'medium',
  },
  {
    id: 3,
    title: 'UX Designer',
    department: 'Design',
    location: 'Remote',
    applicants: 27,
    newApplicants: 5,
    postedDate: '2025-03-22',
    status: 'active',
    type: 'Full-time',
    priority: 'medium',
  },
  {
    id: 4,
    title: 'DevOps Engineer',
    department: 'Engineering',
    location: 'Austin, TX (On-site)',
    applicants: 19,
    newApplicants: 3,
    postedDate: '2025-03-25',
    status: 'active',
    type: 'Full-time',
    priority: 'low',
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
    priority: 'medium',
  },
  {
    id: 6,
    title: 'Customer Support Specialist',
    department: 'Support',
    location: 'Remote',
    applicants: 42,
    newApplicants: 0,
    postedDate: '2025-03-01',
    status: 'closed',
    type: 'Full-time',
    priority: 'low',
  },
  {
    id: 7,
    title: 'Backend Developer',
    department: 'Engineering',
    location: 'Seattle, WA (Remote)',
    applicants: 36,
    newApplicants: 7,
    postedDate: '2025-03-18',
    status: 'active',
    type: 'Full-time',
    priority: 'high',
  },
  {
    id: 8,
    title: 'Data Analyst (Contract)',
    department: 'Data',
    location: 'Remote',
    applicants: 23,
    newApplicants: 4,
    postedDate: '2025-03-26',
    status: 'active',
    type: 'Contract',
    priority: 'medium',
  }
];

// Priority badge styling
const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "high":
      return <Badge className="bg-red-500 hover:bg-red-600">High</Badge>;
    case "medium":
      return <Badge className="bg-amber-500 hover:bg-amber-600">Medium</Badge>;
    case "low":
      return <Badge className="bg-green-500 hover:bg-green-600">Low</Badge>;
    default:
      return <Badge variant="outline">{priority}</Badge>;
  }
};

// Status badge styling
const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
    case "draft":
      return <Badge variant="outline">Draft</Badge>;
    case "closed":
      return <Badge variant="destructive">Closed</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const ManagerJobListings: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");

  // Filter jobs based on search and filters
  const filteredJobs = jobsData.filter((job) => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    const matchesType = typeFilter === "all" || job.type === typeFilter;
    const matchesDepartment = departmentFilter === "all" || job.department === departmentFilter;
    
    return matchesSearch && matchesStatus && matchesType && matchesDepartment;
  });

  // Unique departments for filter
  const departments = Array.from(new Set(jobsData.map(job => job.department)));
  
  return (
    <div className="space-y-6">
      <PageHeader
        title="Job Listings"
        description="Manage your current job openings and track applications"
        icon={<Briefcase className="h-6 w-6" />}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button size="sm" className="gap-1.5" asChild>
              <Link to="/manager/jobs/create">
                <Plus className="h-4 w-4" />
                Post New Job
              </Link>
            </Button>
          </div>
        }
      />
      
      <Card>
        <CardHeader>
          <CardTitle>All Job Listings</CardTitle>
          <CardDescription>
            Manage and track all your current job postings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex w-full max-w-sm items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search jobs..."
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
                      Status: {statusFilter === "all" ? "All" : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                      All
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                      Active
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("draft")}>
                      Draft
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("closed")}>
                      Closed
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-[180px]">
                    <div className="flex items-center gap-2">
                      <span>Department</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[150px]">
                    <div className="flex items-center gap-2">
                      <span>Job Type</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Position</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      Applicants
                      <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
                    </div>
                  </TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Posted Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">
                        <div>
                          <Link 
                            to={`/manager/jobs/${job.id}/applicants`}
                            className="text-primary hover:underline font-medium"
                          >
                            {job.title}
                          </Link>
                          <p className="text-xs text-muted-foreground mt-0.5">{job.location}</p>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(job.status)}</TableCell>
                      <TableCell>{job.department}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="font-medium">{job.applicants}</span>
                          {job.newApplicants > 0 && (
                            <Badge className="ml-2 bg-primary hover:bg-primary/90">+{job.newApplicants} new</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getPriorityBadge(job.priority)}</TableCell>
                      <TableCell>{new Date(job.postedDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex justify-end">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link to={`/manager/jobs/${job.id}/applicants`}>View Applicants</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link to={`/manager/jobs/${job.id}/edit`}>Edit Job</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => 
                                toast({
                                  title: "Job duplicated",
                                  description: `${job.title} has been duplicated as a draft.`
                                })
                              }>
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => {
                                  if (job.status === 'active') {
                                    toast({
                                      title: "Job posting closed",
                                      description: `${job.title} has been closed and is no longer accepting applications.`
                                    });
                                  } else if (job.status === 'closed') {
                                    toast({
                                      title: "Job reactivated",
                                      description: `${job.title} has been reactivated and is now accepting applications.`
                                    });
                                  }
                                }}
                              >
                                {job.status === 'active' ? 'Close Job' : job.status === 'closed' ? 'Reactivate Job' : 'Publish Job'}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                Delete Job
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      {searchQuery || statusFilter !== "all" || typeFilter !== "all" || departmentFilter !== "all" ? (
                        <div className="flex flex-col items-center justify-center">
                          <p className="mb-2">No jobs match your filters.</p>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSearchQuery("");
                              setStatusFilter("all");
                              setTypeFilter("all");
                              setDepartmentFilter("all");
                            }}
                          >
                            Clear Filters
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center">
                          <Briefcase className="h-10 w-10 text-muted-foreground mb-2" />
                          <p className="mb-2">No jobs found.</p>
                          <Button onClick={() => {}} className="gap-1.5">
                            <PlusCircle className="h-4 w-4" />
                            Create Your First Job
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagerJobListings;
