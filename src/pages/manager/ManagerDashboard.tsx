
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/shared/PageHeader";
import { Briefcase, Download } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Link } from "react-router-dom";
import { DashboardStats } from "@/components/manager/DashboardStats";
import { HiringPipeline } from "@/components/manager/HiringPipeline";
import { HiringAnalytics } from "@/components/manager/HiringAnalytics";
import { RecentInterviews } from "@/components/manager/RecentInterviews";
import { AIManagerRecommendation } from "@/components/manager/AIManagerRecommendation";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

const ManagerDashboard = () => {
  const { user } = useAuth();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadReport = () => {
    setIsDownloading(true);
    
    // Simulate report generation
    setTimeout(() => {
      setIsDownloading(false);
      toast({
        title: "Report downloaded",
        description: "Your hiring dashboard report has been downloaded successfully.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.name ? user.name.split(" ")[0] : 'Manager'}`}
        description="Manage your hiring activities and track your team's progress"
        actions={
          <>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1.5" 
              onClick={handleDownloadReport}
              disabled={isDownloading}
            >
              <Download className="h-4 w-4" />
              {isDownloading ? 'Generating...' : 'Reports'}
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
        <RecentInterviews />
        <AIManagerRecommendation />
      </div>
    </div>
  );
};

export default ManagerDashboard;
