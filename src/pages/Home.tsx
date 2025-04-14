
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getActiveJobs } from "@/services/jobService";
import { Job } from "@/types/job";
import { BriefcaseBusiness, Building2, Calendar, MapPin, PlusCircle, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const jobs = getActiveJobs().slice(0, 6); // Show at most 6 jobs on the home page
  
  const formatSalary = (job: Job) => {
    if (!job.salary?.min && !job.salary?.max) {
      return "Not specified";
    }
    
    const currency = job.salary.currency || "USD";
    
    if (job.salary.min && job.salary.max) {
      return `${currency} ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}`;
    }
    
    if (job.salary.min) {
      return `${currency} ${job.salary.min.toLocaleString()}+`;
    }
    
    if (job.salary.max) {
      return `Up to ${currency} ${job.salary.max.toLocaleString()}`;
    }
    
    return "Not specified";
  };
  
  const formatJobType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ');
  };
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  return (
    <div className="space-y-12">
      {/* Hero section */}
      <section className="text-center py-12 px-6 bg-accent rounded-xl">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Find Your Dream Job
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Browse thousands of job opportunities from top companies around the world.
        </p>
        
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for jobs, companies, or keywords..."
              className="pl-10 h-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  // Navigate to search page with query params
                }
              }}
            />
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
              Remote Jobs
            </Badge>
            <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
              Tech
            </Badge>
            <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
              Marketing
            </Badge>
            <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
              Design
            </Badge>
            <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
              Customer Support
            </Badge>
          </div>
        </div>
      </section>
      
      {/* Featured jobs section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold tracking-tight">
            Featured Jobs
          </h2>
          <Link to="/jobs">
            <Button variant="ghost">
              View all jobs
            </Button>
          </Link>
        </div>
        
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <Card key={job.id} className="overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {job.logo ? (
                        <img 
                          src={job.logo} 
                          alt={job.company} 
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <Building2 className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-base">{job.title}</CardTitle>
                      <CardDescription className="text-sm">{job.company}</CardDescription>
                    </div>
                  </div>
                  <Badge variant={job.type === 'full-time' ? 'default' : 'secondary'}>
                    {formatJobType(job.type)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-2 flex-1">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-1 h-4 w-4" />
                    <span>
                      {job.location.city}, {job.location.country}
                      {job.location.remote && " (Remote)"}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-1 h-4 w-4" />
                    <span>Posted on {formatDate(job.createdAt)}</span>
                  </div>
                  <div className="text-sm font-medium mt-1">
                    Salary: {formatSalary(job)}
                  </div>
                  
                  <p className="text-sm mt-3 line-clamp-3">
                    {job.description}
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Link to={`/jobs/${job.id}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
          
          {jobs.length === 0 && (
            <div className="col-span-full text-center py-12">
              <BriefcaseBusiness className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">No jobs found</h3>
              <p className="text-muted-foreground mb-6">
                Be the first to post a job on our platform!
              </p>
              <Link to="/jobs/create">
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Post a Job
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
      
      {/* Why choose us section */}
      <section className="bg-muted rounded-xl p-8">
        <h2 className="text-2xl font-bold tracking-tight mb-6 text-center">
          Why Choose JobsBoard?
        </h2>
        
        <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <BriefcaseBusiness className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">Quality Jobs</h3>
            <p className="text-muted-foreground">
              Curated listings from top companies around the world.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">Easy to Search</h3>
            <p className="text-muted-foreground">
              Powerful filters to find exactly what you're looking for.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">Top Companies</h3>
            <p className="text-muted-foreground">
              Connect with leading employers in your industry.
            </p>
          </div>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="bg-primary text-primary-foreground rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold tracking-tight mb-3">
          Ready to find your next opportunity?
        </h2>
        <p className="mb-6 max-w-2xl mx-auto">
          Browse our job listings or post a job if you're hiring.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/jobs">
            <Button variant="secondary" size="lg">
              Browse Jobs
            </Button>
          </Link>
          <Link to="/jobs/create">
            <Button variant="outline" size="lg" className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10">
              <PlusCircle className="mr-2 h-4 w-4" />
              Post a Job
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
