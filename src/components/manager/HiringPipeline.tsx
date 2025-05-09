
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
import { toast } from "@/hooks/use-toast";

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
          const applicants = job.applicants || 0;
          
          // Find max applicants count for scaling
          const maxApplicants = Math.max(...jobsData.map(j => j.applicants || 0));
          
          // Calculate progress based on number of applicants
          // Ensure minimum 10% for jobs with at least 1 applicant, maximum 90%
          let progress = 0;
          if (applicants > 0) {
            // If there's only one job with applicants, give it 50%
            if (maxApplicants === applicants && jobsData.filter(j => (j.applicants || 0) > 0).length === 1) {
              progress = 50;
            } else {
              // Otherwise scale according to max applicants, with a minimum of 10% and max of 90%
              progress = Math.max(10, Math.min(90, (applicants / Math.max(maxApplicants, 1)) * 100));
            }
          }

          return {
            id: job.id,
            title: job.title,
            applicants: applicants,
            progress,
            color: COLORS[index % COLORS.length]
          };
        });

      setPipelineJobs(topJobs);
    }
  }, [jobsData]);

  const handleDownloadCSV = () => {
    toast({
      title: "Download started",
      description: "Pipeline data is being downloaded as CSV"
    });
  };

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
              <DropdownMenuItem onClick={handleDownloadCSV}>Download CSV</DropdownMenuItem>
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
                    <div className={`w-2 h-2 ${job.applicants > 0 ? job.color : 'bg-gray-200'} rounded-full mr-2`}></div>
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
