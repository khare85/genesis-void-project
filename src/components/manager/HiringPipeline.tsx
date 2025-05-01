
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useJobListings } from "@/hooks/recruiter/useJobListings";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface JobWithApplicantCount {
  id: string;
  title: string;
  applicants: number;
  progress: number;
  color: string;
}

const COLORS = [
  "bg-primary",
  "bg-blue-400",
  "bg-orange-400",
  "bg-green-400",
  "bg-purple-400",
  "bg-yellow-400"
];

export const HiringPipeline = () => {
  const { jobsData, isLoading } = useJobListings();
  const [pipelineJobs, setPipelineJobs] = useState<JobWithApplicantCount[]>([]);

  useEffect(() => {
    if (jobsData && jobsData.length > 0) {
      // Get top 4 jobs with most applicants
      const topJobs = jobsData
        .filter(job => job.status === "active") // Only active jobs
        .sort((a, b) => (b.applicants || 0) - (a.applicants || 0))
        .slice(0, 4)
        .map((job, index) => {
          // Calculate a fake progress percentage based on job posting date
          const daysActive = Math.floor((Date.now() - new Date(job.posteddate || Date.now()).getTime()) / (1000 * 60 * 60 * 24));
          const progress = Math.min(Math.max(daysActive * 5, 15), 75); // Between 15% and 75%

          return {
            id: job.id,
            title: job.title,
            applicants: job.applicants || 0,
            progress,
            color: COLORS[index % COLORS.length]
          };
        });

      setPipelineJobs(topJobs);
    }
  }, [jobsData]);

  return (
    <Card className="col-span-2">
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-medium">Hiring Pipeline</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/manager/jobs">View All Jobs</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Download CSV</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {isLoading ? (
          <div className="space-y-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="h-4 w-40 bg-muted rounded-full animate-pulse"></div>
                  <div className="h-4 w-20 bg-muted rounded-full animate-pulse"></div>
                </div>
                <div className="h-2 bg-muted rounded-full animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : pipelineJobs.length > 0 ? (
          <div className="space-y-5">
            {pipelineJobs.map((job) => (
              <div key={job.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <Link 
                    to={`/manager/jobs/${job.id}/applicants`} 
                    className="flex items-center hover:text-primary"
                  >
                    <div className={`w-2 h-2 ${job.color} rounded-full mr-2`}></div>
                    <span className="text-sm">{job.title}</span>
                  </Link>
                  <span className="text-xs font-medium">{job.applicants} candidates</span>
                </div>
                <Progress value={job.progress} className="h-2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            No active jobs in the pipeline
            <Button variant="outline" size="sm" className="mt-4" asChild>
              <Link to="/manager/jobs/create">Post New Job</Link>
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};
