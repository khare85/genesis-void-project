
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";

const ReportsTabContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">                
            <div className="rounded-md border p-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <div>
                    <div className="font-medium">Interview Performance Report</div>
                    <div className="text-sm text-muted-foreground">
                      Detailed analysis of all interviews, including outcomes and feedback.
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
                
                <div className="flex justify-between items-center border-b pb-3">
                  <div>
                    <div className="font-medium">Candidate Pipeline Analysis</div>
                    <div className="text-sm text-muted-foreground">
                      Breakdown of candidates at each stage of the hiring process.
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
                
                <div className="flex justify-between items-center border-b pb-3">
                  <div>
                    <div className="font-medium">Hiring Efficiency Report</div>
                    <div className="text-sm text-muted-foreground">
                      Analysis of time-to-hire, cost-per-hire, and conversion rates.
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
                
                <div className="flex justify-between items-center border-b pb-3">
                  <div>
                    <div className="font-medium">Department Hiring Progress</div>
                    <div className="text-sm text-muted-foreground">
                      Status of hiring goals and progress by department.
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Candidate Source Effectiveness</div>
                    <div className="text-sm text-muted-foreground">
                      Analysis of which candidate sources yield the best hires.
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
            
            <div>
              <Button variant="outline" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Create Custom Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsTabContent;
