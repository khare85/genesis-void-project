
import React from 'react';
import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScreeningCandidate } from "@/types/screening";
import { usePastApplications } from '@/hooks/recruiter/screening/usePastApplications';
interface CandidateHistoryProps {
  candidateId: string;
}
export const CandidateHistory: React.FC<CandidateHistoryProps> = ({
  candidateId
}) => {
  const {
    pastApplications,
    isLoading
  } = usePastApplications(candidateId);
  if (isLoading) {
    return <div className="space-y-2">
        <h4 className="text-sm font-medium">Application History</h4>
        <div className="text-sm text-muted-foreground">Loading history...</div>
      </div>;
  }
  if (!pastApplications || pastApplications.length === 0) {
    return <div className="space-y-2">
        <h4 className="text-sm font-medium">Application History</h4>
        <div className="text-sm text-muted-foreground">No previous applications found.</div>
      </div>;
  }
  return <Card className="border-0 shadow-none">
      <CardHeader className="px-0 pb-2">
        <CardTitle className="text-sm font-bold">Application History</CardTitle>
      </CardHeader>
      <CardContent className="px-0 py-0 space-y-2">
        <div className="space-y-2">
          {pastApplications.map((app, index) => <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">{app.jobRole || 'Unknown Position'}</div>
                  <div className="text-muted-foreground text-xs">{app.applicationDate || 'Unknown date'}</div>
                </div>
              </div>
              <Badge variant={app.status === 'approved' ? 'default' : app.status === 'rejected' ? 'destructive' : 'secondary'} className="ml-2">
                {app.status === 'approved' ? 'Shortlisted' : app.status === 'rejected' ? 'Not Selected' : app.status || 'Pending'}
              </Badge>
            </div>)}
        </div>
      </CardContent>
    </Card>;
};
