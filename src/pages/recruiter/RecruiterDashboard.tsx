import { Button } from "@/components/ui/button";
import PageHeader from "@/components/shared/PageHeader";
import { FileCheck, Plus } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Link } from "react-router-dom";
import { StatCards } from "@/components/recruiter/StatCards";
import { RecentApplications } from "@/components/recruiter/RecentApplications";
import { ScreeningProgress } from "@/components/recruiter/ScreeningProgress";
import { ShortlistedTalent } from "@/components/recruiter/ShortlistedTalent";
import { AIRecommendations } from "@/components/recruiter/AIRecommendations";
import { TasksDueToday } from "@/components/recruiter/TasksDueToday";
const RecruiterDashboard = () => {
  const {
    user
  } = useAuth();
  return <div className="space-y-6 bg-blue-50">
      <PageHeader title={`Welcome back, ${user?.name.split(" ")[0]}`} description="Review candidates and screen applications" actions={<Button size="sm" asChild className="shadow-lg hover:shadow-xl transform transition-all hover:-translate-y-1 bg-primary hover:bg-primary/90 border-b-2 border-primary-foreground/20">
            <Link to="/recruiter/jobs/create" className="flex items-center gap-2 ">
              <Plus className="h-4 w-4" />
              Create Job
            </Link>
          </Button>} />

      <StatCards />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 bg-transparent">
        <RecentApplications />
        <ScreeningProgress />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <ShortlistedTalent />
        <AIRecommendations />
        <TasksDueToday />
      </div>
    </div>;
};
export default RecruiterDashboard;