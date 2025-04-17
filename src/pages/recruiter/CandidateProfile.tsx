
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import ProfileTabs from "@/components/profile/ProfileTabs";
import PageHeader from "@/components/shared/PageHeader";
import { 
  ChevronLeft, Mail, Phone, Star, X, Video, Users, 
  MoveHorizontal, MapPin, Briefcase, School, Award, 
  Sparkles, Calendar
} from "lucide-react";
import { candidatesData } from "@/data/candidates-data";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import MatchScoreRing from "@/components/shared/MatchScoreRing";
import { Separator } from "@/components/ui/separator";
import AIGenerated from "@/components/shared/AIGenerated";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { 
  AlertDialog, AlertDialogTrigger, AlertDialogContent, 
  AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, 
  AlertDialogFooter, AlertDialogCancel, AlertDialogAction 
} from "@/components/ui/alert-dialog";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogDescription, DialogFooter 
} from "@/components/ui/dialog";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";

// Time zones with city/country information
const timeZones = [
  { value: "UTC", label: "UTC (Coordinated Universal Time)" },
  { value: "America/New_York", label: "New York, USA (EDT/EST)" },
  { value: "America/Los_Angeles", label: "Los Angeles, USA (PDT/PST)" },
  { value: "Europe/London", label: "London, UK (BST/GMT)" },
  { value: "Europe/Berlin", label: "Berlin, Germany (CEST/CET)" },
  { value: "Asia/Tokyo", label: "Tokyo, Japan (JST)" },
  { value: "Asia/Singapore", label: "Singapore (SGT)" },
  { value: "Australia/Sydney", label: "Sydney, Australia (AEST/AEDT)" },
  { value: "Asia/Dubai", label: "Dubai, UAE (GST)" },
  { value: "Asia/Kolkata", label: "Mumbai, India (IST)" },
];

// Mock job listings for the move dialog
const jobListings = [
  { id: 1, title: "Senior Frontend Developer", company: "TechCorp" },
  { id: 2, title: "Backend Engineer", company: "InnoSoft" },
  { id: 3, title: "Full Stack Developer", company: "WebSolutions" },
  { id: 4, title: "UX Designer", company: "DesignHub" },
  { id: 5, title: "Product Manager", company: "ProductCo" },
];

// Enhance our candidate data with additional fields
const enhancedCandidatesData = candidatesData.map(candidate => ({
  ...candidate,
  jobRole: candidate.position || "Candidate",
  avatar: candidate.profilePic || `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 99)}.jpg`,
  videoIntro: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
  about: "Experienced developer with a passion for creating elegant solutions to complex problems. Specializes in frontend development with React and TypeScript.",
  hasAIAssessment: Math.random() > 0.5, // Randomly determine if assessment exists
  email: `${candidate.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
  phone: "+1 (555) 123-4567"
}));

const CandidateProfile = () => {
  const { id } = useParams<{ id?: string }>();
  const [candidate, setCandidate] = useState(enhancedCandidatesData.find(c => c.id === Number(id)));
  const [generatingAssessment, setGeneratingAssessment] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [interviewDate, setInterviewDate] = useState<Date | null>(null);
  const [isAIInterviewScheduled, setIsAIInterviewScheduled] = useState(false);
  const [showTeamsDialog, setShowTeamsDialog] = useState(false);
  const [meetingLink, setMeetingLink] = useState("");
  const [selectedTimeZone, setSelectedTimeZone] = useState("UTC");
  const [meetingTime, setMeetingTime] = useState("");
  const [showMoveDialog, setShowMoveDialog] = useState(false);
  const [selectedJob, setSelectedJob] = useState<number | null>(null);
  const [showDiscardConfirmDialog, setShowDiscardConfirmDialog] = useState(false);
  
  if (!candidate) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-bold">Candidate not found</h2>
          <p className="text-muted-foreground mt-2">The candidate you're looking for doesn't exist.</p>
          <Button asChild className="mt-4">
            <Link to="/recruiter/candidates">Back to Candidates</Link>
          </Button>
        </div>
      </Card>
    );
  }

  const handleGenerateAssessment = () => {
    setGeneratingAssessment(true);

    // Simulate API call to generate assessment
    setTimeout(() => {
      setGeneratingAssessment(false);
      setCandidate(prev => ({
        ...prev,
        hasAIAssessment: true
      }));
      toast({
        title: "Assessment Generated",
        description: "AI assessment report has been successfully generated",
      });
    }, 2000);
  };

  const handleRegenerateAssessment = () => {
    setShowDiscardConfirmDialog(false);
    setGeneratingAssessment(true);

    // Simulate API call to generate assessment
    setTimeout(() => {
      setGeneratingAssessment(false);
      toast({
        title: "Assessment Regenerated",
        description: "New AI assessment report has been successfully generated",
      });
    }, 2000);
  };

  const scheduleAIInterview = () => {
    // Set interview date to 7 days from now
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);
    
    setInterviewDate(expiryDate);
    setIsAIInterviewScheduled(true);
    
    toast({
      title: "AI Interview Scheduled",
      description: `Interview scheduled and available until ${expiryDate.toLocaleDateString()}`,
    });
  };

  const generateTeamsMeetingLink = () => {
    // This would typically integrate with Microsoft Teams API
    // Simulating a generated meeting link for demo purposes
    const mockMeetingLink = "https://teams.microsoft.com/l/meetup-join/meeting_" + 
      Math.random().toString(36).substring(2, 15);
    
    setMeetingLink(mockMeetingLink);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Meeting link copied to clipboard",
    });
  };

  const handleMoveCandidate = () => {
    if (!selectedJob) {
      toast({
        title: "No job selected",
        description: "Please select a job to move the candidate to",
      });
      return;
    }

    const selectedJobDetails = jobListings.find(job => job.id === selectedJob);
    
    // Here you would typically make an API call to move the candidate
    toast({
      title: "Candidate Moved",
      description: `Moved to ${selectedJobDetails?.title}. A new AI screening will be performed.`,
    });
    
    setShowMoveDialog(false);
    
    // Reset assessment status to trigger a new assessment for the new job
    setCandidate(prev => ({
      ...prev,
      hasAIAssessment: false
    }));
  };
  
  return (
    <div className="space-y-6">
      <PageHeader
        title={candidate.name}
        description={candidate.jobRole}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/recruiter/candidates">
                <ChevronLeft className="h-4 w-4 mr-1" /> Back to List
              </Link>
            </Button>
            <Button>Contact Candidate</Button>
            
            {/* Schedule Interview button */}
            <Popover>
              <PopoverTrigger asChild>
                <Button>
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Interview
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="space-y-4">
                  <h4 className="font-medium">Interview Type</h4>
                  <div className="grid gap-3">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" className="justify-start">
                          <Video className="mr-2 h-4 w-4" />
                          AI Interview
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Schedule AI Interview</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will send an invitation to the candidate to complete an AI interview
                            within 7 days. They will receive instructions via email.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={scheduleAIInterview}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    
                    <Button 
                      variant="outline" 
                      className="justify-start" 
                      onClick={() => {
                        setShowTeamsDialog(true);
                        generateTeamsMeetingLink();
                      }}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Face-to-Face Interview
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Move Candidate button */}
            <Button onClick={() => setShowMoveDialog(true)}>
              <MoveHorizontal className="mr-2 h-4 w-4" />
              Move
            </Button>
          </div>
        }
      />
      
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Candidate Info */}
        <Card className="lg:col-span-1">
          <div className="p-6">
            <div className="flex flex-col items-center mb-6">
              <HoverCard openDelay={300} closeDelay={200}>
                <HoverCardTrigger asChild>
                  <div className="relative">
                    <Avatar className="h-24 w-24 mb-3">
                      <AvatarImage src={candidate.avatar} alt={candidate.name} />
                      <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-80 p-0 bg-background">
                  <div className="rounded-md overflow-hidden">
                    <video 
                      src={candidate.videoIntro} 
                      autoPlay 
                      muted
                      loop
                      className="w-full h-auto"
                      onMouseEnter={() => setIsVideoPlaying(true)}
                      onMouseLeave={() => setIsVideoPlaying(false)}
                    >
                      Your browser does not support video playback.
                    </video>
                  </div>
                </HoverCardContent>
              </HoverCard>
              <h2 className="text-xl font-bold">{candidate.name}</h2>
              <p className="text-muted-foreground">{candidate.jobRole}</p>
              
              <div className="mt-3 flex justify-center">
                <MatchScoreRing score={candidate.matchScore} size="md" />
              </div>
            </div>
            
            <Separator className="my-4" />
            
            {/* Show interview status if scheduled */}
            {isAIInterviewScheduled && (
              <div className="mt-4 p-3 bg-muted rounded-md text-sm">
                <div className="flex items-center text-muted-foreground">
                  <Video className="h-4 w-4 mr-2" />
                  <span>AI Interview scheduled</span>
                </div>
                <p className="mt-1 font-medium">
                  Expires: {interviewDate?.toLocaleDateString()}
                </p>
              </div>
            )}
            
            <div className="space-y-4 mt-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{candidate.location}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${candidate.email}`} className="text-primary hover:underline">
                  {candidate.email || `${candidate.name.toLowerCase().replace(/\s+/g, '.')}@example.com`}
                </a>
              </div>
              
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{candidate.phone || "+1 (555) 123-4567"}</span>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">Skills</h3>
              <div className="flex flex-wrap gap-1.5">
                {candidate.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">Video Introduction</h3>
              <div className="rounded-md overflow-hidden aspect-video bg-muted">
                <video 
                  src={candidate.videoIntro} 
                  controls 
                  poster={candidate.avatar}
                  className="w-full h-full object-cover"
                >
                  Your browser does not support video playback.
                </video>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Right Column - Candidate Details */}
        <Card className="lg:col-span-2">
          <div className="p-6">
            <Tabs defaultValue="profile">
              <TabsList className="mb-4">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="assessment">AI Assessment</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">About</h3>
                  <p className="text-muted-foreground">
                    {candidate.about || "No information provided."}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Experience</h3>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Senior Developer</p>
                        <p className="text-muted-foreground text-sm">TechCorp Inc</p>
                        <p className="text-muted-foreground text-sm">2020 - Present</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Developer</p>
                        <p className="text-muted-foreground text-sm">StartUp Labs</p>
                        <p className="text-muted-foreground text-sm">2018 - 2020</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Education</h3>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <School className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Computer Science, BSc</p>
                        <p className="text-muted-foreground text-sm">University of Technology</p>
                        <p className="text-muted-foreground text-sm">2014 - 2018</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="experience">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Work History</h3>
                    <div className="space-y-6">
                      <div className="relative border-l pl-6 pb-6 ml-3">
                        <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <Briefcase className="h-3 w-3 text-white" />
                        </div>
                        <h4 className="text-base font-medium">Senior Developer</h4>
                        <p className="text-sm text-muted-foreground">TechCorp Inc • 2020 - Present</p>
                        <p className="mt-2">
                          Led a team of 5 developers working on the company's flagship product. 
                          Implemented CI/CD pipelines and improved performance by 40%.
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          <Badge variant="outline">React</Badge>
                          <Badge variant="outline">Node.js</Badge>
                          <Badge variant="outline">TypeScript</Badge>
                        </div>
                      </div>
                      
                      <div className="relative border-l pl-6 ml-3">
                        <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                          <Briefcase className="h-3 w-3 text-muted-foreground" />
                        </div>
                        <h4 className="text-base font-medium">Developer</h4>
                        <p className="text-sm text-muted-foreground">StartUp Labs • 2018 - 2020</p>
                        <p className="mt-2">
                          Developed and maintained web applications for various clients.
                          Focused on front-end development and responsive design.
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          <Badge variant="outline">JavaScript</Badge>
                          <Badge variant="outline">HTML/CSS</Badge>
                          <Badge variant="outline">Vue.js</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Add Certifications section above Projects */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Certifications</h3>
                    <div className="space-y-4">
                      <div className="relative border-l pl-6 pb-6 ml-3">
                        <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <Award className="h-3 w-3 text-white" />
                        </div>
                        <h4 className="text-base font-medium">AWS Certified Developer</h4>
                        <p className="text-sm text-muted-foreground">Amazon Web Services • Jan 2022 - Jan 2025</p>
                        <p className="mt-1 text-sm">Credential ID: AWS-DEV-12345</p>
                      </div>
                      
                      <div className="relative border-l pl-6 ml-3">
                        <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                          <Award className="h-3 w-3 text-muted-foreground" />
                        </div>
                        <h4 className="text-base font-medium">React Certification</h4>
                        <p className="text-sm text-muted-foreground">Meta • Jun 2021 - No Expiration</p>
                        <p className="mt-1 text-sm">Credential ID: REACT-ADV-7890</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Projects</h3>
                    <div className="space-y-4">
                      <Card className="p-4">
                        <h4 className="font-medium">E-commerce Platform Redesign</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Led the frontend development of a major e-commerce platform redesign,
                          resulting in 25% increase in conversion rates.
                        </p>
                      </Card>
                      
                      <Card className="p-4">
                        <h4 className="font-medium">Real-time Analytics Dashboard</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Developed a real-time analytics dashboard using React and WebSockets
                          that is now used by over 500 companies.
                        </p>
                      </Card>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Update AI Assessment tab to include Justification */}
              <TabsContent value="assessment">
                {candidate.hasAIAssessment ? (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">AI Assessment Report</h3>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setShowDiscardConfirmDialog(true)}
                        className="gap-1"
                      >
                        <Sparkles className="h-4 w-4" />
                        Regenerate
                      </Button>
                    </div>
                    <AIGenerated>
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-3">Skills Assessment</h3>
                          <div className="space-y-3">
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm">Technical Skills</span>
                                <span className="text-sm font-medium">92%</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div className="bg-primary h-2 rounded-full" style={{ width: '92%' }}></div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm">Communication</span>
                                <span className="text-sm font-medium">85%</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }}></div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm">Problem Solving</span>
                                <span className="text-sm font-medium">90%</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div className="bg-primary h-2 rounded-full" style={{ width: '90%' }}></div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm">Team Collaboration</span>
                                <span className="text-sm font-medium">88%</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div className="bg-primary h-2 rounded-full" style={{ width: '88%' }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-3">AI Summary</h3>
                          <p className="text-muted-foreground">
                            {candidate.name} is a highly skilled developer with over 6 years of professional experience. 
                            Their technical skills are exceptionally strong, particularly in React and TypeScript. 
                            Based on resume analysis and video screening, they demonstrate clear communication skills 
                            and a strong problem-solving approach. Their experience leading teams indicates good 
                            management potential, and their project history shows a consistent ability to deliver 
                            results that impact business metrics positively.
                          </p>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-3">Job Fit Analysis</h3>
                          <div className="space-y-4">
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="font-medium">Technical Requirements Match</span>
                                <div className="flex items-center">
                                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                  <Star className="h-4 w-4 text-muted" />
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                Meets 8/10 required technical skills and 5/6 preferred skills.
                              </p>
                            </div>
                            
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="font-medium">Experience Level Match</span>
                                <div className="flex items-center">
                                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                Exceeds the required experience level for this position.
                              </p>
                            </div>
                            
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="font-medium">Cultural Fit</span>
                                <div className="flex items-center">
                                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                  <Star className="h-4 w-4 text-muted" />
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                Based on video analysis and communication style, likely a strong cultural fit.
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Add Justification section */}
                        <div className="bg-muted/30 p-4 rounded-lg border">
                          <h3 className="text-lg font-medium mb-2">Justification for Fit</h3>
                          <p className="text-sm text-muted-foreground">
                            {candidate.name} is a strong fit for this Senior Frontend Developer position for several key reasons:
                          </p>
                          <ul className="mt-2 space-y-2 list-disc pl-5 text-sm text-muted-foreground">
                            <li>
                              <span className="font-medium">Experience alignment:</span> Their 6+ years of experience, including 3 years in a senior role, exceeds the job requirements of 5+ years.
                            </li>
                            <li>
                              <span className="font-medium">Technical expertise:</span> They have demonstrated mastery in React, TypeScript, and state management libraries which are core requirements for this role.
                            </li>
                            <li>
                              <span className="font-medium">Leadership capability:</span> Their experience leading a team of 5 developers matches our need for someone who can mentor junior developers.
                            </li>
                            <li>
                              <span className="font-medium">Project impact:</span> Their work on e-commerce platforms and analytics dashboards directly relates to our product domain.
                            </li>
                            <li>
                              <span className="font-medium">Communication skills:</span> Based on video analysis, they articulate technical concepts clearly which will be valuable for cross-team collaboration.
                            </li>
                          </ul>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-3">Recommended Next Steps</h3>
                          <ul className="space-y-2 ml-5 list-disc text-muted-foreground">
                            <li>Schedule a technical interview with the senior development team</li>
                            <li>Request code samples for evaluation</li>
                            <li>Prepare specific questions about leadership experience</li>
                          </ul>
                        </div>
                      </div>
                    </AIGenerated>
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <div className="mb-4">
                      <Sparkles className="h-12 w-12 text-primary mx-auto mb-3" />
                      <h3 className="text-lg font-medium">No AI Assessment Yet</h3>
                      <p className="text-muted-foreground mt-2">
                        Generate an AI assessment to evaluate this candidate against the job requirements
                      </p>
                    </div>
                    <Button 
                      onClick={handleGenerateAssessment} 
                      disabled={generatingAssessment}
                      className="flex items-center gap-2"
                    >
                      {generatingAssessment ? "Generating..." : "Generate AI Assessment Report"}
                      <Sparkles className={`h-4 w-4 ${generatingAssessment ? 'animate-pulse' : ''}`} />
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </Card>
      </div>
      
      {/* Teams Meeting Dialog with Time Zone Selection */}
      <Dialog open={showTeamsDialog} onOpenChange={setShowTeamsDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Face-to-Face Interview</DialogTitle>
            <DialogDescription>
              Schedule a Microsoft Teams meeting with {candidate.name} and the hiring manager.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-2">
            {/* Time input */}
            <div>
              <label htmlFor="meeting-time" className="text-sm font-medium block mb-1">
                Interview Date & Time
              </label>
              <input
                id="meeting-time"
                type="datetime-local"
                className="w-full border rounded-md p-2"
                value={meetingTime}
                onChange={(e) => setMeetingTime(e.target.value)}
              />
            </div>
            
            {/* Time zone selection */}
            <div>
              <label htmlFor="timezone" className="text-sm font-medium block mb-1">
                Time Zone
              </label>
              <Select value={selectedTimeZone} onValueChange={setSelectedTimeZone}>
                <SelectTrigger id="timezone" className="w-full">
                  <SelectValue placeholder="Select time zone" />
                </SelectTrigger>
                <SelectContent>
                  {timeZones.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Selected time will be shown to the candidate in their local time
              </p>
            </div>
            
            <div className="p-4 border rounded-md bg-muted/30 mt-2">
              <h4 className="font-medium mb-2">Generated Meeting Link</h4>
              <div className="flex">
                <input 
                  type="text"
                  readOnly
                  value={meetingTime && selectedTimeZone ? meetingLink || "Click Generate to create link" : "Please select time and time zone first"}
                  className="flex-1 p-2 text-sm bg-background border rounded-l-md"
                />
                <Button
                  variant="secondary"
                  className="rounded-l-none"
                  onClick={() => {
                    if (meetingTime && selectedTimeZone) {
                      generateTeamsMeetingLink();
                      copyToClipboard(meetingLink);
                    } else {
                      toast({
                        title: "Missing information",
                        description: "Please select both time and time zone before generating a link",
                      });
                    }
                  }}
                >
                  {meetingLink ? "Copy" : "Generate"}
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowTeamsDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                if (meetingTime && selectedTimeZone) {
                  toast({
                    title: "Invitation Sent",
                    description: `Interview invitation has been sent for ${new Date(meetingTime).toLocaleString()} (${selectedTimeZone})`
                  });
                  setShowTeamsDialog(false);
                } else {
                  toast({
                    title: "Missing information",
                    description: "Please select both time and time zone"
                  });
                }
              }}
            >
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Move Candidate Dialog */}
      <Dialog open={showMoveDialog} onOpenChange={setShowMoveDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Move Candidate to Another Job</DialogTitle>
            <DialogDescription>
              Select a job to move this candidate to. This will trigger a new AI screening.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-2">
            <div className="space-y-3">
              {jobListings.map((job) => (
                <div key={job.id} className="flex items-center space-x-2 p-2 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedJob(job.id)}
                >
                  <Checkbox 
                    id={`job-${job.id}`} 
                    checked={selectedJob === job.id}
                    onCheckedChange={() => setSelectedJob(job.id)}
                  />
                  <label htmlFor={`job-${job.id}`} className="flex-1 cursor-pointer">
                    <div className="font-medium">{job.title}</div>
                    <div className="text-xs text-muted-foreground">{job.company}</div>
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowMoveDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleMoveCandidate}
              disabled={!selectedJob}
            >
              Move & Reschedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Discard Assessment Dialog */}
      <AlertDialog open={showDiscardConfirmDialog} onOpenChange={setShowDiscardConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Regenerate AI Assessment?</AlertDialogTitle>
            <AlertDialogDescription>
              This will discard the current assessment and generate a new one. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRegenerateAssessment}>Proceed</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CandidateProfile;
