
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Clock, Briefcase, CheckCircle2 } from "lucide-react";

export const PipelineMetrics = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="bg-blue-50/70 border-blue-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Candidates</CardTitle>
          <Users className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">245</div>
          <p className="text-xs text-muted-foreground">
            +20% from last month
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-indigo-50/70 border-indigo-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Time to Hire</CardTitle>
          <Clock className="h-4 w-4 text-indigo-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">18.5</div>
          <p className="text-xs text-muted-foreground">
            Days on average
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-purple-50/70 border-purple-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
          <Briefcase className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12</div>
          <p className="text-xs text-muted-foreground">
            Across 5 departments
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-sky-50/70 border-sky-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Successful Hires</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-sky-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">36</div>
          <p className="text-xs text-muted-foreground">
            In last 6 months
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
