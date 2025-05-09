import React, { useState } from "react";
import {
  BarChart as BarChartIcon,
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  Download,
  Filter,
  Users,
  PieChart,
  TrendingUp,
  TrendingDown,
  LineChart as LineChartIcon,
  Settings,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import PageHeader from "@/components/shared/PageHeader";
import InterviewsChart from "@/components/manager/InterviewsChart";
import FeedbackScoresChart from "@/components/manager/FeedbackScoresChart";
import TimeToHireChart from "@/components/manager/TimeToHireChart";

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
      
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[160px]">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Date Range</span>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={department} onValueChange={setDepartment}>
          <SelectTrigger className="w-[160px]">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Department</span>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="engineering">Engineering</SelectItem>
            <SelectItem value="product">Product</SelectItem>
            <SelectItem value="design">Design</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
            <SelectItem value="sales">Sales</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
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
                <BarChartIcon className="h-4 w-4 text-muted-foreground" />
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

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Interviews Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <InterviewsChart data={interviewsData} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average Feedback Scores</CardTitle>
              </CardHeader>
              <CardContent>
                <FeedbackScoresChart data={feedbackScoresData} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Time to Hire by Position</CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              <TimeToHireChart data={timeToHireData} />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Interviews Tab */}
        <TabsContent value="interviews" className="space-y-6">
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
                <div className="h-[300px] flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <PieChart className="h-12 w-12 mx-auto mb-2" />
                    <p>Pie chart visualization would appear here</p>
                  </div>
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
                    {interviewerPerformanceData.map((interviewer) => (
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
        </TabsContent>
        
        {/* Candidates Tab */}
        <TabsContent value="candidates" className="space-y-6">
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
                  <BarChartIcon className="h-12 w-12 mx-auto mb-2" />
                  <p>Funnel chart visualization would appear here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Hiring Velocity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <LineChartIcon className="h-12 w-12 mx-auto mb-2" />
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
                      {departmentHiringData.map((dept) => (
                        <tr key={dept.department} className="hover:bg-muted/50">
                          <td className="py-3 px-4">{dept.department}</td>
                          <td className="py-3 px-4">{dept.positions}</td>
                          <td className="py-3 px-4">{dept.filled}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              (dept.filled / dept.positions) > 0.7 ? 
                              'bg-green-100 text-green-800' : 
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {Math.round((dept.filled / dept.positions) * 100)}%
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
          
          <Card>
            <CardHeader>
              <CardTitle>Cost Per Hire Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <BarChartIcon className="h-12 w-12 mx-auto mb-2" />
                  <p>Bar chart visualization would appear here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">                
                <div className="rounded-md border p-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-3">
                      <div>
                        <div className="font-medium">Interview Performance Report</div>
                        <div className="text-sm text-muted-foreground">
                          Detailed analysis of all interviews, including outcomes and feedback.
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                    
                    <div className="flex justify-between items-center border-b pb-3">
                      <div>
                        <div className="font-medium">Candidate Pipeline Analysis</div>
                        <div className="text-sm text-muted-foreground">
                          Breakdown of candidates at each stage of the hiring process.
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                    
                    <div className="flex justify-between items-center border-b pb-3">
                      <div>
                        <div className="font-medium">Hiring Efficiency Report</div>
                        <div className="text-sm text-muted-foreground">
                          Analysis of time-to-hire, cost-per-hire, and conversion rates.
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                    
                    <div className="flex justify-between items-center border-b pb-3">
                      <div>
                        <div className="font-medium">Department Hiring Progress</div>
                        <div className="text-sm text-muted-foreground">
                          Status of hiring goals and progress by department.
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">Candidate Source Effectiveness</div>
                        <div className="text-sm text-muted-foreground">
                          Analysis of which candidate sources yield the best hires.
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Button variant="outline" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Create Custom Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManagerAnalytics;
