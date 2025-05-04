import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { FileCheck } from "lucide-react";
import AIGenerated from "@/components/shared/AIGenerated";
import { useJobListings } from "@/hooks/recruiter/useJobListings";
import { useEffect, useState } from "react";
import { useScreeningData } from "@/hooks/recruiter/useScreeningData";
import { Link } from "react-router-dom";
interface ScreeningStats {
  title: string;
  total: number;
  screened: number;
  progress: number;
}
export const ScreeningProgress = () => {
  const {
    jobsData
  } = useJobListings();
  const {
    screeningData
  } = useScreeningData();
  const [jobStats, setJobStats] = useState<ScreeningStats[]>([]);
  useEffect(() => {
    if (jobsData && jobsData.length > 0 && screeningData && screeningData.length > 0) {
      const jobMap = new Map();

      // Group candidates by job
      screeningData.forEach(candidate => {
        const jobId = candidate.position?.split('-')[0]; // Extract job ID from position if available
        if (!jobId) return;
        if (!jobMap.has(jobId)) {
          const job = jobsData.find(j => j.id === jobId);
          jobMap.set(jobId, {
            title: job?.title || 'Unknown Position',
            total: 0,
            screened: 0,
            progress: 0
          });
        }
        const stats = jobMap.get(jobId);
        stats.total += 1;

        // Count as screened if not pending
        if (candidate.status !== 'pending') {
          stats.screened += 1;
        }
      });

      // Calculate progress percentages
      const statsArray = Array.from(jobMap.values()).map(stat => ({
        ...stat,
        progress: Math.round(stat.screened / stat.total * 100) || 0
      }));

      // Sort by number of candidates, take top 3
      setJobStats(statsArray.sort((a, b) => b.total - a.total).slice(0, 3));
    }
  }, [jobsData, screeningData]);
  return <Card className="bg-white rounded-2xl">
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-medium">Screening Progress</h3>
          <FileCheck className="h-4 w-4 text-muted-foreground" />
        </div>
        
        <div className="space-y-5">
          {jobStats.length > 0 ? jobStats.map((stat, index) => <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">{stat.title}</span>
                  <span className="text-xs font-medium">{stat.screened}/{stat.total} screened</span>
                </div>
                <Progress value={stat.progress} className="h-2" />
              </div>) : <div className="py-4 text-muted-foreground text-center">
              No screening data available
            </div>}
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <AIGenerated>
            <p className="text-sm mb-3">
              Continue screening candidates to improve hiring efficiency and find the best talent faster.
            </p>
            <Button size="sm" variant="outline" className="w-full" asChild>
              <Link to="/recruiter/screening">Resume Screening</Link>
            </Button>
          </AIGenerated>
        </div>
      </div>
    </Card>;
};