
import React, { useState } from "react";
import { Mail, Calendar, ExternalLink, X } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { toast } from "sonner";
import MatchScoreRing from "@/components/shared/MatchScoreRing";
import { ScreeningCandidate } from "@/types/screening";
import { getStatusBadge } from "./utils/applicantUtils";
import { StageProgress } from "./StageProgress";
import { VideoPreview } from "./VideoPreview";
import { CandidateDetail } from "@/components/recruiter/screening/CandidateDetail";

interface ApplicantCardProps {
  applicant: ScreeningCandidate;
}

export const ApplicantCard: React.FC<ApplicantCardProps> = ({ applicant }) => {
  const [showDetail, setShowDetail] = useState(false);
  
  const handleStatusChange = (candidate: ScreeningCandidate, status: "approved" | "rejected") => {
    // This would normally update the status in the database
    toast({
      description: `${candidate.name} has been ${status}.`,
    });
  };
  
  return (
    <>
      <Card className="overflow-hidden">
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
              <button
                onClick={() => setShowDetail(true)}
                className="font-medium hover:text-primary hover:underline"
              >
                {applicant.name}
              </button>
              <p className="text-sm text-muted-foreground">{applicant.position}</p>
            </div>
            <div className="flex items-center gap-2">
              <MatchScoreRing score={applicant.matchScore} size="sm" />
              <span className="text-sm font-medium">{applicant.matchScore}%</span>
            </div>
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
            
            <StageProgress stage={applicant.stage || 0} />
            
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
                  title="Schedule Interview"
                >
                  <Calendar className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  title="View Full Profile"
                  asChild
                >
                  <a href={`/recruiter/candidates/${applicant.id}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                  title="Reject Candidate"
                  onClick={() => handleStatusChange(applicant, "rejected")}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {showDetail && (
        <CandidateDetail
          candidate={applicant}
          onClose={() => setShowDetail(false)}
          onStatusChange={handleStatusChange}
        />
      )}
    </>
  );
};
