
import React from "react";
import { Link } from "react-router-dom";
import { Mail, Calendar, Play } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import MatchScoreRing from "@/components/shared/MatchScoreRing";
import { ScreeningCandidate } from "@/types/screening";
import { getStatusBadge } from "./utils/applicantUtils";
import { StageProgress } from "./StageProgress";
import { VideoPreview } from "./VideoPreview";

interface ApplicantCardProps {
  applicant: ScreeningCandidate;
}

export const ApplicantCard: React.FC<ApplicantCardProps> = ({ applicant }) => {
  return (
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
            <Link
              to={`/recruiter/candidates/${applicant.candidate_id}`}
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
                title="Schedule"
              >
                <Calendar className="h-4 w-4" />
              </Button>
            </div>
            <Button size="sm" variant="outline" asChild>
              <Link to={`/recruiter/candidates/${applicant.candidate_id}`}>
                View Profile
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
