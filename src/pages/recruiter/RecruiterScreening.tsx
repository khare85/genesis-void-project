
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { 
  ChevronDown, 
  ChevronUp,
  Clock, 
  FileCheck, 
  Search, 
  ThumbsDown, 
  ThumbsUp,
  Filter, 
  ArrowUpDown,
  PlayCircle,
  X,
  Zap
} from "lucide-react";
import { candidatesData } from "./RecruiterCandidates";
import PageHeader from "@/components/shared/PageHeader";
import MatchScoreRing from "@/components/shared/MatchScoreRing";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AIGenerated from "@/components/shared/AIGenerated";
import { Progress } from "@/components/ui/progress";

// Interface for our screening data
interface ScreeningCandidate {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  status: "pending" | "approved" | "rejected";
  dateApplied: string;
  jobRole: string;
  skills: string[];
  experience: string;
  education: string;
  avatar: string;
  videoIntro: string;
  matchScore: number;
  screeningScore: number;
  screeningNotes: string;
  aiSummary: string;
  reviewTime: number;
  position: string;
}

// Enhance candidates data with missing properties
const screeningData: ScreeningCandidate[] = candidatesData.map(candidate => {
  // Generate a random status, ensuring it's one of the allowed values
  const statusOptions: ("pending" | "approved" | "rejected")[] = ["pending", "approved", "rejected"];
  const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
  
  return {
    ...candidate,
    status: randomStatus,
    dateApplied: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000).toLocaleDateString(),
    jobRole: ["Senior Developer", "UX Designer", "Product Manager", "Data Scientist"][Math.floor(Math.random() * 4)],
    screeningScore: Math.floor(Math.random() * 40) + 60,
    screeningNotes: "",
    aiSummary: `${candidate.name} has ${Math.floor(Math.random() * 6) + 2} years of experience in this field. Their resume shows strong skills in ${["React", "Angular", "Vue", "Node.js", "Python", "UI/UX", "Product Management"][Math.floor(Math.random() * 7)]}.`,
    reviewTime: Math.floor(Math.random() * 60) + 30, // seconds
    avatar: candidate.profilePic || `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 99)}.jpg`,
    videoIntro: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"
  } as ScreeningCandidate;
});

// AI Screening states
type ScreeningState = 'idle' | 'running' | 'completed' | 'failed';

const RecruiterScreening: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [sortField, setSortField] = useState<keyof ScreeningCandidate | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedCandidate, setSelectedCandidate] = useState<ScreeningCandidate | null>(null);
  const [jobRoleFilter, setJobRoleFilter] = useState<string>("all");

  // AI Screening states
  const [screeningState, setScreeningState] = useState<ScreeningState>('idle');
  const [screeningProgress, setScreeningProgress] = useState(0);
  const [screeningDialogOpen, setScreeningDialogOpen] = useState(false);
  const [candidatesToScreen, setCandidatesToScreen] = useState<ScreeningCandidate[]>([]);
  
  // Filter candidates based on search term, status, and job role
  const filteredCandidates = screeningData.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          candidate.skills.join(" ").toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = activeTab === "all" || candidate.status === activeTab;
    
    const matchesJobRole = jobRoleFilter === "all" || candidate.jobRole === jobRoleFilter;
    
    return matchesSearch && matchesStatus && matchesJobRole;
  });

  // Sort candidates
  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    if (!sortField) return 0;
    
    if (sortField === 'screeningScore' || sortField === 'matchScore' || sortField === 'reviewTime') {
      return sortDirection === 'asc' 
        ? a[sortField] - b[sortField]
        : b[sortField] - a[sortField];
    }
    
    // For string fields
    return sortDirection === 'asc'
      ? String(a[sortField]).localeCompare(String(b[sortField]))
      : String(b[sortField]).localeCompare(String(a[sortField]));
  });

  // Handle sorting
  const handleSort = (field: keyof ScreeningCandidate) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Get unique job roles for filtering
  const uniqueJobRoles = Array.from(new Set(screeningData.map(c => c.jobRole)));

  // Handle status change
  const handleStatusChange = (candidate: ScreeningCandidate, newStatus: "approved" | "rejected") => {
    // In a real app, this would update the database
    toast({
      title: `Candidate ${newStatus}`,
      description: `${candidate.name} has been ${newStatus}`,
      variant: newStatus === "approved" ? "default" : "destructive",
    });
    
    // Close candidate detail if open
    if (selectedCandidate && selectedCandidate.id === candidate.id) {
      setSelectedCandidate(null);
    }
  };

  // Get count by status
  const getCandidateCountByStatus = (status: string) => {
    return screeningData.filter(c => status === "all" || c.status === status).length;
  };

  // Start AI Screening
  const startAIScreening = () => {
    // Get all pending candidates
    const pendingCandidates = screeningData.filter(c => c.status === "pending");
    setCandidatesToScreen(pendingCandidates);
    setScreeningDialogOpen(true);
  };

  // Run the AI screening process
  const runScreening = () => {
    if (candidatesToScreen.length === 0) {
      toast({
        title: "No candidates to screen",
        description: "There are no pending candidates to screen.",
        variant: "destructive",
      });
      setScreeningDialogOpen(false);
      return;
    }

    setScreeningState('running');
    setScreeningProgress(0);
    
    // Simulate the screening process
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 5) + 1;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Complete the screening after a short delay
        setTimeout(() => {
          setScreeningState('completed');
          
          // Show toast
          toast({
            title: "AI Screening Completed",
            description: `Successfully screened ${candidatesToScreen.length} candidates.`,
          });
        }, 500);
      }
      setScreeningProgress(progress);
    }, 200);
  };

  // Reset screening state
  const resetScreeningState = () => {
    setScreeningState('idle');
    setScreeningProgress(0);
    setScreeningDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Candidate Screening"
        description="Review and screen job applicants"
        icon={<FileCheck className="h-6 w-6" />}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Advanced Filters
            </Button>
            <Button size="sm" onClick={startAIScreening}>
              <Zap className="mr-2 h-4 w-4" />
              Start AI Screening
            </Button>
          </div>
        }
      />
      
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search candidates..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={jobRoleFilter} onValueChange={setJobRoleFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {uniqueJobRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button variant="outline" onClick={() => {
                setSearchTerm("");
                setJobRoleFilter("all");
              }}>
                <X className="mr-2 h-4 w-4" />
                Clear
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">
                All
                <Badge variant="secondary" className="ml-2">
                  {getCandidateCountByStatus('all')}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending
                <Badge variant="secondary" className="ml-2">
                  {getCandidateCountByStatus('pending')}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved
                <Badge variant="secondary" className="ml-2">
                  {getCandidateCountByStatus('approved')}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected
                <Badge variant="secondary" className="ml-2">
                  {getCandidateCountByStatus('rejected')}
                </Badge>
              </TabsTrigger>
            </TabsList>
          
            <TabsContent value="all" className="mt-4">
              <ScreeningTable 
                candidates={sortedCandidates} 
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                onSelectCandidate={setSelectedCandidate}
                onStatusChange={handleStatusChange}
              />
            </TabsContent>
            
            <TabsContent value="pending" className="mt-4">
              <ScreeningTable 
                candidates={sortedCandidates} 
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                onSelectCandidate={setSelectedCandidate}
                onStatusChange={handleStatusChange}
              />
            </TabsContent>
            
            <TabsContent value="approved" className="mt-4">
              <ScreeningTable 
                candidates={sortedCandidates} 
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                onSelectCandidate={setSelectedCandidate}
                onStatusChange={handleStatusChange}
              />
            </TabsContent>
            
            <TabsContent value="rejected" className="mt-4">
              <ScreeningTable 
                candidates={sortedCandidates} 
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                onSelectCandidate={setSelectedCandidate}
                onStatusChange={handleStatusChange}
              />
            </TabsContent>
          </Tabs>
        </div>
      </Card>
      
      {selectedCandidate && (
        <CandidateDetail 
          candidate={selectedCandidate} 
          onClose={() => setSelectedCandidate(null)} 
          onStatusChange={handleStatusChange}
        />
      )}

      {/* AI Screening Dialog */}
      <Dialog open={screeningDialogOpen} onOpenChange={setScreeningDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>AI Screening</DialogTitle>
            <DialogDescription>
              {screeningState === 'idle' && 
                `Screen ${candidatesToScreen.length} pending candidates automatically using AI.`}
              {screeningState === 'running' && 
                "AI is analyzing candidate profiles, resumes, and video introductions..."}
              {screeningState === 'completed' && 
                `Successfully screened ${candidatesToScreen.length} candidates!`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {screeningState === 'idle' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Candidates to screen:</span>
                  <span className="font-medium">{candidatesToScreen.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Estimated time:</span>
                  <span className="font-medium">{Math.ceil(candidatesToScreen.length * 0.5)} minutes</span>
                </div>
              </div>
            )}
            
            {screeningState === 'running' && (
              <div className="space-y-4">
                <Progress value={screeningProgress} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Processing...</span>
                  <span>{screeningProgress}%</span>
                </div>
                <div className="mt-4 space-y-2">
                  <AIGenerated>
                    <div className="text-xs space-y-1">
                      <p>Analyzing candidate data...</p>
                      <p>Extracting skills from resumes...</p>
                      <p>Comparing with job requirements...</p>
                      {screeningProgress > 50 && <p>Processing video introductions...</p>}
                      {screeningProgress > 80 && <p>Generating candidate insights...</p>}
                      {screeningProgress === 100 && <p>Finalizing reports...</p>}
                    </div>
                  </AIGenerated>
                </div>
              </div>
            )}
            
            {screeningState === 'completed' && (
              <div className="space-y-4">
                <div className="rounded-md bg-primary/10 border border-primary/30 p-4 text-center">
                  <Zap className="mx-auto h-8 w-8 text-primary mb-2" />
                  <h3 className="font-medium">Screening Complete</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    All candidates have been processed and scored
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="font-medium">{Math.floor(candidatesToScreen.length * 0.8)}</div>
                    <div className="text-xs text-muted-foreground">Strong matches</div>
                  </div>
                  <div>
                    <div className="font-medium">{Math.floor(candidatesToScreen.length * 0.15)}</div>
                    <div className="text-xs text-muted-foreground">Medium matches</div>
                  </div>
                  <div>
                    <div className="font-medium">{Math.floor(candidatesToScreen.length * 0.05)}</div>
                    <div className="text-xs text-muted-foreground">Low matches</div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter className="flex sm:justify-between">
            {screeningState === 'idle' && (
              <>
                <Button variant="outline" onClick={() => setScreeningDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={runScreening}>
                  <Zap className="mr-2 h-4 w-4" />
                  Start Screening
                </Button>
              </>
            )}
            
            {screeningState === 'running' && (
              <Button variant="outline" className="ml-auto" disabled>
                Processing...
              </Button>
            )}
            
            {screeningState === 'completed' && (
              <>
                <Button variant="outline" onClick={resetScreeningState}>
                  Close
                </Button>
                <Button onClick={resetScreeningState}>
                  View Results
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Table component for screening
interface ScreeningTableProps {
  candidates: ScreeningCandidate[];
  sortField: keyof ScreeningCandidate | null;
  sortDirection: "asc" | "desc";
  onSort: (field: keyof ScreeningCandidate) => void;
  onSelectCandidate: (candidate: ScreeningCandidate) => void;
  onStatusChange: (candidate: ScreeningCandidate, status: "approved" | "rejected") => void;
}

const ScreeningTable: React.FC<ScreeningTableProps> = ({ 
  candidates, 
  sortField, 
  sortDirection, 
  onSort,
  onSelectCandidate,
  onStatusChange
}) => {
  const getSortIcon = (field: keyof ScreeningCandidate) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline"><Clock className="mr-1 h-3 w-3" /> Pending</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Score</TableHead>
            <TableHead>
              <div className="flex items-center cursor-pointer" onClick={() => onSort('name')}>
                Candidate
                {getSortIcon('name')}
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center cursor-pointer" onClick={() => onSort('jobRole')}>
                Role
                {getSortIcon('jobRole')}
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center cursor-pointer" onClick={() => onSort('dateApplied')}>
                Applied
                {getSortIcon('dateApplied')}
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center cursor-pointer" onClick={() => onSort('status')}>
                Status
                {getSortIcon('status')}
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center cursor-pointer" onClick={() => onSort('reviewTime')}>
                Review Time
                {getSortIcon('reviewTime')}
              </div>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No candidates found.
              </TableCell>
            </TableRow>
          ) : (
            candidates.map((candidate) => (
              <TableRow key={candidate.id}>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <MatchScoreRing score={candidate.screeningScore} size="sm" />
                      </TooltipTrigger>
                      <TooltipContent>
                        Screening Score: {candidate.screeningScore}%
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Dialog>
                      <DialogTrigger>
                        <Avatar className="h-9 w-9 cursor-pointer border">
                          <AvatarImage src={candidate.avatar} alt={candidate.name} />
                          <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Candidate Video Introduction</DialogTitle>
                        </DialogHeader>
                        <div className="aspect-video bg-muted rounded-md overflow-hidden">
                          <video 
                            src={candidate.videoIntro} 
                            controls 
                            poster={candidate.avatar}
                            className="w-full h-full object-cover"
                          >
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <div>
                      <div 
                        className="font-medium cursor-pointer hover:text-primary"
                        onClick={() => onSelectCandidate(candidate)}
                      >
                        {candidate.name}
                      </div>
                      <div className="text-sm text-muted-foreground">{candidate.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{candidate.jobRole}</TableCell>
                <TableCell>{candidate.dateApplied}</TableCell>
                <TableCell>{getStatusBadge(candidate.status)}</TableCell>
                <TableCell>
                  <span className="text-muted-foreground text-sm">
                    {Math.floor(candidate.reviewTime / 60)}:{(candidate.reviewTime % 60).toString().padStart(2, '0')} min
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onSelectCandidate(candidate)}
                      title="View Details"
                    >
                      <FileCheck className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-green-500 hover:text-green-600 hover:bg-green-50"
                      onClick={() => onStatusChange(candidate, "approved")}
                      disabled={candidate.status === 'approved'}
                      title="Approve"
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-destructive hover:text-destructive/80 hover:bg-destructive/10" 
                      onClick={() => onStatusChange(candidate, "rejected")}
                      disabled={candidate.status === 'rejected'}
                      title="Reject"
                    >
                      <ThumbsDown className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

// Candidate detail component
interface CandidateDetailProps {
  candidate: ScreeningCandidate;
  onClose: () => void;
  onStatusChange: (candidate: ScreeningCandidate, status: "approved" | "rejected") => void;
}

const CandidateDetail: React.FC<CandidateDetailProps> = ({ candidate, onClose, onStatusChange }) => {
  const [notes, setNotes] = useState(candidate.screeningNotes);
  
  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 border bg-primary/10">
            <AvatarImage src={candidate.avatar} alt={candidate.name} />
            <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-bold">{candidate.name}</h2>
            <p className="text-muted-foreground">{candidate.jobRole}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1 bg-green-500 text-white hover:bg-green-600 border-0"
            onClick={() => onStatusChange(candidate, "approved")}
            disabled={candidate.status === 'approved'}
          >
            <ThumbsUp className="h-4 w-4" />
            Approve
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            className="gap-1 bg-destructive text-destructive-foreground hover:bg-destructive/90 border-0"
            onClick={() => onStatusChange(candidate, "rejected")}
            disabled={candidate.status === 'rejected'}
          >
            <ThumbsDown className="h-4 w-4" />
            Reject
          </Button>
          
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Candidate Details</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p>{candidate.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p>{candidate.phone}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p>{candidate.location}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Skills</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {candidate.skills.map((skill, i) => (
                  <Badge key={i} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Experience</p>
              <p>{candidate.experience}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Education</p>
              <p>{candidate.education}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Applied on</p>
              <p>{candidate.dateApplied}</p>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-2">Video Introduction</h4>
            <div className="aspect-video bg-muted rounded-md overflow-hidden">
              <video 
                src={candidate.videoIntro} 
                controls 
                poster={candidate.avatar}
                className="w-full h-full object-cover"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Screening Information</h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-md bg-muted">
              <div>
                <p className="text-sm text-muted-foreground">Screening Score</p>
                <p className="text-2xl font-semibold">{candidate.screeningScore}%</p>
              </div>
              
              <MatchScoreRing score={candidate.screeningScore} size="lg" />
            </div>
            
            <div className="p-4 rounded-md border">
              <h4 className="text-sm font-medium mb-2">AI Summary</h4>
              <AIGenerated>
                <p className="text-sm">{candidate.aiSummary}</p>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span>Technical Match</span>
                    <span className="font-medium">{Math.floor(Math.random() * 20) + 80}%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>Cultural Fit</span>
                    <span className="font-medium">{Math.floor(Math.random() * 20) + 80}%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>Experience Relevance</span>
                    <span className="font-medium">{Math.floor(Math.random() * 30) + 70}%</span>
                  </div>
                </div>
              </AIGenerated>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Screening Notes</label>
              <textarea 
                className="w-full h-32 p-3 rounded-md border resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Add your screening notes here..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Suggested Questions</h4>
              <AIGenerated>
                <ul className="space-y-2 text-sm">
                  <li>1. Can you describe your experience with {candidate.skills[0]}?</li>
                  <li>2. How have you handled challenging projects in your previous role?</li>
                  <li>3. What interests you about this specific position?</li>
                </ul>
              </AIGenerated>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RecruiterScreening;
