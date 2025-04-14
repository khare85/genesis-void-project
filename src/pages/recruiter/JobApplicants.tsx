import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { 
  Briefcase, 
  ChevronLeft, 
  Users, 
  Search, 
  Filter, 
  ArrowUpDown,
  Mail,
  Phone,
  Calendar,
  FileText,
  MoreHorizontal,
  Play,
  ChevronDown,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Progress } from "@/components/ui/progress";
import PageHeader from "@/components/shared/PageHeader";
import MatchScoreRing from "@/components/shared/MatchScoreRing";
import { candidatesData } from "./RecruiterCandidates";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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
    description: 'We are looking for a Senior Frontend Developer to join our engineering team. You will be responsible for building and maintaining our web applications.'
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
    description: 'Join our product team as a Product Manager to help define and execute our product roadmap.'
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
    description: 'We are seeking a talented UX Designer to create intuitive and engaging user experiences for our products.'
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
    description: 'We need a DevOps Engineer to help us automate and streamline our software development and deployment processes.'
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
    description: 'We are looking for a Marketing Specialist to develop and implement marketing strategies to promote our products and services.'
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
    description: 'We need a Customer Support Specialist to provide excellent customer service and resolve customer issues.'
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
    description: 'We are looking for a skilled Backend Developer to build and maintain our server-side logic and databases.'
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
    description: 'We need a Data Analyst to analyze data and provide insights to help us make better business decisions.'
  }
];

// Status badge styling
const getStatusBadge = (status: string) => {
  switch (status) {
    case "new":
      return <Badge className="bg-blue-500 hover:bg-blue-600">New</Badge>;
    case "shortlisted":
      return <Badge className="bg-green-500 hover:bg-green-600">Shortlisted</Badge>;
    case "interviewed":
      return <Badge className="bg-purple-500 hover:bg-purple-600">Interviewed</Badge>;
    case "rejected":
      return <Badge variant="destructive">Rejected</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const StageProgress: React.FC<{ stage: number }> = ({ stage }) => {
  const stages = ["Applied", "Screened", "Interview", "Decision"];
  const progress = (stage / (stages.length - 1)) * 100;
  
  return (
    <div className="w-full">
      <Progress value={progress} className="h-2 mb-1" />
      <div className="flex justify-between text-xs text-muted-foreground">
        {stages.map((stageName, index) => (
          <div 
            key={stageName} 
            className={`${index <= stage ? "text-primary font-medium" : ""}`}
          >
            {stageName}
          </div>
        ))}
      </div>
    </div>
  );
};

const VideoPreview = ({ src }: { src: string }) => (
  <div className="relative w-full h-full min-h-[180px] rounded-md overflow-hidden bg-black">
    <div className="absolute inset-0 flex items-center justify-center">
      <Play className="text-white h-8 w-8 z-10" />
      <div className="absolute inset-0 bg-black/30"></div>
    </div>
    <video 
      className="w-full h-full object-cover" 
      src={src}
      poster={src.replace('.mp4', '-poster.jpg')} 
      controls={false}
      muted
      loop
    />
    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded-md">
      30s intro
    </div>
  </div>
);

const JobApplicants: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const jobId = parseInt(id || "0");
  const job = jobsData.find(job => job.id === jobId);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");
  
  // Filter job applicants from candidatesData who have applied to this job
  // In a real app, you'd have a relation between jobs and candidates
  // Here we're simulating by assuming candidates with the highest match scores applied to this job
  const jobApplicants = candidatesData
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, job?.applicants || 0)
    .map(candidate => ({
      ...candidate,
      applicationDate: new Date(candidate.appliedDate).toLocaleDateString(),
      stage: Math.floor(Math.random() * 4) // Random stage for demo
    }));
  
  // Filter applicants based on search and filters
  const filteredApplicants = jobApplicants.filter((applicant) => {
    const matchesSearch = 
      applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      applicant.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      applicant.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (filter === "all") return matchesSearch;
    return matchesSearch && applicant.status === filter;
  });
  
  // Sort applicants
  const sortedApplicants = [...filteredApplicants].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
      case "oldest":
        return new Date(a.appliedDate).getTime() - new Date(b.appliedDate).getTime();
      case "match-high":
        return b.matchScore - a.matchScore;
      case "match-low":
        return a.matchScore - b.matchScore;
      default:
        return 0;
    }
  });
  
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
        description={`${job.applicants} applicants for this position`}
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
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Job Description</h3>
            <p className="text-muted-foreground">{job.description}</p>
          </div>
          
          <div className="mb-6 space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex w-full max-w-sm items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search applicants..."
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
                      Status: {filter === "all" ? "All" : filter.charAt(0).toUpperCase() + filter.slice(1)}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuCheckboxItem 
                      checked={filter === "all"} 
                      onCheckedChange={() => setFilter("all")}
                    >
                      All
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem 
                      checked={filter === "new"} 
                      onCheckedChange={() => setFilter("new")}
                    >
                      New
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem 
                      checked={filter === "shortlisted"} 
                      onCheckedChange={() => setFilter("shortlisted")}
                    >
                      Shortlisted
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem 
                      checked={filter === "interviewed"} 
                      onCheckedChange={() => setFilter("interviewed")}
                    >
                      Interviewed
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <div className="flex items-center gap-2">
                      <ArrowUpDown className="h-3.5 w-3.5" />
                      <span>Sort By</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="match-high">Match Score (High)</SelectItem>
                    <SelectItem value="match-low">Match Score (Low)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="table" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="table">Table View</TabsTrigger>
              <TabsTrigger value="grid">Card View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="table" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Candidate</TableHead>
                      <TableHead>Match</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead>Applied</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedApplicants.length > 0 ? (
                      sortedApplicants.map((applicant) => (
                        <TableRow key={applicant.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <HoverCard>
                                <HoverCardTrigger asChild>
                                  <div className="cursor-pointer hover:opacity-90 transition-opacity">
                                    <Avatar className="h-10 w-10 border">
                                      <AvatarImage src={applicant.profilePic} alt={applicant.name} />
                                      <AvatarFallback>{applicant.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                  </div>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-80 p-0">
                                  <VideoPreview src={applicant.videoIntro} />
                                  <div className="p-3">
                                    <h4 className="font-semibold">{applicant.name}</h4>
                                    <p className="text-sm text-muted-foreground">{applicant.position}</p>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {applicant.skills.slice(0, 3).map((skill) => (
                                        <Badge key={skill} variant="outline">
                                          {skill}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </HoverCardContent>
                              </HoverCard>
                              <div>
                                <Link
                                  to={`/recruiter/candidates/${applicant.id}`}
                                  className="hover:text-primary hover:underline"
                                >
                                  {applicant.name}
                                </Link>
                                <p className="text-xs text-muted-foreground">{applicant.position}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <MatchScoreRing score={applicant.matchScore} size="sm" />
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(applicant.status)}</TableCell>
                          <TableCell>
                            <StageProgress stage={applicant.stage} />
                          </TableCell>
                          <TableCell>{applicant.applicationDate}</TableCell>
                          <TableCell>
                            <div className="flex justify-end space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                title="Email"
                              >
                                <Mail className="h-4 w-4" />
                                <span className="sr-only">Email</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                title="Call"
                              >
                                <Phone className="h-4 w-4" />
                                <span className="sr-only">Call</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm" 
                                className="h-8 w-8 p-0"
                                title="Schedule"
                              >
                                <Calendar className="h-4 w-4" />
                                <span className="sr-only">Schedule</span>
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">More</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem asChild>
                                    <Link to={`/recruiter/candidates/${applicant.id}`}>View Profile</Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>Move to Shortlist</DropdownMenuItem>
                                  <DropdownMenuItem>Schedule Interview</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive">
                                    Reject Candidate
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No applicants found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="grid">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sortedApplicants.map((applicant) => (
                  <Card key={applicant.id} className="overflow-hidden">
                    <CardHeader className="bg-muted/50 pb-2">
                      <div className="flex items-center gap-4">
                        <HoverCard>
                          <HoverCardTrigger asChild>
                            <div className="cursor-pointer hover:opacity-90 transition-opacity">
                              <Avatar className="h-14 w-14 border">
                                <AvatarImage src={applicant.profilePic} alt={applicant.name} />
                                <AvatarFallback>{applicant.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                            </div>
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80 p-0">
                            <VideoPreview src={applicant.videoIntro} />
                            <div className="p-3">
                              <h4 className="font-semibold">{applicant.name}</h4>
                              <p className="text-sm text-muted-foreground">{applicant.position}</p>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                        <div className="flex-1">
                          <Link
                            to={`/recruiter/candidates/${applicant.id}`}
                            className="font-medium hover:text-primary hover:underline"
                          >
                            {applicant.name}
                          </Link>
                          <p className="text-sm text-muted-foreground">{applicant.position}</p>
                        </div>
                        <MatchScoreRing score={applicant.matchScore} size="sm" />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>{getStatusBadge(applicant.status)}</div>
                          <div className="text-xs text-muted-foreground">
                            Applied: {applicant.applicationDate}
                          </div>
                        </div>
                        
                        <StageProgress stage={applicant.stage} />
                        
                        <div className="flex flex-wrap gap-1 pt-1">
                          {applicant.skills.slice(0, 3).map((skill) => (
                            <Badge key={skill} variant="outline">
                              {skill}
                            </Badge>
                          ))}
                          {applicant.skills.length > 3 && (
                            <Badge variant="outline">+{applicant.skills.length - 3}</Badge>
                          )}
                        </div>
                        
                        <div className="flex justify-between pt-2">
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              title="Email"
                            >
                              <Mail className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              title="Schedule"
                            >
                              <Calendar className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button size="sm" variant="outline" asChild>
                            <Link to={`/recruiter/candidates/${applicant.id}`}>
                              View Profile
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {sortedApplicants.length === 0 && (
                  <div className="col-span-full flex h-24 items-center justify-center text-center">
                    No applicants found.
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobApplicants;
