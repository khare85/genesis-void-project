
import { Card } from "@/components/ui/card";
import { Users, Clock, Briefcase, CheckCircle2 } from "lucide-react";

export const PipelineMetrics = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="p-6 shadow-md bg-blue-50 border-0">
        <div className="flex flex-row items-center justify-between">
          <div className="text-sm font-medium text-muted-foreground">Active Candidates</div>
          <Users className="h-4 w-4 text-blue-500" />
        </div>
        <div className="mt-2">
          <div className="text-2xl font-bold">245</div>
          <p className="text-xs text-muted-foreground">
            +20% from last month
          </p>
        </div>
      </Card>
      
      <Card className="p-6 shadow-md bg-indigo-50 border-0">
        <div className="flex flex-row items-center justify-between">
          <div className="text-sm font-medium text-muted-foreground">Average Time to Hire</div>
          <Clock className="h-4 w-4 text-indigo-500" />
        </div>
        <div className="mt-2">
          <div className="text-2xl font-bold">18.5</div>
          <p className="text-xs text-muted-foreground">
            Days on average
          </p>
        </div>
      </Card>
      
      <Card className="p-6 shadow-md bg-purple-50 border-0">
        <div className="flex flex-row items-center justify-between">
          <div className="text-sm font-medium text-muted-foreground">Open Positions</div>
          <Briefcase className="h-4 w-4 text-purple-500" />
        </div>
        <div className="mt-2">
          <div className="text-2xl font-bold">12</div>
          <p className="text-xs text-muted-foreground">
            Across 5 departments
          </p>
        </div>
      </Card>
      
      <Card className="p-6 shadow-md bg-sky-50 border-0">
        <div className="flex flex-row items-center justify-between">
          <div className="text-sm font-medium text-muted-foreground">Successful Hires</div>
          <CheckCircle2 className="h-4 w-4 text-sky-500" />
        </div>
        <div className="mt-2">
          <div className="text-2xl font-bold">36</div>
          <p className="text-xs text-muted-foreground">
            In last 6 months
          </p>
        </div>
      </Card>
    </div>
  );
};
