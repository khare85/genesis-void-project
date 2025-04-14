import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/shared/PageHeader";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Users, 
  Search, 
  Filter, 
  MoreHorizontal,
  Mail,
  Calendar,
  FileText,
  Phone,
  ChevronDown,
  Play,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import MatchScoreRing from "@/components/shared/MatchScoreRing";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Sample data - export it so CandidateProfile can use it
export const candidatesData = [
  {
    id: 1,
    name: "Alex Thompson",
    position: "Senior Frontend Developer",
    email: "alex.thompson@example.com",
    phone: "+1 (555) 123-4567",
    status: "shortlisted",
    matchScore: 92,
    appliedDate: "2025-04-02",
    lastActivity: "Interview scheduled",
    resume: "/resume/alex-thompson.pdf",
    experience: "7 years",
    skills: ["React", "TypeScript", "GraphQL", "Tailwind CSS"],
    education: "BS Computer Science, Stanford University",
    source: "LinkedIn",
    profilePic: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952",
    videoIntro: "https://example.com/videos/alex-thompson-intro.mp4",
    location: "San Francisco, CA",
    salary: "$120,000 - $140,000",
    availability: "2 weeks notice",
    summary: "Experienced frontend developer with a strong focus on React and TypeScript. Passionate about creating performant and accessible user interfaces.",
  },
  {
    id: 2,
    name: "Jamie Rivera",
    position: "Backend Developer",
    email: "jamie.rivera@example.com",
    phone: "+1 (555) 987-6543",
    status: "new",
    matchScore: 87,
    appliedDate: "2025-04-05",
    lastActivity: "Application received",
    resume: "/resume/jamie-rivera.pdf",
    experience: "5 years",
    skills: ["Node.js", "Express", "MongoDB", "AWS"],
    education: "MS Software Engineering, MIT",
    source: "Indeed",
    profilePic: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    videoIntro: "https://example.com/videos/jamie-rivera-intro.mp4",
    location: "Boston, MA",
    salary: "$110,000 - $130,000",
    availability: "Immediate",
    summary: "Backend developer specializing in Node.js and cloud infrastructure. Strong problem-solving skills with a focus on scalable architectures.",
  },
  {
    id: 3,
    name: "Taylor Wright",
    position: "Full Stack Developer",
    email: "taylor.wright@example.com",
    phone: "+1 (555) 456-7890",
    status: "interviewed",
    matchScore: 90,
    appliedDate: "2025-04-01",
    lastActivity: "Technical interview completed",
    resume: "/resume/taylor-wright.pdf",
    experience: "4 years",
    skills: ["JavaScript", "React", "Node.js", "PostgreSQL"],
    education: "BS Computer Engineering, UC Berkeley",
    source: "Referral",
    profilePic: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    videoIntro: "https://example.com/videos/taylor-wright-intro.mp4",
    location: "Austin, TX",
    salary: "$105,000 - $125,000",
    availability: "3 weeks notice",
    summary: "Full stack developer with experience in both frontend and backend technologies. Passionate about building end-to-end solutions that solve real business problems.",
  },
  {
    id: 4,
    name: "Morgan Kelly",
    position: "UI/UX Designer",
    email: "morgan.kelly@example.com",
    phone: "+1 (555) 789-0123",
    status: "rejected",
    matchScore: 68,
    appliedDate: "2025-03-30",
    lastActivity: "Rejected after portfolio review",
    resume: "/resume/morgan-kelly.pdf",
    experience: "3 years",
    skills: ["Figma", "Adobe XD", "UI/UX Research", "Wireframing"],
    education: "BFA Design, RISD",
    source: "Company Website",
    profilePic: "https://images.unsplash.com/photo-1518005020951-eccb494ad742",
    videoIntro: "https://example.com/videos/morgan-kelly-intro.mp4",
    location: "New York, NY",
    salary: "$95,000 - $115,000",
    availability: "2 weeks notice",
    summary: "Creative UI/UX designer with a background in fine arts. Focused on creating intuitive and visually appealing user experiences.",
  },
  {
    id: 5,
    name: "Jordan Patel",
    position: "DevOps Engineer",
    email: "jordan.patel@example.com",
    phone: "+1 (555) 234-5678",
    status: "new",
    matchScore: 85,
    appliedDate: "2025-04-06",
    lastActivity: "Application received",
    resume: "/resume/jordan-patel.pdf",
    experience: "6 years",
    skills: ["Docker", "Kubernetes", "Jenkins", "Terraform"],
    education: "MS Computer Science, Georgia Tech",
    source: "StackOverflow",
    profilePic: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1",
    videoIntro: "https://example.com/videos/jordan-patel-intro.mp4",
    location: "Seattle, WA",
    salary: "$115,000 - $135,000",
    availability: "4 weeks notice",
    summary: "DevOps engineer with a focus on containerization and CI/CD pipelines. Experienced in cloud infrastructure and automation.",
  },
  {
    id: 6,
    name: "Casey Zhang",
    position: "Mobile Developer",
    email: "casey.zhang@example.com",
    phone: "+1 (555) 345-6789",
    status: "shortlisted",
    matchScore: 94,
    appliedDate: "2025-04-03",
    lastActivity: "Technical assessment completed",
    resume: "/resume/casey-zhang.pdf",
    experience: "8 years",
    skills: ["React Native", "Swift", "Kotlin", "Firebase"],
    education: "BS Mobile App Development, USC",
    source: "LinkedIn",
    profilePic: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    videoIntro: "https://example.com/videos/casey-zhang-intro.mp4",
    location: "Los Angeles, CA",
    salary: "$125,000 - $145,000",
    availability: "Immediate",
    summary: "Experienced mobile developer with expertise in both iOS and Android development. Strong focus on creating performant and user-friendly mobile applications.",
  },
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

const RecruiterCandidates: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  
  // Filter candidates based on search query and status filter
  const filteredCandidates = candidatesData.filter((candidate) => {
    const matchesSearch = 
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      candidate.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (filter === "all") return matchesSearch;
    return matchesSearch && candidate.status === filter;
  });

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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Candidates"
        description="Manage and review job applicants"
        icon={<Users className="h-6 w-6" />}
        actions={
          <Button asChild>
            <Link to="/recruiter/candidates/add">Add Candidate</Link>
          </Button>
        }
      />
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>All Candidates</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/recruiter/candidates/export">Export</Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex w-full max-w-sm items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search candidates..."
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
                  <DropdownMenuCheckboxItem 
                    checked={filter === "rejected"} 
                    onCheckedChange={() => setFilter("rejected")}
                  >
                    Rejected
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <Tabs defaultValue="table" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="table">Table View</TabsTrigger>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="table" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Candidate</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Match</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Applied</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCandidates.length > 0 ? (
                      filteredCandidates.map((candidate) => (
                        <TableRow key={candidate.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <HoverCard>
                                <HoverCardTrigger asChild>
                                  <div className="cursor-pointer hover:opacity-90 transition-opacity">
                                    <Avatar className="h-10 w-10 border">
                                      <AvatarImage src={candidate.profilePic} alt={candidate.name} />
                                      <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                  </div>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-80 p-0">
                                  <VideoPreview src={candidate.videoIntro} />
                                  <div className="p-3">
                                    <h4 className="font-semibold">{candidate.name}</h4>
                                    <p className="text-sm text-muted-foreground">{candidate.position}</p>
                                  </div>
                                </HoverCardContent>
                              </HoverCard>
                              <Link
                                to={`/recruiter/candidates/${candidate.id}`}
                                className="hover:text-primary hover:underline"
                              >
                                {candidate.name}
                              </Link>
                            </div>
                          </TableCell>
                          <TableCell>{candidate.position}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <MatchScoreRing score={candidate.matchScore} size="sm" />
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(candidate.status)}</TableCell>
                          <TableCell>
                            {new Date(candidate.appliedDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
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
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                title="Resume"
                              >
                                <FileText className="h-4 w-4" />
                                <span className="sr-only">Resume</span>
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
                                    <Link to={`/recruiter/candidates/${candidate.id}`}>View Profile</Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>Edit Details</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive">
                                    Remove Candidate
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
                          No candidates found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="grid">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredCandidates.map((candidate) => (
                  <Card key={candidate.id} className="overflow-hidden">
                    <CardHeader className="bg-muted/50 pb-2">
                      <div className="flex items-center gap-4">
                        <HoverCard>
                          <HoverCardTrigger asChild>
                            <div className="cursor-pointer hover:opacity-90 transition-opacity">
                              <Avatar className="h-14 w-14 border">
                                <AvatarImage src={candidate.profilePic} alt={candidate.name} />
                                <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                            </div>
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80 p-0">
                            <VideoPreview src={candidate.videoIntro} />
                            <div className="p-3">
                              <h4 className="font-semibold">{candidate.name}</h4>
                              <p className="text-sm text-muted-foreground">{candidate.position}</p>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                        <div className="flex-1">
                          <Link
                            to={`/recruiter/candidates/${candidate.id}`}
                            className="font-medium hover:text-primary hover:underline"
                          >
                            {candidate.name}
                          </Link>
                          <p className="text-sm text-muted-foreground">{candidate.position}</p>
                        </div>
                        <MatchScoreRing score={candidate.matchScore} size="sm" />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="text-sm">{getStatusBadge(candidate.status)}</div>
                          <div className="text-xs text-muted-foreground">
                            Applied: {new Date(candidate.appliedDate).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {candidate.skills.slice(0, 3).map((skill) => (
                            <Badge key={skill} variant="outline">
                              {skill}
                            </Badge>
                          ))}
                          {candidate.skills.length > 3 && (
                            <Badge variant="outline">+{candidate.skills.length - 3}</Badge>
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
                              title="Phone"
                            >
                              <Phone className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button size="sm" variant="outline" asChild>
                            <Link to={`/recruiter/candidates/${candidate.id}`}>
                              View Profile
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {filteredCandidates.length === 0 && (
                  <div className="col-span-full flex h-24 items-center justify-center text-center">
                    No candidates found.
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

export default RecruiterCandidates;
