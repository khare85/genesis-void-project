
import React, { useState } from "react";
import { BarChart as BarChartIcon, Download, Filter, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from "@/components/shared/PageHeader";
import AnalyticsFilters from "@/components/manager/analytics/AnalyticsFilters";
import OverviewTabContent from "@/components/manager/analytics/OverviewTabContent";
import InterviewsTabContent from "@/components/manager/analytics/InterviewsTabContent";
import CandidatesTabContent from "@/components/manager/analytics/CandidatesTabContent";
import PerformanceTabContent from "@/components/manager/analytics/PerformanceTabContent";
import ReportsTabContent from "@/components/manager/analytics/ReportsTabContent";

// Sample data for charts
const interviewsData = [
  { month: 'Jan', completed: 18, scheduled: 22, canceled: 4 },
  { month: 'Feb', completed: 23, scheduled: 28, canceled: 5 },
  { month: 'Mar', completed: 30, scheduled: 35, canceled: 5 },
  { month: 'Apr', completed: 25, scheduled: 32, canceled: 7 },
  { month: 'May', completed: 35, scheduled: 40, canceled: 5 },
  { month: 'Jun', completed: 42, scheduled: 48, canceled: 6 },
];

const feedbackScoresData = [
  { category: 'Technical Skills', score: 4.2 },
  { category: 'Communication', score: 3.8 },
  { category: 'Problem Solving', score: 4.0 },
  { category: 'Cultural Fit', score: 4.5 },
  { category: 'Experience', score: 3.9 },
];

// Update the timeToHireData to work better with a line chart
const timeToHireData = [
  { position: 'Frontend', days: 28 },
  { position: 'Backend', days: 35 },
  { position: 'UX Design', days: 21 },
  { position: 'Product', days: 42 },
  { position: 'DevOps', days: 30 },
];

// Additional data for advanced analytics
const candidateSourceData = [
  { source: 'Job Boards', count: 45 },
  { source: 'Referrals', count: 32 },
  { source: 'LinkedIn', count: 28 },
  { source: 'Company Website', count: 18 },
  { source: 'Recruiters', count: 15 },
];

const hiringVelocityData = [
  { month: 'Jan', velocity: 12 },
  { month: 'Feb', velocity: 15 },
  { month: 'Mar', velocity: 18 },
  { month: 'Apr', velocity: 14 },
  { month: 'May', velocity: 21 },
  { month: 'Jun', velocity: 24 },
];

const interviewerPerformanceData = [
  { interviewer: 'Sarah Miller', interviews: 32, avgRating: 4.7 },
  { interviewer: 'Michael Chen', interviews: 28, avgRating: 4.5 },
  { interviewer: 'Natalie Brown', interviews: 24, avgRating: 4.8 },
  { interviewer: 'David Kim', interviews: 30, avgRating: 4.3 },
  { interviewer: 'Robert Garcia', interviews: 22, avgRating: 4.6 },
];

const departmentHiringData = [
  { department: 'Engineering', positions: 12, filled: 8 },
  { department: 'Product', positions: 8, filled: 5 },
  { department: 'Design', positions: 6, filled: 4 },
  { department: 'Marketing', positions: 5, filled: 3 },
  { department: 'Sales', positions: 7, filled: 6 },
];

const ManagerAnalytics: React.FC = () => {
  const [dateRange, setDateRange] = useState<string>("quarter");
  const [department, setDepartment] = useState<string>("all");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hiring Analytics"
        description="Comprehensive analytics and reports on your hiring activities"
        icon={<BarChartIcon className="h-6 w-6" />}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
            <Button size="sm" className="gap-1.5">
              <Settings className="h-4 w-4" />
              Configure Analytics
            </Button>
          </div>
        }
      />
      
      <AnalyticsFilters
        dateRange={dateRange}
        setDateRange={setDateRange}
        department={department}
        setDepartment={setDepartment}
      />
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4 grid grid-cols-3 md:grid-cols-5 lg:w-[600px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="interviews">Interviews</TabsTrigger>
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <OverviewTabContent
            interviewsData={interviewsData}
            feedbackScoresData={feedbackScoresData}
            timeToHireData={timeToHireData}
          />
        </TabsContent>
        
        {/* Interviews Tab */}
        <TabsContent value="interviews" className="space-y-6">
          <InterviewsTabContent
            interviewsData={interviewsData}
            interviewerPerformanceData={interviewerPerformanceData}
          />
        </TabsContent>
        
        {/* Candidates Tab */}
        <TabsContent value="candidates" className="space-y-6">
          <CandidatesTabContent 
            candidateSourceData={candidateSourceData} 
          />
        </TabsContent>
        
        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <PerformanceTabContent 
            departmentHiringData={departmentHiringData}
          />
        </TabsContent>
        
        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <ReportsTabContent />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManagerAnalytics;
