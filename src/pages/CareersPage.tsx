
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Briefcase, 
  MapPin, 
  Search, 
  Clock, 
  Filter,
  ArrowRight
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock job data
const jobListings = [
  {
    id: 1,
    title: "Full Stack Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120,000 - $150,000",
    description: "We're looking for an experienced Full Stack Developer to join our growing team...",
    postedDate: "2025-03-15",
    category: "Engineering",
    level: "Mid-Senior",
    featured: true
  },
  {
    id: 2,
    title: "UX/UI Designer",
    company: "Design Masters",
    location: "Remote",
    type: "Full-time",
    salary: "$90,000 - $120,000",
    description: "Join our creative team to build beautiful and functional user experiences...",
    postedDate: "2025-03-20",
    category: "Design",
    level: "Mid-level",
    featured: true
  },
  {
    id: 3,
    title: "DevOps Engineer",
    company: "CloudTech Solutions",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$130,000 - $160,000",
    description: "Help us build and maintain our cloud infrastructure and CI/CD pipelines...",
    postedDate: "2025-03-18",
    category: "Engineering",
    level: "Senior",
    featured: false
  },
  {
    id: 4,
    title: "Product Manager",
    company: "InnovateCorp",
    location: "New York, NY",
    type: "Full-time",
    salary: "$140,000 - $170,000",
    description: "Lead product development and strategy for our flagship SaaS platform...",
    postedDate: "2025-03-10",
    category: "Product",
    level: "Senior",
    featured: true
  },
  {
    id: 5,
    title: "Marketing Specialist",
    company: "GrowthHackers",
    location: "Chicago, IL",
    type: "Full-time",
    salary: "$75,000 - $95,000",
    description: "Drive our digital marketing efforts and help us reach new customers...",
    postedDate: "2025-03-22",
    category: "Marketing",
    level: "Mid-level",
    featured: false
  },
  {
    id: 6,
    title: "Data Scientist",
    company: "DataDriven Inc.",
    location: "Remote",
    type: "Full-time",
    salary: "$130,000 - $160,000",
    description: "Apply machine learning and statistical methods to solve complex business problems...",
    postedDate: "2025-03-17",
    category: "Data",
    level: "Senior",
    featured: false
  }
];

const CareersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  
  const filteredJobs = jobListings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === '' || job.category === category;
    const matchesLocation = location === '' || job.location.includes(location);
    
    return matchesSearch && matchesCategory && matchesLocation;
  });
  
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

      {/* Hero section */}
      <section className="bg-gradient-to-r from-[#EFF6FF] to-[#F5F8FF] py-16">
        <div className="container text-center">
          <h1 className="text-4xl font-bold mb-4">Find Your Dream Job</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Browse through our curated selection of top opportunities and take the next step in your career journey.
          </p>
          
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-2 flex flex-col md:flex-row gap-2">
            <div className="flex-grow flex items-center gap-2 bg-background rounded-md px-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Job title, keyword, or company"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
              />
            </div>
            <div className="flex gap-2">
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Location" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-locations">All Locations</SelectItem>
                  <SelectItem value="Remote">Remote</SelectItem>
                  <SelectItem value="San Francisco">San Francisco, CA</SelectItem>
                  <SelectItem value="New York">New York, NY</SelectItem>
                  <SelectItem value="Austin">Austin, TX</SelectItem>
                  <SelectItem value="Chicago">Chicago, IL</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Category" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-categories">All Categories</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Product">Product</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Data">Data</SelectItem>
                </SelectContent>
              </Select>
              
              <Button className="bg-[#3054A5] hover:bg-[#264785]">Search</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Jobs section */}
      <section className="py-12 flex-grow">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Available Positions ({filteredJobs.length})</h2>
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
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <div 
                  key={job.id} 
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
                        {job.description.length > 150 
                          ? `${job.description.substring(0, 150)}...` 
                          : job.description
                        }
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                          {job.category}
                        </div>
                        <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                          {job.level}
                        </div>
                        <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                          {job.salary}
                        </div>
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
              ))
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium">No job matches your search</h3>
                <p className="text-muted-foreground mt-1">Try adjusting your filters or search term</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm('');
                    setCategory('');
                    setLocation('');
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
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

export default CareersPage;
