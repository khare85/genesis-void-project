
import { Link } from "react-router-dom";
import { Mail, Calendar, Users } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import MatchScoreRing from "@/components/shared/MatchScoreRing";
import { Applicant } from "@/hooks/recruiter/useJobApplicants";
import StageProgress from "./StageProgress";
import VideoPreview from "./VideoPreview";

interface ApplicantGridProps {
  applicants: Applicant[];
  isLoading: boolean;
}

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

const ApplicantGrid = ({ applicants, isLoading }: ApplicantGridProps) => {
  if (isLoading) {
    return null; // Loading state is handled by parent component
  }
  
  if (applicants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-center">
        <Users className="h-8 w-8 text-muted-foreground/50 mb-2" />
        <p>No applicants found.</p>
        <p className="text-sm text-muted-foreground mt-1">
          Share this job posting to attract more candidates.
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {applicants.map((applicant) => (
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
  );
};

export default ApplicantGrid;
