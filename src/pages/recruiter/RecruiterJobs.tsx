
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import PageHeader from "@/components/shared/PageHeader";
import { Plus, Briefcase, Filter, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";

const RecruiterJobs = () => {
  const jobs = [
    {
      id: 1,
      title: "Senior Developer",
      department: "Engineering",
      location: "Remote",
      applications: 24,
      status: "Active",
      postedDate: "2025-03-15",
    },
    {
      id: 2,
      title: "Product Manager",
      department: "Product",
      location: "New York, NY",
      applications: 28,
      status: "Active",
      postedDate: "2025-03-20",
    },
    {
      id: 3,
      title: "UX Designer",
      department: "Design",
      location: "San Francisco, CA",
      applications: 15,
      status: "Active",
      postedDate: "2025-03-25",
    },
    {
      id: 4,
      title: "Marketing Specialist",
      department: "Marketing",
      location: "Chicago, IL",
      applications: 12,
      status: "Draft",
      postedDate: "2025-04-01",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Job Listings"
        description="Manage and track all job postings"
        actions={
          <Button size="sm" asChild>
            <Link to="/recruiter/jobs/create" className="gap-1.5">
              <Plus className="h-4 w-4" />
              New Job
            </Link>
          </Button>
        }
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 shadow-sm border-0">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 shadow-sm border-0">
            <SlidersHorizontal className="h-4 w-4" />
            Sort
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          Showing {jobs.length} jobs
        </div>
      </div>

      <div className="space-y-4">
        {jobs.map((job) => (
          <Card key={job.id} className="p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{job.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <span>{job.department}</span>
                    <span>•</span>
                    <span>{job.location}</span>
                    <span>•</span>
                    <span>Posted {new Date(job.postedDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm font-medium">{job.applications} applications</div>
                  <div className={`text-xs ${job.status === 'Active' ? 'text-green-600' : 'text-amber-600'}`}>
                    {job.status}
                  </div>
                </div>
                <Button variant="outline" className="shadow-sm border-0" asChild>
                  <Link to={`/recruiter/jobs/${job.id}`}>View</Link>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecruiterJobs;
