
import { ArrowUpRight, Briefcase, Clock, Inbox } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useJobListings } from "@/hooks/recruiter/useJobListings";
import { useScreeningData } from "@/hooks/recruiter/useScreeningData";

export const StatCards = () => {
  const { jobsData } = useJobListings();
  const { getCandidateCountByStatus } = useScreeningData();
  
  // Count active jobs
  const activeJobs = jobsData?.length || 0;
  
  // Get candidate counts
  const newApplicationsCount = getCandidateCountByStatus('pending') || 0;
  const waitingReviewCount = getCandidateCountByStatus('screening') || 0;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="ats-stat-card">
        <div className="flex justify-between items-center p-6">
          <div className="text-sm font-medium text-muted-foreground">Active Jobs</div>
          <Briefcase className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="px-6 pb-6 mt-2 flex items-baseline justify-between">
          <div className="text-2xl font-semibold">{activeJobs}</div>
          <Link to="/recruiter/jobs" className="text-xs text-primary flex items-center">
            View all <ArrowUpRight className="ml-1 h-3 w-3" />
          </Link>
        </div>
      </Card>

      <Card className="ats-stat-card">
        <div className="flex justify-between items-center p-6">
          <div className="text-sm font-medium text-muted-foreground">New Applications</div>
          <Inbox className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="px-6 pb-6 mt-2 flex items-baseline justify-between">
          <div className="text-2xl font-semibold">{newApplicationsCount}</div>
          <Badge variant="outline" className="text-xs">
            <Clock className="h-3 w-3 mr-1" />
            Today
          </Badge>
        </div>
      </Card>

      <Card className="ats-stat-card">
        <div className="flex justify-between items-center p-6">
          <div className="text-sm font-medium text-muted-foreground">Waiting Review</div>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="px-6 pb-6 mt-2 flex items-baseline justify-between">
          <div className="text-2xl font-semibold">{waitingReviewCount}</div>
          <Link to="/recruiter/screening" className="text-xs text-primary flex items-center">
            Start <ArrowUpRight className="ml-1 h-3 w-3" />
          </Link>
        </div>
      </Card>
    </div>
  );
};
