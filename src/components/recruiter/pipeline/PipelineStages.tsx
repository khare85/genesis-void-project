
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

// Mock data for pipeline stages
const stages = [
  {
    name: "Applied",
    count: 150,
    progress: 100,
    color: "bg-blue-500",
    change: "+12"
  },
  {
    name: "Screening",
    count: 89,
    progress: 59,
    color: "bg-yellow-500",
    change: "+5"
  },
  {
    name: "Interview",
    count: 45,
    progress: 30,
    color: "bg-purple-500",
    change: "+8"
  },
  {
    name: "Assessment",
    count: 28,
    progress: 19,
    color: "bg-orange-500",
    change: "+3"
  },
  {
    name: "Offer",
    count: 12,
    progress: 8,
    color: "bg-green-500",
    change: "+2"
  }
];

export const PipelineStages = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pipeline Stages</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stages.map((stage) => (
            <div key={stage.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`h-2 w-2 rounded-full ${stage.color}`} />
                  <span className="text-sm font-medium">{stage.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{stage.count}</span>
                  <Badge variant="secondary" className="text-xs">
                    {stage.change}
                  </Badge>
                </div>
              </div>
              <Progress value={stage.progress} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
