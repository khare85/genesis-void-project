
import React from "react";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, Users, BarChart } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

const StatCards: React.FC = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="ats-stat-card">
        <div className="flex justify-between items-center p-6">
          <div className="text-sm font-medium text-muted-foreground">Total Interviews</div>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="px-6 pb-6">
          <div className="text-2xl font-semibold">148</div>
          <div className="text-xs text-green-500 flex items-center mt-1">
            <TrendingUp className="h-3 w-3 mr-1" />
            22% from last quarter
          </div>
        </div>
      </Card>

      <Card className="ats-stat-card">
        <div className="flex justify-between items-center p-6">
          <div className="text-sm font-medium text-muted-foreground">Avg. Time to Hire</div>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="px-6 pb-6">
          <div className="text-2xl font-semibold">32 days</div>
          <div className="text-xs text-green-500 flex items-center mt-1">
            <TrendingDown className="h-3 w-3 mr-1" />
            5 days from last quarter
          </div>
        </div>
      </Card>

      <Card className="ats-stat-card">
        <div className="flex justify-between items-center p-6">
          <div className="text-sm font-medium text-muted-foreground">Filled Positions</div>
          <Users className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="px-6 pb-6">
          <div className="text-2xl font-semibold">26/38</div>
          <div className="text-xs text-green-500 flex items-center mt-1">
            <TrendingUp className="h-3 w-3 mr-1" />
            68% fill rate
          </div>
        </div>
      </Card>

      <Card className="ats-stat-card">
        <div className="flex justify-between items-center p-6">
          <div className="text-sm font-medium text-muted-foreground">Candidate Quality</div>
          <BarChart className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="px-6 pb-6">
          <div className="text-2xl font-semibold">4.2/5</div>
          <div className="text-xs text-green-500 flex items-center mt-1">
            <TrendingUp className="h-3 w-3 mr-1" />
            0.3 from last quarter
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StatCards;
