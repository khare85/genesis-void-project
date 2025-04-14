
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileCheck } from "lucide-react";

export const PendingApprovals = () => {
  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-medium">Pending Approvals</h3>
          <FileCheck className="h-4 w-4 text-muted-foreground" />
        </div>
        
        <div className="space-y-4">
          <div className="p-3 rounded-md border border-muted hover:border-primary hover:bg-muted/30 transition-colors">
            <div className="text-sm font-medium">Job Description: Frontend Developer</div>
            <div className="text-xs text-muted-foreground mb-2">Waiting for your review</div>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" className="text-xs h-7">View</Button>
              <Button size="sm" className="text-xs h-7">Approve</Button>
            </div>
          </div>
          
          <div className="p-3 rounded-md border border-muted hover:border-primary hover:bg-muted/30 transition-colors">
            <div className="text-sm font-medium">Candidate Shortlist: Product Manager</div>
            <div className="text-xs text-muted-foreground mb-2">5 candidates awaiting review</div>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" className="text-xs h-7">View</Button>
              <Button size="sm" className="text-xs h-7">Review</Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
