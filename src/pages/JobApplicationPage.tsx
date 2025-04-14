
import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Briefcase, Clock, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import ApplicationForm from '@/components/application/ApplicationForm';
import JobSidebar from '@/components/application/JobSidebar';

// Define FormData type to match the one in ApplicationForm
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  linkedIn: string;
  portfolio: string;
  currentCompany: string;
  currentPosition: string;
  yearsOfExperience: string;
  noticePeriod: string;
  salaryExpectation: string;
  coverLetter: string;
  heardFrom: string;
}

// Mock job data - same as JobDetail
const jobListings = [
  {
    id: 1,
    title: "Full Stack Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120,000 - $150,000",
    description: "We're looking for an experienced Full Stack Developer to join our growing team...",
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

const JobApplicationPage = () => {
  const { id } = useParams<{ id: string }>();
  const jobId = parseInt(id || '0');
  const job = jobListings.find(j => j.id === jobId);
  
  // File upload state
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  
  // Storage URLs
  const [resumeStorageUrl, setResumeStorageUrl] = useState('');
  const [videoStorageUrl, setVideoStorageUrl] = useState('');
  
  if (!job) {
    return (
      <div className="container py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Job Not Found</h2>
        <p className="text-muted-foreground mb-8">The job you're looking for doesn't exist or has been removed.</p>
        <Link to="/careers" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md">
          <ArrowLeft className="h-4 w-4" /> Back to Jobs
        </Link>
      </div>
    );
  }
  
  // Upload files to Google Cloud Storage
  const uploadFileToGCS = async (file: File | Blob, fileType: 'resume' | 'video', userEmail: string): Promise<string> => {
    try {
      // Create a unique filename
      const timestamp = Date.now();
      const userId = `user-${userEmail.replace('@', '-at-')}`;
      const extension = fileType === 'resume' 
        ? (file as File).name?.split('.').pop() || 'pdf' 
        : 'webm';
      const filename = `${fileType}-${userId}-${timestamp}.${extension}`;
      
      // For this example, we're using a mock GCS upload endpoint
      setIsUploading(fileType === 'resume');
      setIsUploadingVideo(fileType === 'video');
      
      // Create form data for the file upload
      const fileFormData = new FormData();
      fileFormData.append('file', file);
      fileFormData.append('filename', filename);
      fileFormData.append('fileType', fileType);
      
      // Simulate a successful upload after a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate a response from the server with the storage URL
      const mockStorageUrl = `https://storage.googleapis.com/your-bucket-name/${filename}`;
      
      return mockStorageUrl;
    } catch (error) {
      console.error(`Error uploading ${fileType}:`, error);
      toast.error(`Failed to upload ${fileType}. Please try again.`);
      throw error;
    } finally {
      setIsUploading(false);
      setIsUploadingVideo(false);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (formData: FormData, resume: File | null, recordedBlob: Blob | null) => {
    if (!resume) {
      toast.error('Please upload your resume');
      return;
    }
    
    if (!recordedBlob) {
      toast.error('Please record your introduction video');
      return;
    }
    
    try {
      // Upload the resume file
      const resumeUrl = await uploadFileToGCS(resume, 'resume', formData.email);
      setResumeStorageUrl(resumeUrl);
      
      // Upload the video recording
      const videoUrl = await uploadFileToGCS(recordedBlob, 'video', formData.email);
      setVideoStorageUrl(videoUrl);
      
      // Prepare application data with storage URLs
      const applicationData = {
        ...formData,
        resumeUrl,
        videoUrl,
        jobId
      };
      
      console.log('Application data with storage URLs:', applicationData);
      
      // In a real application, you would submit this data to your backend
      toast.success('Application submitted successfully!');
    } catch (error) {
      console.error('Error during submission:', error);
      toast.error('Failed to submit application. Please try again.');
    }
  };

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
            <Link to="/careers" className="text-sm font-medium hover:text-[#3054A5] transition-colors">
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
            <Link to="/login" className="text-sm font-medium hover:text-[#3054A5] transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <div className="mb-6">
          <Link to={`/careers/${jobId}`} className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-[#3054A5]">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Job Details
          </Link>
        </div>
        
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Main content - Application form */}
          <div>
            <div className="bg-white border rounded-lg p-6">
              <h1 className="text-2xl font-bold mb-1">Apply for {job.title}</h1>
              <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-muted-foreground mb-6">
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
              </div>
              
              <ApplicationForm 
                onSubmit={handleSubmit} 
                isUploading={isUploading} 
                isUploadingVideo={isUploadingVideo} 
                resumeStorageUrl={resumeStorageUrl} 
                videoStorageUrl={videoStorageUrl}
              />
            </div>
          </div>
          
          {/* Sidebar */}
          <div>
            <JobSidebar job={job} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobApplicationPage;
