
import React from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "@/components/shared/PageHeader";
import MatchScoreRing from "@/components/shared/MatchScoreRing";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useJobApplicantsData } from "@/hooks/recruiter/useJobApplicantsData";

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
    case "approved":
      return <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>;
    case "pending":
      return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>;
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
  const { id } = useParams<{ id: string }>();
  
  const { 
    job,
    applicants: sortedApplicants,
    isLoading,
    error,
    totalCount,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy
  } = useJobApplicantsData(id);
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48" />
              <div className="space-y-2 pt-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
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
        description={`${totalCount} applicants for this position`}
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
            <p className="text-muted-foreground">{job.description || "No description provided."}</p>
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
                      checked={filter === "pending"} 
                      onCheckedChange={() => setFilter("pending")}
                    >
                      Pending
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem 
                      checked={filter === "approved"} 
                      onCheckedChange={() => setFilter("approved")}
                    >
                      Approved
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem 
                      checked={filter === "rejected"} 
                      onCheckedChange={() => setFilter("rejected")}
                    >
                      Rejected
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
                                      <AvatarImage src={applicant.avatar} alt={applicant.name} />
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
                                <AvatarImage src={applicant.avatar} alt={applicant.name} />
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
