
import { ArrowUpRight, Briefcase, Check, Clock, FileText, Inbox } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const StatCards = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="ats-stat-card">
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium text-muted-foreground">Active Jobs</div>
          <Briefcase className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <div className="text-2xl font-semibold">8</div>
          <Link to="/recruiter/jobs" className="text-xs text-primary flex items-center">
            View all <ArrowUpRight className="ml-1 h-3 w-3" />
          </Link>
        </div>
      </Card>

      <Card className="ats-stat-card">
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium text-muted-foreground">New Applications</div>
          <Inbox className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <div className="text-2xl font-semibold">34</div>
          <Badge variant="outline" className="text-xs">
            <Clock className="h-3 w-3 mr-1" />
            Today
          </Badge>
        </div>
      </Card>

      <Card className="ats-stat-card">
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium text-muted-foreground">Waiting Review</div>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <div className="text-2xl font-semibold">18</div>
          <Link to="/recruiter/screening" className="text-xs text-primary flex items-center">
            Start <ArrowUpRight className="ml-1 h-3 w-3" />
          </Link>
        </div>
      </Card>

      <Card className="ats-stat-card">
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium text-muted-foreground">Screened Today</div>
          <Check className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <div className="text-2xl font-semibold">21</div>
          <Badge className="bg-ats-accent-green text-white border-none text-xs">+8</Badge>
        </div>
      </Card>
    </div>
  );
};
