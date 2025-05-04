
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Users } from "lucide-react";
import { useScreeningData } from "@/hooks/recruiter/useScreeningData";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

interface ShortlistedJobStat {
  jobTitle: string;
  count: number;
  jobId?: string;
}

export const ShortlistedTalent = () => {
  const { screeningData } = useScreeningData();
  const [shortlistedJobs, setShortlistedJobs] = useState<ShortlistedJobStat[]>([]);

  useEffect(() => {
    if (screeningData && screeningData.length > 0) {
      // Filter shortlisted candidates
      const shortlisted = screeningData.filter(candidate => 
        candidate.status === 'shortlisted' || candidate.status === 'interview'
      );
      
      // Group by job title
      const jobGroups = shortlisted.reduce((acc: Record<string, ShortlistedJobStat>, candidate) => {
        const jobTitle = candidate.position || 'Unknown Position';
        // Try to extract job ID if position is in format "jobId-jobTitle"
        const jobId = candidate.position?.split('-')[0];
        
        if (!acc[jobTitle]) {
          acc[jobTitle] = {
            jobTitle,
            count: 0,
            jobId
          };
        }
        
        acc[jobTitle].count += 1;
        return acc;
      }, {});
      
      // Convert to array and sort by count
      const jobsArray = Object.values(jobGroups)
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);
      
      setShortlistedJobs(jobsArray);
    }
  }, [screeningData]);

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-medium">Shortlisted Talent</h3>
          <Users className="h-4 w-4 text-muted-foreground" />
        </div>
        
        {shortlistedJobs.length > 0 ? (
          <div className="space-y-3">
            {shortlistedJobs.map((job, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted hover:bg-opacity-30 transition-colors">
                <div className="h-8 w-8 rounded-full bg-primary bg-opacity-10 flex items-center justify-center">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{job.jobTitle}</div>
                  <div className="text-xs text-muted-foreground">{job.count} candidate{job.count !== 1 ? 's' : ''}</div>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                  <Link to={job.jobId ? `/recruiter/jobs/${job.jobId}/applicants` : "/recruiter/candidates"}>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            <Users className="h-10 w-10 mx-auto mb-2 text-muted-foreground/60" />
            <p>No shortlisted candidates yet</p>
            <Button variant="outline" size="sm" className="mt-4" asChild>
              <Link to="/recruiter/screening">Review Candidates</Link>
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};
