
import React from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Users, Briefcase, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import PageHeader from "@/components/shared/PageHeader";
import { PipelineStages } from "@/components/recruiter/pipeline/PipelineStages";
import { PipelineMetrics } from "@/components/recruiter/pipeline/PipelineMetrics";
import { PipelineTimeline } from "@/components/recruiter/pipeline/PipelineTimeline";

const RecruiterPipeline = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Recruitment Pipeline"
        description="Track and manage your recruitment funnel"
        icon={<Users className="h-6 w-6" />}
      />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <PipelineMetrics />
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PipelineStages />
        </div>
        <div>
          <PipelineTimeline />
        </div>
      </div>
    </div>
  );
};

export default RecruiterPipeline;
