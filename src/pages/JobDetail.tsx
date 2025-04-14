
import React from 'react';
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

// Mock job data
const jobListings = [
  {
    id: 1,
    title: "Full Stack Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120,000 - $150,000",
    description: "We're looking for an experienced Full Stack Developer to join our growing team. This role will be responsible for developing and maintaining our core products, collaborating with cross-functional teams, and building new features from concept to deployment.",
    responsibilities: [
      "Design and implement new features for our web applications",
      "Collaborate with product managers, designers, and other developers",
      "Write clean, maintainable, and efficient code",
      "Troubleshoot and fix bugs in existing applications",
      "Participate in code reviews and provide constructive feedback"
    ],
    requirements: [
      "3+ years of experience with JavaScript/TypeScript, React, and Node.js",
      "Strong understanding of web technologies and RESTful APIs",
      "Experience with database design and SQL/NoSQL databases",
      "Good understanding of software design patterns and principles",
      "Excellent communication and teamwork skills"
    ],
    benefits: [
      "Competitive salary and equity package",
      "Health, dental, and vision insurance",
      "Unlimited PTO and flexible working hours",
      "Remote work options",
      "Professional development budget"
    ],
    postedDate: "2025-03-15",
    category: "Engineering",
    level: "Mid-Senior",
    logoUrl: "https://i.pravatar.cc/100?u=techcorp",
    featured: true
  },
  {
    id: 2,
    title: "UX/UI Designer",
    company: "Design Masters",
    location: "Remote",
    type: "Full-time",
    salary: "$90,000 - $120,000",
    description: "Join our creative team to build beautiful and functional user experiences for our clients. You'll be working closely with our design and development teams to create intuitive interfaces that delight users and drive business results.",
    responsibilities: [
      "Create wireframes, prototypes, and high-fidelity designs",
      "Conduct user research and usability testing",
      "Collaborate with developers to ensure proper implementation",
      "Maintain and evolve our design system",
      "Stay updated on the latest design trends and best practices"
    ],
    requirements: [
      "3+ years of experience in UX/UI design for digital products",
      "Proficiency with design tools like Figma, Sketch, or Adobe XD",
      "Strong portfolio demonstrating your design thinking and process",
      "Understanding of HTML, CSS, and responsive design principles",
      "Excellent communication and presentation skills"
    ],
    benefits: [
      "Competitive salary and performance bonuses",
      "Comprehensive healthcare coverage",
      "Flexible work arrangements",
      "Design conference attendance stipend",
      "Collaborative and supportive team environment"
    ],
    postedDate: "2025-03-20",
    category: "Design",
    level: "Mid-level",
    logoUrl: "https://i.pravatar.cc/100?u=designmasters",
    featured: true
  },
  {
    id: 3,
    title: "DevOps Engineer",
    company: "CloudTech Solutions",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$130,000 - $160,000",
    description: "Help us build and maintain our cloud infrastructure and CI/CD pipelines. In this role, you'll be responsible for improving our deployment processes, ensuring system reliability, and implementing security best practices.",
    responsibilities: [
      "Design and maintain CI/CD pipelines",
      "Manage and optimize cloud infrastructure on AWS/Azure",
      "Implement monitoring, alerting, and logging solutions",
      "Automate deployment and infrastructure management",
      "Collaborate with development teams to improve system performance"
    ],
    requirements: [
      "4+ years of experience in DevOps or Site Reliability Engineering",
      "Strong knowledge of AWS/Azure cloud services",
      "Experience with containerization technologies (Docker, Kubernetes)",
      "Proficiency with infrastructure as code tools (Terraform, CloudFormation)",
      "Strong scripting skills (Bash, Python, etc.)"
    ],
    benefits: [
      "Top-tier salary and stock options",
      "Premium healthcare package",
      "Flexible work schedule and location",
      "Continuous learning opportunities",
      "Modern office with great amenities"
    ],
    postedDate: "2025-03-18",
    category: "Engineering",
    level: "Senior",
    logoUrl: "https://i.pravatar.cc/100?u=cloudtech",
    featured: false
  },
  {
    id: 4,
    title: "Product Manager",
    company: "InnovateCorp",
    location: "New York, NY",
    type: "Full-time",
    salary: "$140,000 - $170,000",
    description: "Lead product development and strategy for our flagship SaaS platform. You'll be responsible for defining product vision, prioritizing features, and coordinating with design and engineering teams to deliver exceptional user experiences.",
    responsibilities: [
      "Define product strategy and roadmap",
      "Gather and prioritize product requirements",
      "Work with design and engineering to deliver new features",
      "Analyze user feedback and market trends to inform product decisions",
      "Communicate product updates to stakeholders and customers"
    ],
    requirements: [
      "5+ years of product management experience in SaaS companies",
      "Strong analytical and problem-solving skills",
      "Experience with Agile/Scrum methodologies",
      "Excellent communication and leadership abilities",
      "Technical background or understanding preferred"
    ],
    benefits: [
      "Competitive compensation package",
      "Comprehensive health benefits",
      "Generous PTO policy",
      "401(k) matching program",
      "Annual professional development stipend"
    ],
    postedDate: "2025-03-10",
    category: "Product",
    level: "Senior",
    logoUrl: "https://i.pravatar.cc/100?u=innovatecorp",
    featured: true
  },
  {
    id: 5,
    title: "Marketing Specialist",
    company: "GrowthHackers",
    location: "Chicago, IL",
    type: "Full-time",
    salary: "$75,000 - $95,000",
    description: "Drive our digital marketing efforts and help us reach new customers. You'll be working on various marketing campaigns, analyzing their performance, and optimizing our strategy to maximize ROI and brand awareness.",
    responsibilities: [
      "Plan and execute digital marketing campaigns",
      "Manage social media accounts and content calendar",
      "Create compelling marketing copy and materials",
      "Analyze campaign performance and metrics",
      "Collaborate with sales team to generate qualified leads"
    ],
    requirements: [
      "2+ years of experience in digital marketing",
      "Knowledge of SEO, SEM, and content marketing",
      "Experience with marketing automation tools",
      "Strong analytical skills and data-driven mindset",
      "Excellent written and verbal communication"
    ],
    benefits: [
      "Competitive base salary plus performance bonuses",
      "Health and wellness benefits",
      "Flexible work arrangements",
      "Marketing conference attendance",
      "Fun and dynamic work environment"
    ],
    postedDate: "2025-03-22",
    category: "Marketing",
    level: "Mid-level",
    logoUrl: "https://i.pravatar.cc/100?u=growthhackers",
    featured: false
  },
  {
    id: 6,
    title: "Data Scientist",
    company: "DataDriven Inc.",
    location: "Remote",
    type: "Full-time",
    salary: "$130,000 - $160,000",
    description: "Apply machine learning and statistical methods to solve complex business problems. You'll work with large datasets to extract insights, build predictive models, and collaborate with product teams to implement data-driven solutions.",
    responsibilities: [
      "Analyze large datasets to identify patterns and insights",
      "Develop machine learning models for prediction and classification",
      "Create data visualizations and reports for stakeholders",
      "Collaborate with engineering to deploy models into production",
      "Research and implement new data science methodologies"
    ],
    requirements: [
      "Masters or PhD in Computer Science, Statistics, or related field",
      "3+ years of experience in data science or machine learning",
      "Proficiency with Python, R, and data science libraries",
      "Experience with big data technologies (Spark, Hadoop)",
      "Strong communication skills to explain complex concepts"
    ],
    benefits: [
      "Industry-leading compensation",
      "Comprehensive benefits package",
      "Remote-first culture with flexible hours",
      "Access to latest computing resources and tools",
      "Ongoing education and conference budget"
    ],
    postedDate: "2025-03-17",
    category: "Data",
    level: "Senior",
    logoUrl: "https://i.pravatar.cc/100?u=datadriven",
    featured: false
  }
];

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const jobId = parseInt(id || '0');
  const job = jobListings.find(j => j.id === jobId);
  
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
  const postedDate = new Date(job.postedDate);
  const currentDate = new Date();
  const timeDiff = Math.abs(currentDate.getTime() - postedDate.getTime());
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
  // Similar jobs (excluding current job)
  const similarJobs = jobListings
    .filter(j => j.category === job.category && j.id !== job.id)
    .slice(0, 3);
  
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
                  <img src={job.logoUrl} alt={job.company} className="w-full h-full object-cover" />
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
                      <span>{job.salary}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Posted {daysDiff} days ago</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                      {job.category}
                    </div>
                    <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                      {job.level}
                    </div>
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
                  {similarJobs.map((job) => (
                    <Link 
                      key={job.id} 
                      to={`/careers/${job.id}`}
                      className="flex items-start gap-4 p-4 border rounded-lg hover:shadow-sm transition-shadow"
                    >
                      <div className="w-12 h-12 bg-slate-100 rounded-md flex items-center justify-center overflow-hidden">
                        <img src={job.logoUrl} alt={job.company} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="font-medium">{job.title}</h3>
                        <div className="text-sm text-muted-foreground mt-1">{job.company} • {job.location}</div>
                        <div className="flex gap-2 mt-2">
                          <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                            {job.category}
                          </div>
                          <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                            {job.type}
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
                  <img src={job.logoUrl} alt={job.company} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-medium">{job.company}</h3>
                  <div className="text-sm text-muted-foreground">{job.location}</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {job.company} is a leading company in the {job.category.toLowerCase()} industry, 
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
                <div>
                  <div className="text-sm font-medium">Experience Level</div>
                  <div className="text-muted-foreground">{job.level}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Salary Range</div>
                  <div className="text-muted-foreground">{job.salary}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Category</div>
                  <div className="text-muted-foreground">{job.category}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Posted On</div>
                  <div className="text-muted-foreground">{new Date(job.postedDate).toLocaleDateString()}</div>
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
