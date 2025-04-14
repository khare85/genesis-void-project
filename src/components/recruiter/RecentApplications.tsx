
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import MatchScoreRing from "@/components/shared/MatchScoreRing";
import { Link } from "react-router-dom";

export const RecentApplications = () => {
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
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div 
                  key={i} 
                  className="flex items-center justify-between p-3 rounded-md border hover:border-primary hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <MatchScoreRing score={85 - i * 8} size="sm" />
                    <div>
                      <div className="text-sm font-medium">Candidate {i}</div>
                      <div className="text-xs text-muted-foreground">Senior Developer • Applied 2h ago</div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <Link to="/recruiter/screening">Review</Link>
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="reviewed" className="p-0 border-0">
            <div className="space-y-4">
              {[5, 6, 7, 8].map((i) => (
                <div 
                  key={i} 
                  className="flex items-center justify-between p-3 rounded-md border hover:border-primary hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <MatchScoreRing score={90 - i * 5} size="sm" />
                    <div>
                      <div className="text-sm font-medium">Candidate {i}</div>
                      <div className="text-xs text-muted-foreground">Product Manager • Reviewed today</div>
                    </div>
                  </div>
                  <Badge variant={i % 2 === 0 ? "default" : "destructive"}>
                    {i % 2 === 0 ? "Shortlisted" : "Rejected"}
                  </Badge>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};
