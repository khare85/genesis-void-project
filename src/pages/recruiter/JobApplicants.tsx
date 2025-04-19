
import React, { useState, useEffect } from "react";
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
  Loader2
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Status badge styling
const getStatusBadge = (status: string) => {
  switch (status) {
    case "new":
    case "pending":
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
      poster={src ? "" : undefined} 
      controls={false}
      muted
      loop
    />
    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded-md">
      30s intro
    </div>
  </div>
);

interface Applicant {
  id: string;
  name: string;
  email: string;
  position?: string;
  status: string;
  matchScore?: number;
  applicationDate: string;
  stage: number;
  profilePic?: string;
  videoIntro?: string;
  skills?: string[];
  videoUrl?: string;
  resumeUrl?: string;
}

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  applicants: number;
  newApplicants: number;
  postedDate: string;
  status: string;
  type: string;
  priority?: string; // Make priority optional since it might not exist in the DB
  description: string;
}

const JobApplicants: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingApplicants, setIsLoadingApplicants] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");
  
  // Fetch job data
  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        // Fetch the job details from Supabase
        const { data: jobData, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          console.error("Error fetching job:", error);
          toast.error("Failed to load job details");
          return;
        }
        
        if (jobData) {
          setJob({
            id: jobData.id,
            title: jobData.title,
            department: jobData.department || 'Not specified',
            location: jobData.location,
            applicants: 0, // Will be updated after fetching applicants
            newApplicants: 0,
            postedDate: jobData.posteddate,
            status: jobData.status,
            type: jobData.type,
            priority: 'medium', // Set a default priority value since it might not exist in DB
            description: jobData.description || 'No description available'
          });
        }
      } catch (err) {
        console.error("Error in job fetch:", err);
        toast.error("An error occurred while loading job details");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchJob();
  }, [id]);
  
  // Fetch applicants data
  useEffect(() => {
    const fetchApplicants = async () => {
      if (!id) return;
      
      setIsLoadingApplicants(true);
      try {
        // Fetch applications for this job from Supabase
        const { data: applicationsData, error: applicationsError } = await supabase
          .from('applications')
          .select(`
            id,
            status,
            created_at,
            resume_url,
            video_url,
            screening_score,
            match_score,
            candidate_id
          `)
          .eq('job_id', id);
        
        if (applicationsError) {
          console.error("Error fetching applications:", applicationsError);
          toast.error("Failed to load applications");
          return;
        }
        
        if (!applicationsData || applicationsData.length === 0) {
          setApplicants([]);
          setIsLoadingApplicants(false);
          return;
        }
        
        // Update job applicant count
        if (job) {
          setJob({
            ...job,
            applicants: applicationsData.length,
            newApplicants: applicationsData.filter(app => app.status === 'pending').length
          });
        }
        
        // Fetch candidate profiles for each application
        const applicantPromises = applicationsData.map(async (application) => {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', application.candidate_id)
            .single();
          
          if (profileError) {
            console.error(`Error fetching profile for candidate ${application.candidate_id}:`, profileError);
            return null;
          }
          
          if (!profileData) return null;
          
          // Generate a random stage for demo (in a real app, this would be stored in the database)
          const randomStage = Math.floor(Math.random() * 4);
          
          return {
            id: application.id,
            name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || 'Unknown Candidate',
            email: profileData.email || '',
            position: profileData.title || 'Applicant',
            status: application.status,
            matchScore: application.match_score || Math.floor(Math.random() * 100),
            applicationDate: new Date(application.created_at).toLocaleDateString(),
            stage: randomStage,
            profilePic: profileData.avatar_url,
            videoIntro: application.video_url,
            skills: ['React', 'TypeScript', 'UI/UX'], // Placeholder skills
            videoUrl: application.video_url,
            resumeUrl: application.resume_url
          };
        });
        
        const resolvedApplicants = (await Promise.all(applicantPromises)).filter(Boolean) as Applicant[];
        setApplicants(resolvedApplicants);
      } catch (err) {
        console.error("Error in applicants fetch:", err);
        toast.error("An error occurred while loading applicants");
      } finally {
        setIsLoadingApplicants(false);
      }
    };
    
    if (job) {
      fetchApplicants();
    }
  }, [id, job]);
  
  // Filter applicants based on search and filters
  const filteredApplicants = applicants.filter((applicant) => {
    const matchesSearch = 
      applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (applicant.position && applicant.position.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (filter === "all") return matchesSearch;
    return matchesSearch && applicant.status === filter;
  });
  
  // Sort applicants
  const sortedApplicants = [...filteredApplicants].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime();
      case "oldest":
        return new Date(a.applicationDate).getTime() - new Date(b.applicationDate).getTime();
      case "match-high":
        return (b.matchScore || 0) - (a.matchScore || 0);
      case "match-low":
        return (a.matchScore || 0) - (b.matchScore || 0);
      default:
        return 0;
    }
  });
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
                      checked={filter === "pending"} 
                      onCheckedChange={() => setFilter("pending")}
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
              {isLoadingApplicants ? (
                <div className="flex justify-center items-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
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
                                    {applicant.videoUrl ? (
                                      <VideoPreview src={applicant.videoUrl} />
                                    ) : (
                                      <div className="flex items-center justify-center bg-gray-100 min-h-[180px]">
                                        <span className="text-sm text-gray-500">No video available</span>
                                      </div>
                                    )}
                                    <div className="p-3">
                                      <h4 className="font-semibold">{applicant.name}</h4>
                                      <p className="text-sm text-muted-foreground">{applicant.position}</p>
                                      <div className="flex flex-wrap gap-1 mt-2">
                                        {applicant.skills && applicant.skills.slice(0, 3).map((skill) => (
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
                                  <p className="text-xs text-muted-foreground">{applicant.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <MatchScoreRing score={applicant.matchScore || 0} size="sm" />
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
                            <div className="flex flex-col items-center justify-center">
                              <Users className="h-8 w-8 text-muted-foreground/50 mb-2" />
                              <p>No applicants found.</p>
                              <p className="text-sm text-muted-foreground mt-1">
                                Share this job posting to attract more candidates.
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="grid">
              {isLoadingApplicants ? (
                <div className="flex justify-center items-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : sortedApplicants.length > 0 ? (
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
                              {applicant.videoUrl ? (
                                <VideoPreview src={applicant.videoUrl} />
                              ) : (
                                <div className="flex items-center justify-center bg-gray-100 min-h-[180px]">
                                  <span className="text-sm text-gray-500">No video available</span>
                                </div>
                              )}
                              <div className="p-3">
                                <h4 className="font-semibold">{applicant.name}</h4>
                                <p className="text-sm text-muted-foreground">{applicant.email}</p>
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
                          <MatchScoreRing score={applicant.matchScore || 0} size="sm" />
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
                            {applicant.skills && applicant.skills.slice(0, 3).map((skill) => (
                              <Badge key={skill} variant="outline">
                                {skill}
                              </Badge>
                            ))}
                            {applicant.skills && applicant.skills.length > 3 && (
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
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-32 text-center">
                  <Users className="h-8 w-8 text-muted-foreground/50 mb-2" />
                  <p>No applicants found.</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Share this job posting to attract more candidates.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobApplicants;
