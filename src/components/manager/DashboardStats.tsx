
import { ArrowUpRight, Briefcase, Users, Video } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useJobListings } from "@/hooks/recruiter/useJobListings";
import { useCandidatesData } from "@/hooks/recruiter/useCandidatesData";

export const DashboardStats = () => {
  const { jobs } = useJobListings({});
  const { candidates } = useCandidatesData();
  
  // Count open positions and candidates
  const openPositionsCount = jobs?.length || 0;
  const activeCandidatesCount = candidates?.length || 0;
  
  // For interviews, we would ideally fetch from an API but will use placeholder for now
  const interviewsCount = 16;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="ats-stat-card">
        <div className="flex justify-between items-center p-6">
          <div className="text-sm font-medium text-muted-foreground">Open Positions</div>
          <Briefcase className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="px-6 pb-6 mt-2 flex items-baseline justify-between">
          <div className="text-2xl font-semibold">{openPositionsCount}</div>
          <Link to="/manager/jobs" className="text-xs text-primary flex items-center">
            View all <ArrowUpRight className="ml-1 h-3 w-3" />
          </Link>
        </div>
      </Card>

      <Card className="ats-stat-card">
        <div className="flex justify-between items-center p-6">
          <div className="text-sm font-medium text-muted-foreground">Active Candidates</div>
          <Users className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="px-6 pb-6 mt-2 flex items-baseline justify-between">
          <div className="text-2xl font-semibold">{activeCandidatesCount}</div>
          <Link to="/manager/candidates" className="text-xs text-primary flex items-center">
            View all <ArrowUpRight className="ml-1 h-3 w-3" />
          </Link>
        </div>
      </Card>

      <Card className="ats-stat-card">
        <div className="flex justify-between items-center p-6">
          <div className="text-sm font-medium text-muted-foreground">Interviews Scheduled</div>
          <Video className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="px-6 pb-6 mt-2 flex items-baseline justify-between">
          <div className="text-2xl font-semibold">{interviewsCount}</div>
          <Link to="/manager/interviews" className="text-xs text-primary flex items-center">
            View all <ArrowUpRight className="ml-1 h-3 w-3" />
          </Link>
        </div>
      </Card>
    </div>
  );
};
