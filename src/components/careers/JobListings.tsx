
import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary_range?: string;
  description?: string;
  posteddate: string;
  category?: string;
  level?: string;
  featured?: boolean;
}

interface JobListingsProps {
  jobs: Job[];
  isLoading: boolean;
  resetFilters: () => void;
}

const JobCard: React.FC<{ job: Job }> = ({ job }) => {
  return (
    <div 
      className={`bg-white border rounded-lg p-6 hover:shadow-md transition-shadow ${job.featured ? 'border-[#3054A5]/30' : ''}`}
    >
      {job.featured && (
        <div className="inline-flex items-center gap-1 rounded-full bg-[#3054A5]/10 px-3 py-1 text-xs text-[#3054A5] font-medium mb-4">
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
              <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                {job.category}
              </div>
            )}
            {job.level && (
              <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                {job.level}
              </div>
            )}
            {job.salary_range && (
              <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                {job.salary_range}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 md:flex-col lg:flex-row self-end md:self-center">
          <Button variant="outline" asChild>
            <Link to={`/careers/${job.id}`}>
              View Details
            </Link>
          </Button>
          <Button className="bg-[#3054A5] hover:bg-[#264785]" asChild>
            <Link to={`/careers/${job.id}/apply`}>
              Apply Now <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

const JobListings: React.FC<JobListingsProps> = ({ jobs, isLoading, resetFilters }) => {
  return (
    <section className="py-12 flex-grow">
      <div className="container">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Available Positions ({jobs.length})</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Select defaultValue="newest">
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="salary">Salary</SelectItem>
                <SelectItem value="title">Title</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid gap-6">
          {isLoading ? (
            <div className="text-center py-12">
              <p>Loading available positions...</p>
            </div>
          ) : jobs.length > 0 ? (
            jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No job matches your search</h3>
              <p className="text-muted-foreground mt-1">Try adjusting your filters or search term</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={resetFilters}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default JobListings;
