
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/shared/PageHeader";
import { Briefcase, Download } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Link } from "react-router-dom";
import { DashboardStats } from "@/components/manager/DashboardStats";
import { HiringPipeline } from "@/components/manager/HiringPipeline";
import { HiringAnalytics } from "@/components/manager/HiringAnalytics";
import { PendingApprovals } from "@/components/manager/PendingApprovals";
import { RecentInterviews } from "@/components/manager/RecentInterviews";
import { AIManagerRecommendation } from "@/components/manager/AIManagerRecommendation";

const ManagerDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.name.split(" ")[0]}`}
        description="Manage your hiring activities and track your team's progress"
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-4 w-4" />
              Reports
            </Button>
            <Button size="sm" asChild>
              <Link to="/manager/jobs/create" className="gap-1.5">
                <Briefcase className="h-4 w-4" />
                Post New Job
              </Link>
            </Button>
          </>
        }
      />

      <DashboardStats />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <HiringPipeline />
        <HiringAnalytics />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <PendingApprovals />
        <RecentInterviews />
        <AIManagerRecommendation />
      </div>
    </div>
  );
};

export default ManagerDashboard;
