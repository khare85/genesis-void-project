import { ArrowUpRight, Briefcase, Clock, Inbox, CheckSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useJobListings } from "@/hooks/recruiter/useJobListings";
import { useScreeningData } from "@/hooks/recruiter/useScreeningData";
export const StatCards = () => {
  const {
    jobsData
  } = useJobListings();
  const {
    getCandidateCountByStatus
  } = useScreeningData();

  // Count active jobs
  const activeJobs = jobsData?.length || 0;

  // Get candidate counts
  const newApplicationsCount = getCandidateCountByStatus('pending') || 0;
  const waitingReviewCount = getCandidateCountByStatus('screening') || 0;
  const screenedTodayCount = 12; // This would typically come from an API/hook

  return <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-shadow duration-300 border-0 transform transition-all hover:-translate-y-1 rounded-2xl bg-white">
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium text-muted-foreground">Active Jobs</div>
          <Briefcase className="h-4 w-4 text-blue-500" />
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <div className="text-2xl font-semibold">{activeJobs}</div>
          <Link to="/recruiter/jobs" className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-600 px-3 py-1 rounded-full flex items-center transition-colors">
            View all <ArrowUpRight className="ml-1 h-3 w-3" />
          </Link>
        </div>
      </Card>

      <Card className="p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-shadow duration-300 bg-white/50 border-0 transform transition-all hover:-translate-y-1">
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium text-muted-foreground">New Applications</div>
          <Inbox className="h-4 w-4 text-indigo-500" />
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <div className="text-2xl font-semibold">{newApplicationsCount}</div>
          <Badge variant="outline" className="text-xs bg-indigo-100 text-indigo-600">
            <Clock className="h-3 w-3 mr-1" />
            Today
          </Badge>
        </div>
      </Card>

      <Card className="p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-shadow duration-300 bg-white/50 border-0 transform transition-all hover:-translate-y-1">
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium text-muted-foreground">Waiting Review</div>
          <Clock className="h-4 w-4 text-purple-500" />
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <div className="text-2xl font-semibold">{waitingReviewCount}</div>
          <Link to="/recruiter/screening" className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-600 px-3 py-1 rounded-full flex items-center transition-colors">
            Start <ArrowUpRight className="ml-1 h-3 w-3" />
          </Link>
        </div>
      </Card>

      <Card className="p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-shadow duration-300 bg-white/50 border-0 transform transition-all hover:-translate-y-1">
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium text-muted-foreground">Screened Today</div>
          <CheckSquare className="h-4 w-4 text-sky-500" />
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <div className="text-2xl font-semibold">{screenedTodayCount}</div>
          <Badge variant="outline" className="text-xs bg-sky-100 text-sky-600">
            <Clock className="h-3 w-3 mr-1" />
            Today
          </Badge>
        </div>
      </Card>
    </div>;
};