
import React, { useState, useEffect } from "react";
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
import { useFetchJobsByManager } from "@/hooks/recruiter/job-listings/useFetchJobsByManager";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
  const { jobsData: originalJobsData, isLoading, refreshJobs } = useFetchJobsByManager();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<any>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Apply filters whenever search, status, type or department filter changes
  useEffect(() => {
    if (!originalJobsData || originalJobsData.length === 0) {
      setFilteredJobs([]);
      return;
    }
    
    const filtered = originalJobsData.filter((job) => {
      const matchesSearch = 
        (job.title?.toLowerCase().includes(searchQuery.toLowerCase()) || false) || 
        (job.department?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
        (job.location?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
      
      const matchesStatus = statusFilter === "all" || job.status === statusFilter;
      const matchesType = typeFilter === "all" || job.type === typeFilter;
      const matchesDepartment = departmentFilter === "all" || job.department === departmentFilter;
      
      return matchesSearch && matchesStatus && matchesType && matchesDepartment;
    });
    
    setFilteredJobs(filtered);
  }, [originalJobsData, searchQuery, statusFilter, typeFilter, departmentFilter]);

  // Handle job status change
  const handleStatusChange = (jobId: string, newStatus: string) => {
    // In a real app, we would update the job status in the database
    // For now, just show a toast message
    
    toast({
      title: `Job ${newStatus === 'active' ? 'activated' : newStatus === 'closed' ? 'closed' : 'saved as draft'}`,
      description: `The job status has been updated to ${newStatus}.`
    });
    
    // Refresh jobs after status change
    refreshJobs();
  };
  
  // Handle job duplication
  const handleDuplicateJob = (job: any) => {
    toast({
      title: "Job duplicated",
      description: `${job.title} has been duplicated as a draft.`
    });
    
    // In a real app, this would create a new job in the database
    refreshJobs();
  };
  
  // Handle job deletion dialog
  const confirmDelete = (job: any) => {
    setJobToDelete(job);
    setIsDeleteDialogOpen(true);
  };
  
  // Handle job deletion
  const handleDeleteJob = () => {
    if (!jobToDelete) return;
    
    // In a real app, this would delete the job from the database
    toast({
      title: "Job deleted",
      description: `${jobToDelete.title} has been deleted.`
    });
    
    setIsDeleteDialogOpen(false);
    setJobToDelete(null);
    refreshJobs();
  };
  
  // Handle export
  const handleExport = () => {
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      toast({
        title: "Jobs exported",
        description: "Your job listings have been exported as CSV."
      });
    }, 1500);
  };

  // Unique departments for filter - extract from job data
  const departments = Array.from(new Set(
    originalJobsData
      .filter(job => job.department)
      .map(job => job.department)
  ));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Job Listings"
        description="Manage your current job openings and track applications"
        icon={<Briefcase className="h-6 w-6" />}
        actions={
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1.5"
              onClick={handleExport}
              disabled={isExporting}
            >
              <Download className="h-4 w-4" />
              {isExporting ? "Exporting..." : "Export"}
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
          
          {isLoading ? (
            // Loading state
            <div className="space-y-4">
              <div className="h-8 w-full bg-muted/50 rounded-md animate-pulse"></div>
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-16 w-full bg-muted/30 rounded-md animate-pulse"></div>
              ))}
            </div>
          ) : (
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
                            <p className="text-xs text-muted-foreground mt-0.5">{job.location || 'Remote'}</p>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(job.status || 'active')}</TableCell>
                        <TableCell>{job.department || 'Engineering'}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className="font-medium">{job.applicants || 0}</span>
                            {(job.newApplicants || 0) > 0 && (
                              <Badge className="ml-2 bg-primary hover:bg-primary/90">+{job.newApplicants} new</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getPriorityBadge(job.priority || 'medium')}</TableCell>
                        <TableCell>{new Date(job.created_at || Date.now()).toLocaleDateString()}</TableCell>
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
                                <DropdownMenuItem onClick={() => handleDuplicateJob(job)}>
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => {
                                    if (job.status === 'active') {
                                      handleStatusChange(job.id, 'closed');
                                    } else if (job.status === 'closed') {
                                      handleStatusChange(job.id, 'active');
                                    } else {
                                      handleStatusChange(job.id, 'active');
                                    }
                                  }}
                                >
                                  {job.status === 'active' ? 'Close Job' : job.status === 'closed' ? 'Reactivate Job' : 'Publish Job'}
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-destructive" 
                                  onClick={() => confirmDelete(job)}
                                >
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
                            <Button asChild className="gap-1.5">
                              <Link to="/manager/jobs/create">
                                <PlusCircle className="h-4 w-4" />
                                Create Your First Job
                              </Link>
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Job</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this job listing? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteJob}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManagerJobListings;
