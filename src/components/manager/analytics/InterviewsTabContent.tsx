
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PieChart } from "lucide-react";
import InterviewsChart from "@/components/manager/InterviewsChart";
import { PieChart as RechartsPieChart, Pie, ResponsiveContainer, Cell, Tooltip, Legend } from "recharts";

interface InterviewsTabContentProps {
  interviewsData: any[];
  interviewerPerformanceData: any[];
}

const InterviewsTabContent: React.FC<InterviewsTabContentProps> = ({
  interviewsData,
  interviewerPerformanceData
}) => {
  // Interview outcomes data
  const interviewOutcomes = React.useMemo(() => [
    { name: "Passed", value: 65, color: "#4ade80" },
    { name: "Failed", value: 15, color: "#f87171" },
    { name: "No Show", value: 8, color: "#94a3b8" },
    { name: "Rescheduled", value: 12, color: "#fbbf24" }
  ], []);

  return (
    <div className="space-y-6 bg-white">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Interview Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <InterviewsChart data={interviewsData} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Interview Outcome by Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={interviewOutcomes}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {interviewOutcomes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Interviewer Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="py-3 px-4 text-left">Interviewer</th>
                  <th className="py-3 px-4 text-left">Interviews Conducted</th>
                  <th className="py-3 px-4 text-left">Avg. Rating</th>
                  <th className="py-3 px-4 text-left">On-Time Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {interviewerPerformanceData.map(interviewer => (
                  <tr key={interviewer.interviewer} className="hover:bg-muted/50">
                    <td className="py-3 px-4">{interviewer.interviewer}</td>
                    <td className="py-3 px-4">{interviewer.interviews}</td>
                    <td className="py-3 px-4">{interviewer.avgRating}/5.0</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        98%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InterviewsTabContent;
