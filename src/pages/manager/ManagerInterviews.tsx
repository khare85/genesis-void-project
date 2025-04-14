
import React, { useState } from "react";
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  Video
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from "@/components/shared/PageHeader";
import InterviewListItem from "@/components/manager/InterviewListItem";

// Sample upcoming interviews
const upcomingInterviews = [
  {
    id: 1,
    candidate: 'Alex Johnson',
    position: 'Senior Frontend Developer',
    date: '2025-04-11',
    time: '10:00 AM',
    interviewer: 'Sarah Miller',
    type: 'Technical',
    status: 'confirmed',
  },
  {
    id: 2,
    candidate: 'Jordan Lee',
    position: 'Product Manager',
    date: '2025-04-11',
    time: '2:30 PM',
    interviewer: 'Michael Chen',
    type: 'Cultural',
    status: 'confirmed',
  },
  {
    id: 3,
    candidate: 'Taylor Wilson',
    position: 'UX Designer',
    date: '2025-04-12',
    time: '11:00 AM',
    interviewer: 'Natalie Brown',
    type: 'Portfolio Review',
    status: 'pending',
  },
  {
    id: 4,
    candidate: 'Casey Rivera',
    position: 'Backend Developer',
    date: '2025-04-15',
    time: '9:30 AM',
    interviewer: 'David Kim',
    type: 'Technical',
    status: 'confirmed',
  },
  {
    id: 5,
    candidate: 'Morgan White',
    position: 'DevOps Engineer',
    date: '2025-04-16',
    time: '3:00 PM',
    interviewer: 'Robert Garcia',
    type: 'Technical',
    status: 'confirmed',
  },
];

// Sample recent interviews
const recentInterviews = [
  {
    id: 101,
    candidate: 'Jamie Smith',
    position: 'Frontend Developer',
    date: '2025-04-08',
    feedback: 'Strong technical skills, good cultural fit',
    score: 4.5,
    status: 'passed',
  },
  {
    id: 102,
    candidate: 'Riley Thompson',
    position: 'Product Manager',
    date: '2025-04-07',
    feedback: 'Great communication, lacks some technical knowledge',
    score: 3.7,
    status: 'consideration',
  },
  {
    id: 103,
    candidate: 'Dana Cooper',
    position: 'UX Designer',
    date: '2025-04-05',
    feedback: 'Excellent portfolio, aligns with company values',
    score: 4.8,
    status: 'passed',
  },
  {
    id: 104,
    candidate: 'Avery Martin',
    position: 'Backend Developer',
    date: '2025-04-03',
    feedback: 'Strong on algorithms, needs improvement on system design',
    score: 3.5,
    status: 'consideration',
  },
];

const ManagerInterviews: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Interviews"
        description="Manage interview schedules and feedback"
        icon={<Video className="h-6 w-6" />}
        actions={
          <div className="flex gap-2">
            <Button size="sm" className="gap-1.5">
              <Calendar className="h-4 w-4" />
              Schedule Interview
            </Button>
          </div>
        }
      />
      
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="mb-4 grid grid-cols-2 w-[300px]">
          <TabsTrigger value="upcoming">Upcoming Interviews</TabsTrigger>
          <TabsTrigger value="recent">Recent Interviews</TabsTrigger>
        </TabsList>
        
        {/* Upcoming Interviews Tab */}
        <TabsContent value="upcoming" className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>Upcoming Interviews</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 space-y-4 sm:flex sm:items-center sm:justify-between sm:space-y-0">
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search candidates..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Filter className="mr-2 h-4 w-4" />
                        Status: {statusFilter === "all" ? "All" : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                        All
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter("confirmed")}>
                        Confirmed
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                        Pending
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              <div className="rounded-md border">
                <div className="grid grid-cols-1 divide-y">
                  {upcomingInterviews.map((interview) => (
                    <InterviewListItem key={interview.id} {...interview} />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Recent Interviews Tab */}
        <TabsContent value="recent" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Interviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-1 divide-y">
                  {recentInterviews.map((interview) => (
                    <InterviewListItem key={interview.id} {...interview} />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManagerInterviews;
