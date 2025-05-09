
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PieChart, BarChart } from "lucide-react";

interface CandidatesTabContentProps {
  candidateSourceData: any[];
}

const CandidatesTabContent: React.FC<CandidatesTabContentProps> = ({
  candidateSourceData,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Candidate Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <PieChart className="h-12 w-12 mx-auto mb-2" />
                <p>Pie chart visualization would appear here</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Candidate Quality by Source</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="py-3 px-4 text-left">Source</th>
                    <th className="py-3 px-4 text-left">Candidates</th>
                    <th className="py-3 px-4 text-left">Avg. Quality</th>
                    <th className="py-3 px-4 text-left">Hired</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {candidateSourceData.map((source) => (
                    <tr key={source.source} className="hover:bg-muted/50">
                      <td className="py-3 px-4">{source.source}</td>
                      <td className="py-3 px-4">{source.count}</td>
                      <td className="py-3 px-4">4.{Math.floor(Math.random() * 9)}/5.0</td>
                      <td className="py-3 px-4">{Math.floor(source.count * 0.3)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Hiring Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <BarChart className="h-12 w-12 mx-auto mb-2" />
              <p>Funnel chart visualization would appear here</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CandidatesTabContent;
