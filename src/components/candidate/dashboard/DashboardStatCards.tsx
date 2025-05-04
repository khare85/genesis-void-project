
import React from 'react';
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowUpRight, Briefcase, CheckCircle2, Clock, FileText, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DashboardStatCardsProps {
  activeApplicationsCount: number;
  upcomingInterviews: number;
  completedInterviews: number;
  profileCompletion: number;
}

const DashboardStatCards: React.FC<DashboardStatCardsProps> = ({
  activeApplicationsCount,
  upcomingInterviews,
  completedInterviews,
  profileCompletion
}) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="p-4 bg-blue-50/50 border-blue-100">
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium text-muted-foreground">Active Applications</div>
          <Briefcase className="h-4 w-4 text-blue-500" />
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <div className="text-2xl font-semibold">{activeApplicationsCount}</div>
          <Link to="/candidate/applications" className="text-xs text-primary flex items-center">
            View all <ArrowUpRight className="ml-1 h-3 w-3" />
          </Link>
        </div>
      </Card>

      <Card className="p-4 bg-indigo-50/50 border-indigo-100">
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium text-muted-foreground">Upcoming Interviews</div>
          <Video className="h-4 w-4 text-indigo-500" />
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <div className="text-2xl font-semibold">{upcomingInterviews}</div>
          <Link to="/candidate/interviews" className="text-xs text-primary flex items-center">
            View all <ArrowUpRight className="ml-1 h-3 w-3" />
          </Link>
        </div>
      </Card>

      <Card className="p-4 bg-purple-50/50 border-purple-100">
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium text-muted-foreground">Completed Interviews</div>
          <CheckCircle2 className="h-4 w-4 text-purple-500" />
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <div className="text-2xl font-semibold">{completedInterviews}</div>
          <Badge variant="outline" className="text-xs">
            <Clock className="h-3 w-3 mr-1" />
            Last 30 days
          </Badge>
        </div>
      </Card>

      <Card className="p-4 bg-sky-50/50 border-sky-100">
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium text-muted-foreground">Profile Completion</div>
          <FileText className="h-4 w-4 text-sky-500" />
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <div className="text-2xl font-semibold">{profileCompletion}%</div>
          <Badge className="bg-amber-500 border-none text-white text-xs">Update</Badge>
        </div>
        <div className="mt-2 h-1.5 w-full bg-muted rounded-full overflow-hidden">
          <div className="bg-sky-500 h-full rounded-full" style={{
            width: `${profileCompletion}%`
          }}></div>
        </div>
      </Card>
    </div>
  );
};

export default DashboardStatCards;
