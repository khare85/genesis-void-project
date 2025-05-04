
import { ArrowUpRight, Briefcase, Users, Video } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useJobListings } from "@/hooks/recruiter/useJobListings";
import { useCandidatesData } from "@/hooks/recruiter/useCandidatesData";

export const DashboardStats = () => {
  const { jobsData } = useJobListings();
  const { candidates } = useCandidatesData();
  
  // Count open positions and candidates
  const openPositionsCount = jobsData?.length || 0;
  const activeCandidatesCount = candidates?.length || 0;
  
  // For interviews, we would ideally fetch from an API but will use placeholder for now
  const interviewsCount = 16;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="p-6 shadow-sm bg-blue-50 border-blue-100">
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium text-muted-foreground">Open Positions</div>
          <Briefcase className="h-4 w-4 text-blue-500" />
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <div className="text-2xl font-semibold">{openPositionsCount}</div>
          <Link to="/manager/jobs" className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-600 px-3 py-1 rounded-full flex items-center transition-colors">
            View all <ArrowUpRight className="ml-1 h-3 w-3" />
          </Link>
        </div>
      </Card>

      <Card className="p-6 shadow-sm bg-indigo-50 border-indigo-100">
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium text-muted-foreground">Active Candidates</div>
          <Users className="h-4 w-4 text-indigo-500" />
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <div className="text-2xl font-semibold">{activeCandidatesCount}</div>
          <Link to="/manager/candidates" className="text-xs bg-indigo-100 hover:bg-indigo-200 text-indigo-600 px-3 py-1 rounded-full flex items-center transition-colors">
            View all <ArrowUpRight className="ml-1 h-3 w-3" />
          </Link>
        </div>
      </Card>

      <Card className="p-6 shadow-sm bg-purple-50 border-purple-100">
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium text-muted-foreground">Interviews Scheduled</div>
          <Video className="h-4 w-4 text-purple-500" />
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <div className="text-2xl font-semibold">{interviewsCount}</div>
          <Link to="/manager/interviews" className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-600 px-3 py-1 rounded-full flex items-center transition-colors">
            View all <ArrowUpRight className="ml-1 h-3 w-3" />
          </Link>
        </div>
      </Card>
    </div>
  );
};
