
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Calendar,
  CheckCircle,
  Share2,
  Bookmark,
  DollarSign,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary_range?: string;
  description?: string;
  responsibilities?: string[];
  requirements?: string[];
  benefits?: string[];
  posteddate: string;
  category?: string;
  level?: string;
  logourl?: string;
  featured?: boolean;
}

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [similarJobs, setSimilarJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchJobDetails = async () => {
      setIsLoading(true);
      try {
        // Fetch the current job
        const { data: jobData, error: jobError } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', id)
          .single();
        
        if (jobError) {
          console.error("Error fetching job:", jobError);
          toast.error("Failed to load job details");
          return;
        }
        
        setJob(jobData);
        
        // Fetch similar jobs based on category
        if (jobData?.category) {
          const { data: similarJobsData, error: similarJobsError } = await supabase
            .from('jobs')
            .select('*')
            .eq('category', jobData.category)
            .neq('id', id)
            .eq('status', 'active')
            .limit(3);
          
          if (!similarJobsError && similarJobsData) {
            setSimilarJobs(similarJobsData);
          }
        }
      } catch (err) {
        console.error("Error in job fetch:", err);
        toast.error("An error occurred. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchJobDetails();
    }
  }, [id]);
  
  if (isLoading) {
    return (
      <div className="container py-16 text-center">
        <p>Loading job details...</p>
      </div>
    );
  }
  
  if (!job) {
    return (
      <div className="container py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Job Not Found</h2>
        <p className="text-muted-foreground mb-8">The job you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/careers">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Jobs
          </Link>
        </Button>
      </div>
    );
  }
  
  // Calculate days since posting
  const postedDate = new Date(job.posteddate);
  const currentDate = new Date();
  const timeDiff = Math.abs(currentDate.getTime() - postedDate.getTime());
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#3054A5"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M22 12A10 10 0 1 1 12 2a10 10 0 0 1 10 10Z" />
              <path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
              <path d="M22 12h-4" />
            </svg>
            <span className="text-xl font-bold text-[#3054A5]">Persona AI</span>
          </Link>
          
          <nav className="hidden md:flex gap-6">
            <Link to="/" className="text-sm font-medium hover:text-[#3054A5] transition-colors">
              Home
            </Link>
            <Link to="/careers" className="text-sm font-medium text-[#3054A5] border-b-2 border-[#3054A5] transition-colors">
              Careers
            </Link>
            <a href="#about" className="text-sm font-medium hover:text-[#3054A5] transition-colors">
              About
            </a>
            <a href="#contact" className="text-sm font-medium hover:text-[#3054A5] transition-colors">
              Contact
            </a>
          </nav>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="hover:text-[#3054A5]" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <div className="mb-6">
          <Link to="/careers" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-[#3054A5]">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Jobs
          </Link>
        </div>
        
        <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
          {/* Main content */}
          <div>
            <div className="bg-white border rounded-lg p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-6 items-start mb-6">
                <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden">
                  <img src={job.logourl || "https://i.pravatar.cc/100?u=default"} alt={job.company} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-grow">
                  <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
                  <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      <span>{job.company}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{job.type}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span>{job.salary_range || "Competitive"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Posted {daysDiff} days ago</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
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
                  </div>
                </div>
                
                <div className="flex gap-2 self-start mt-2 md:mt-0">
                  <Button variant="outline" size="icon" className="rounded-full" title="Bookmark">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full" title="Share">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-6">
                <Button className="w-full sm:w-auto bg-[#3054A5] hover:bg-[#264785]" asChild>
                  <Link to={`/careers/${job.id}/apply`}>
                    Apply Now <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
                
                <div>
                  <h2 className="font-semibold text-lg mb-3">Job Description</h2>
                  <p className="text-muted-foreground">{job.description}</p>
                </div>
                
                {job.responsibilities && job.responsibilities.length > 0 && (
                  <div>
                    <h2 className="font-semibold text-lg mb-3">Responsibilities</h2>
                    <ul className="space-y-2">
                      {job.responsibilities.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-[#3054A5] mr-2 shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {job.requirements && job.requirements.length > 0 && (
                  <div>
                    <h2 className="font-semibold text-lg mb-3">Requirements</h2>
                    <ul className="space-y-2">
                      {job.requirements.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-[#3054A5] mr-2 shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {job.benefits && job.benefits.length > 0 && (
                  <div>
                    <h2 className="font-semibold text-lg mb-3">Benefits</h2>
                    <ul className="space-y-2">
                      {job.benefits.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-[#3054A5] mr-2 shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <Button className="w-full sm:w-auto bg-[#3054A5] hover:bg-[#264785]" asChild>
                  <Link to={`/careers/${job.id}/apply`}>
                    Apply Now <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Similar jobs */}
            {similarJobs.length > 0 && (
              <div className="bg-white border rounded-lg p-6">
                <h2 className="font-semibold text-lg mb-4">Similar Jobs</h2>
                <div className="space-y-4">
                  {similarJobs.map((similarJob) => (
                    <Link 
                      key={similarJob.id} 
                      to={`/careers/${similarJob.id}`}
                      className="flex items-start gap-4 p-4 border rounded-lg hover:shadow-sm transition-shadow"
                    >
                      <div className="w-12 h-12 bg-slate-100 rounded-md flex items-center justify-center overflow-hidden">
                        <img src={similarJob.logourl || "https://i.pravatar.cc/100?u=default"} alt={similarJob.company} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="font-medium">{similarJob.title}</h3>
                        <div className="text-sm text-muted-foreground mt-1">{similarJob.company} • {similarJob.location}</div>
                        <div className="flex gap-2 mt-2">
                          {similarJob.category && (
                            <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                              {similarJob.category}
                            </div>
                          )}
                          <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                            {similarJob.type}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Sidebar content */}
          <div className="space-y-6">
            <div className="bg-white border rounded-lg p-6">
              <h2 className="font-semibold text-lg mb-4">Company Overview</h2>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden">
                  <img src={job.logourl || "https://i.pravatar.cc/100?u=default"} alt={job.company} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-medium">{job.company}</h3>
                  <div className="text-sm text-muted-foreground">{job.location}</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {job.company} is a leading company in the {job.category?.toLowerCase() || 'technology'} industry, 
                focused on innovation and growth. With a passionate team and strong values, 
                we're building the future of technology.
              </p>
              <Button variant="outline" className="w-full">
                Visit Company Profile
              </Button>
            </div>
            
            <div className="bg-white border rounded-lg p-6">
              <h2 className="font-semibold text-lg mb-4">Job Details</h2>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium">Job Type</div>
                  <div className="text-muted-foreground">{job.type}</div>
                </div>
                {job.level && (
                  <div>
                    <div className="text-sm font-medium">Experience Level</div>
                    <div className="text-muted-foreground">{job.level}</div>
                  </div>
                )}
                {job.salary_range && (
                  <div>
                    <div className="text-sm font-medium">Salary Range</div>
                    <div className="text-muted-foreground">{job.salary_range}</div>
                  </div>
                )}
                {job.category && (
                  <div>
                    <div className="text-sm font-medium">Category</div>
                    <div className="text-muted-foreground">{job.category}</div>
                  </div>
                )}
                <div>
                  <div className="text-sm font-medium">Posted On</div>
                  <div className="text-muted-foreground">{new Date(job.posteddate).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-background mt-auto">
        <div className="container py-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#3054A5"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M22 12A10 10 0 1 1 12 2a10 10 0 0 1 10 10Z" />
                  <path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
                  <path d="M22 12h-4" />
                </svg>
                <span className="text-xl font-bold text-[#3054A5]">Persona AI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Transforming recruitment with AI-powered insights and automated screening.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-sm text-muted-foreground hover:text-[#3054A5]">Home</Link></li>
                <li><Link to="/careers" className="text-sm text-muted-foreground hover:text-[#3054A5]">All Jobs</Link></li>
                <li><Link to="/login" className="text-sm text-muted-foreground hover:text-[#3054A5]">Sign In</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">For Employers</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-[#3054A5]">Post a Job</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-[#3054A5]">Pricing</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-[#3054A5]">Enterprise Solutions</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Contact Us</h4>
              <ul className="space-y-2">
                <li><a href="mailto:info@personaai.com" className="text-sm text-muted-foreground hover:text-[#3054A5]">info@personaai.com</a></li>
                <li><a href="tel:+11234567890" className="text-sm text-muted-foreground hover:text-[#3054A5]">(123) 456-7890</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              © 2025 Persona AI. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-xs text-muted-foreground hover:text-[#3054A5]">Privacy Policy</a>
              <a href="#" className="text-xs text-muted-foreground hover:text-[#3054A5]">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default JobDetail;
