
import { ArrowUpRight, Briefcase, Sparkles, Users, Video } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useOpenAICredits } from "@/hooks/useOpenAICredits";

export const DashboardStats = () => {
  const { data: credits, isLoading } = useOpenAICredits();

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="ats-stat-card">
        <div className="flex justify-between items-center p-6">
          <div className="text-sm font-medium text-muted-foreground">Open Positions</div>
          <Briefcase className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="px-6 pb-6 mt-2 flex items-baseline justify-between">
          <div className="text-2xl font-semibold">12</div>
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
          <div className="text-2xl font-semibold">84</div>
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
          <div className="text-2xl font-semibold">16</div>
          <Link to="/manager/interviews" className="text-xs text-primary flex items-center">
            View all <ArrowUpRight className="ml-1 h-3 w-3" />
          </Link>
        </div>
      </Card>

      <Card className="ats-stat-card">
        <div className="flex justify-between items-center p-6">
          <div className="text-sm font-medium text-muted-foreground">AI Credits</div>
          <Sparkles className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="px-6 pb-6 mt-2">
          {isLoading ? (
            <div className="text-2xl font-semibold">Loading...</div>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Balance:</span>
                <span className="text-xl font-semibold">${credits?.availableCredits.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Spend:</span>
                <span className="text-sm text-muted-foreground">${credits?.usedCredits.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-muted-foreground pt-1">
                <span>Total:</span>
                <span>${credits?.totalCredits.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
