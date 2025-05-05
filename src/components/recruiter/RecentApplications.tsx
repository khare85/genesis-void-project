
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
  
  return (
    <Card className="col-span-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-white rounded-3xl border-0">
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold">Recent Applications</h3>
          <Button variant="outline" size="sm" asChild className="rounded-full px-5 shadow-sm">
            <Link to="/recruiter/screening">View All</Link>
          </Button>
        </div>
        
        <Tabs defaultValue="waiting">
          <TabsList className="mb-6 w-full p-1 bg-slate-100 rounded-md">
            <TabsTrigger 
              value="waiting" 
              className="flex-1 rounded-md data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-600 py-2.5"
            >
              Waiting Review
            </TabsTrigger>
            <TabsTrigger 
              value="reviewed" 
              className="flex-1 rounded-md data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-600 py-2.5"
            >
              Reviewed Today
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="waiting" className="p-0 border-0">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-[72px] rounded-2xl shadow-md animate-pulse bg-muted bg-opacity-50"></div>
                ))}
              </div>
            ) : waitingReview.length > 0 ? (
              <div className="space-y-4">
                {waitingReview.map(candidate => (
                  <div key={candidate.id} className="flex items-center justify-between p-4 shadow-md hover:shadow-lg transition-shadow rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 overflow-hidden">
                        <div className="absolute inset-0 rounded-full border-4 border-blue-600" style={{
                          clipPath: `inset(0 ${100 - candidate.matchScore}% 0 0)`
                        }}></div>
                        <span className="text-blue-700 font-bold z-10">{candidate.matchScore}</span>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-blue-600">{candidate.name || 'Unnamed Candidate'}</div>
                        <div className="text-sm text-gray-500">
                          {candidate.position || 'No Position'} • Reviewed today
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" asChild className="rounded-full px-5 shadow-sm">
                      <Link to={`/recruiter/screening?candidateId=${candidate.id}`}>Review</Link>
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
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-[72px] rounded-2xl shadow-md animate-pulse bg-muted bg-opacity-50"></div>
                ))}
              </div>
            ) : reviewedToday.length > 0 ? (
              <div className="space-y-4 bg-white">
                {reviewedToday.map(candidate => (
                  <div key={candidate.id} className="flex items-center justify-between p-4 shadow-md hover:shadow-lg transition-shadow rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 overflow-hidden">
                        <div className="absolute inset-0 rounded-full border-4 border-blue-600" style={{
                          clipPath: `inset(0 ${100 - candidate.matchScore}% 0 0)`
                        }}></div>
                        <span className="text-blue-700 font-bold z-10">{candidate.matchScore}</span>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-blue-600">{candidate.name || 'Unnamed Candidate'}</div>
                        <div className="text-sm text-gray-500">
                          {candidate.position || 'No Position'} • Reviewed today
                        </div>
                      </div>
                    </div>
                    <Badge variant={candidate.status === "shortlisted" ? "default" : "destructive"} className="rounded-full px-4 py-1">
                      {candidate.status === "shortlisted" ? "Shortlisted" : "Not Selected"}
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
