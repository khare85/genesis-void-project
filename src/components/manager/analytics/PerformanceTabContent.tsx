import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, BarChart } from "lucide-react";
interface PerformanceTabContentProps {
  departmentHiringData: any[];
}
const PerformanceTabContent: React.FC<PerformanceTabContentProps> = ({
  departmentHiringData
}) => {
  return <div className="space-y-6 bg-white">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Hiring Velocity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <LineChart className="h-12 w-12 mx-auto mb-2" />
                <p>Line chart visualization would appear here</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Department Hiring Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="py-3 px-4 text-left">Department</th>
                    <th className="py-3 px-4 text-left">Open Positions</th>
                    <th className="py-3 px-4 text-left">Filled</th>
                    <th className="py-3 px-4 text-left">Fill Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {departmentHiringData.map(dept => <tr key={dept.department} className="hover:bg-muted/50">
                      <td className="py-3 px-4">{dept.department}</td>
                      <td className="py-3 px-4">{dept.positions}</td>
                      <td className="py-3 px-4">{dept.filled}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${dept.filled / dept.positions > 0.7 ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                          {Math.round(dept.filled / dept.positions * 100)}%
                        </span>
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Cost Per Hire Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <BarChart className="h-12 w-12 mx-auto mb-2" />
              <p>Bar chart visualization would appear here</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
};
export default PerformanceTabContent;