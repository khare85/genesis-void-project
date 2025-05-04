import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import MatchScoreRing from "@/components/shared/MatchScoreRing";
import { Link } from "react-router-dom";
import { useScreeningData } from "@/hooks/recruiter/useScreeningData";
import { useState, useEffect } from "react";
export const RecentApplications = () => {
  const {
    screeningData,
    isLoading
  } = useScreeningData();
  const [waitingReview, setWaitingReview] = useState<any[]>([]);
  const [reviewedToday, setReviewedToday] = useState<any[]>([]);
  useEffect(() => {
    if (screeningData && screeningData.length > 0) {
      // Filter candidates waiting for review
      const pending = screeningData.filter(candidate => candidate.status === 'pending').sort((a, b) => new Date(b.dateApplied || '').getTime() - new Date(a.dateApplied || '').getTime()).slice(0, 4);

      // Filter candidates reviewed today
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Assume screening is completed today for candidates that are not pending
      // In a real application, you would use an actual review date
      const reviewed = screeningData.filter(candidate => candidate.status !== 'pending').sort((a, b) => (b.reviewTime || 0) - (a.reviewTime || 0)).slice(0, 4);
      setWaitingReview(pending);
      setReviewedToday(reviewed);
    }
  }, [screeningData]);
  return <Card className="col-span-2">
      <div className="p-6 bg-transparent rounded-full">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-medium">Recent Applications</h3>
          <Button variant="outline" size="sm" asChild>
            <Link to="/recruiter/screening">View All</Link>
          </Button>
        </div>
        
        <Tabs defaultValue="waiting">
          <TabsList className="mb-4 bg-transparent">
            <TabsTrigger value="waiting" className="bg-transparent">Waiting Review</TabsTrigger>
            <TabsTrigger value="reviewed">Reviewed Today</TabsTrigger>
          </TabsList>
          <TabsContent value="waiting" className="p-0 border-0">
            {isLoading ? <div className="space-y-4">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-[72px] rounded-md border animate-pulse bg-muted/50"></div>)}
              </div> : waitingReview.length > 0 ? <div className="space-y-4">
                {waitingReview.map(candidate => <div key={candidate.id} className="flex items-center justify-between p-3 rounded-md border hover:border-primary hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <MatchScoreRing score={candidate.matchScore || 0} size="sm" />
                      <div>
                        <div className="text-sm font-medium">{candidate.name || 'Unnamed Candidate'}</div>
                        <div className="text-xs text-muted-foreground">
                          {candidate.position || 'No Position'} • Applied {new Date(candidate.dateApplied || new Date()).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/recruiter/screening?candidateId=${candidate.id}`}>Review</Link>
                    </Button>
                  </div>)}
              </div> : <div className="text-center py-8 text-muted-foreground">
                No candidates waiting for review
              </div>}
          </TabsContent>
          <TabsContent value="reviewed" className="p-0 border-0">
            {isLoading ? <div className="space-y-4">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-[72px] rounded-md border animate-pulse bg-muted/50"></div>)}
              </div> : reviewedToday.length > 0 ? <div className="space-y-4">
                {reviewedToday.map(candidate => <div key={candidate.id} className="flex items-center justify-between p-3 rounded-md border hover:border-primary hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <MatchScoreRing score={candidate.matchScore || 0} size="sm" />
                      <div>
                        <div className="text-sm font-medium">{candidate.name || 'Unnamed Candidate'}</div>
                        <div className="text-xs text-muted-foreground">
                          {candidate.position || 'No Position'} • Reviewed today
                        </div>
                      </div>
                    </div>
                    <Badge variant={candidate.status === "shortlisted" ? "default" : "destructive"}>
                      {candidate.status === "shortlisted" ? "Shortlisted" : "Rejected"}
                    </Badge>
                  </div>)}
              </div> : <div className="text-center py-8 text-muted-foreground">
                No candidates reviewed today
              </div>}
          </TabsContent>
        </Tabs>
      </div>
    </Card>;
};