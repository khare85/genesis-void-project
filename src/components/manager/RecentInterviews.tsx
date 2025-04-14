
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, UserCheck, Video } from "lucide-react";
import { Link } from "react-router-dom";

export const RecentInterviews = () => {
  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-medium">Recent Interviews</h3>
          <Video className="h-4 w-4 text-muted-foreground" />
        </div>
        
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">Candidate {i}</div>
                <div className="text-xs text-muted-foreground">Senior Developer</div>
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                <Link to="/manager/interviews">
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          ))}
          
          <Button variant="outline" size="sm" className="w-full mt-2" asChild>
            <Link to="/manager/interviews">View All Interviews</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
};
