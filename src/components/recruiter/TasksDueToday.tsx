
import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";

export const TasksDueToday = () => {
  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-medium">Tasks Due Today</h3>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </div>
        
        <div className="space-y-3">
          <div className="p-3 rounded-md bg-muted/50 border-l-4 border-primary">
            <div className="text-sm font-medium">Review Backend Developer shortlist</div>
            <div className="text-xs text-muted-foreground">Requested by Jordan S.</div>
          </div>
          
          <div className="p-3 rounded-md bg-muted/50 border-l-4 border-ats-accent-orange">
            <div className="text-sm font-medium">Finalize Job Description</div>
            <div className="text-xs text-muted-foreground">Marketing Specialist role</div>
          </div>
          
          <div className="p-3 rounded-md bg-muted/50">
            <div className="text-sm font-medium">Weekly screening report</div>
            <div className="text-xs text-muted-foreground">Due by 5:00 PM</div>
          </div>
        </div>
      </div>
    </Card>
  );
};
