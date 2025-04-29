
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from "@/components/shared/PageHeader";
import { ArrowRight, Briefcase, Clock, Filter, MapPin, Search } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useCareersPage } from "@/hooks/careers/useCareersPage";

const CandidateJobs = () => {
  const { user } = useAuth();
  const {
    jobListings,
    isLoading,
    searchTerm,
    setSearchTerm,
    category,
    setCategory,
    location,
    setLocation,
    filteredJobs
  } = useCareersPage();

  const [view, setView] = useState("all");

  // Filter jobs based on the selected tab
  const displayedJobs = view === "all" 
    ? filteredJobs 
    : view === "recommended" 
      ? filteredJobs.filter(job => job.featured) 
      : filteredJobs.filter(job => job.level === "Entry Level" || job.level === "Junior");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Browse Jobs"
        description="Explore job opportunities that match your skills and experience"
      />

      <Card className="p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search job title or keyword"
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger>
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-locations">All Locations</SelectItem>
              <SelectItem value="San Francisco">San Francisco</SelectItem>
              <SelectItem value="New York">New York</SelectItem>
              <SelectItem value="Remote">Remote</SelectItem>
              <SelectItem value="Austin">Austin</SelectItem>
            </SelectContent>
          </Select>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-categories">All Categories</SelectItem>
              <SelectItem value="Engineering">Engineering</SelectItem>
              <SelectItem value="Design">Design</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Product">Product</SelectItem>
              <SelectItem value="Data Science">Data Science</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="mt-6">
          <Tabs defaultValue="all" value={view} onValueChange={setView}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Jobs</TabsTrigger>
              <TabsTrigger value="recommended">Recommended</TabsTrigger>
              <TabsTrigger value="entry-level">Entry Level</TabsTrigger>
            </TabsList>
            
            <div className="text-sm text-muted-foreground mb-4">
              {isLoading ? (
                "Loading jobs..."
              ) : (
                <>Showing <strong>{displayedJobs.length}</strong> available positions</>
              )}
            </div>

            <TabsContent value="all" className="p-0 border-0 mt-0">
              {renderJobList(displayedJobs, isLoading)}
            </TabsContent>
            
            <TabsContent value="recommended" className="p-0 border-0 mt-0">
              {renderJobList(displayedJobs, isLoading)}
            </TabsContent>
            
            <TabsContent value="entry-level" className="p-0 border-0 mt-0">
              {renderJobList(displayedJobs, isLoading)}
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  );
};

// Helper function to render job listings
const renderJobList = (jobs, isLoading) => {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p>Loading available positions...</p>
      </div>
    );
  }

  if (!jobs.length) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No jobs match your search criteria</h3>
        <p className="text-muted-foreground mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
};

const JobCard = ({ job }) => {
  return (
    <Card className={`hover:shadow-md transition-shadow ${job.featured ? 'border-primary/30' : ''}`}>
      <CardContent className="p-6">
        {job.featured && (
          <div className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary font-medium mb-4">
            Featured Opportunity
          </div>
        )}
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold">{job.title}</h3>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2 text-muted-foreground">
              <div className="flex items-center gap-1">
                <Briefcase className="h-4 w-4" />
                <span>{job.company}</span>
              </div>
              <div className="hidden sm:block text-muted-foreground">•</div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{job.location}</span>
              </div>
              <div className="hidden sm:block text-muted-foreground">•</div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{job.type}</span>
              </div>
            </div>
            <p className="text-sm mt-4 max-w-2xl">
              {job.description && job.description.length > 150 
                ? `${job.description.substring(0, 150)}...` 
                : job.description
              }
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {job.category && (
                <Badge variant="outline">{job.category}</Badge>
              )}
              {job.level && (
                <Badge variant="outline">{job.level}</Badge>
              )}
              {job.salary_range && (
                <Badge variant="outline">{job.salary_range}</Badge>
              )}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 md:flex-col lg:flex-row self-end md:self-center">
            <Button variant="outline" asChild>
              <Link to={`/careers/${job.id}`}>
                View Details
              </Link>
            </Button>
            <Button className="gap-1 bg-primary hover:bg-primary/90" asChild>
              <Link to={`/careers/${job.id}/apply`}>
                Apply Now <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CandidateJobs;
