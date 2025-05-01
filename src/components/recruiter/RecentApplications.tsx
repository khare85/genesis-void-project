
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import MatchScoreRing from "@/components/shared/MatchScoreRing";
import { Link } from "react-router-dom";
import { useScreeningData } from "@/hooks/recruiter/useScreeningData";
import { useState, useEffect } from "react";

export const RecentApplications = () => {
  const { screeningData, isLoading } = useScreeningData();
  const [waitingReview, setWaitingReview] = useState<any[]>([]);
  const [reviewedToday, setReviewedToday] = useState<any[]>([]);
  
  useEffect(() => {
    if (screeningData && screeningData.length > 0) {
      // Filter candidates waiting for review
      const pending = screeningData
        .filter(candidate => candidate.status === 'pending')
        .sort((a, b) => new Date(b.applied_date).getTime() - new Date(a.applied_date).getTime())
        .slice(0, 4);
      
      // Filter candidates reviewed today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const reviewed = screeningData
        .filter(candidate => 
          candidate.status !== 'pending' && 
          candidate.reviewed_date && 
          new Date(candidate.reviewed_date) >= today
        )
        .sort((a, b) => new Date(b.reviewed_date || '').getTime() - new Date(a.reviewed_date || '').getTime())
        .slice(0, 4);
      
      setWaitingReview(pending);
      setReviewedToday(reviewed);
    }
  }, [screeningData]);

  return (
    <Card className="col-span-2">
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-medium">Recent Applications</h3>
          <Button variant="outline" size="sm" asChild>
            <Link to="/recruiter/screening">View All</Link>
          </Button>
        </div>
        
        <Tabs defaultValue="waiting">
          <TabsList className="mb-4">
            <TabsTrigger value="waiting">Waiting Review</TabsTrigger>
            <TabsTrigger value="reviewed">Reviewed Today</TabsTrigger>
          </TabsList>
          <TabsContent value="waiting" className="p-0 border-0">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-[72px] rounded-md border animate-pulse bg-muted/50"></div>
                ))}
              </div>
            ) : waitingReview.length > 0 ? (
              <div className="space-y-4">
                {waitingReview.map((candidate) => (
                  <div 
                    key={candidate.id} 
                    className="flex items-center justify-between p-3 rounded-md border hover:border-primary hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <MatchScoreRing score={candidate.match_score || 0} size="sm" />
                      <div>
                        <div className="text-sm font-medium">{candidate.name || 'Unnamed Candidate'}</div>
                        <div className="text-xs text-muted-foreground">
                          {candidate.job_title || 'No Position'} • Applied {new Date(candidate.applied_date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/recruiter/screening?id=${candidate.id}`}>Review</Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No candidates waiting for review
              </div>
            )}
          </TabsContent>
          <TabsContent value="reviewed" className="p-0 border-0">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-[72px] rounded-md border animate-pulse bg-muted/50"></div>
                ))}
              </div>
            ) : reviewedToday.length > 0 ? (
              <div className="space-y-4">
                {reviewedToday.map((candidate) => (
                  <div 
                    key={candidate.id} 
                    className="flex items-center justify-between p-3 rounded-md border hover:border-primary hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <MatchScoreRing score={candidate.match_score || 0} size="sm" />
                      <div>
                        <div className="text-sm font-medium">{candidate.name || 'Unnamed Candidate'}</div>
                        <div className="text-xs text-muted-foreground">
                          {candidate.job_title || 'No Position'} • Reviewed today
                        </div>
                      </div>
                    </div>
                    <Badge variant={candidate.status === "shortlisted" ? "default" : "destructive"}>
                      {candidate.status === "shortlisted" ? "Shortlisted" : "Rejected"}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No candidates reviewed today
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};
