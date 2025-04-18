import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Briefcase, Clock, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import ApplicationForm from '@/components/application/ApplicationForm';
import JobSidebar from '@/components/application/JobSidebar';
import { supabase } from '@/integrations/supabase/client';

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
  logourl?: string;
  featured?: boolean;
  responsibilities?: string[];
  requirements?: string[];
  benefits?: string[];
}

const JobApplicationPage = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  
  const [resumeStorageUrl, setResumeStorageUrl] = useState('');
  const [videoStorageUrl, setVideoStorageUrl] = useState('');
  
  useEffect(() => {
    const fetchJob = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', id)
          .eq('status', 'active')
          .single();
        
        if (error) {
          console.error("Error fetching job:", error);
          toast.error("Failed to load job details");
          return;
        }
        
        setJob(data);
      } catch (err) {
        console.error("Error in job fetch:", err);
        toast.error("An error occurred. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchJob();
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
        <Link to="/careers" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md">
          <ArrowLeft className="h-4 w-4" /> Back to Jobs
        </Link>
      </div>
    );
  }
  
  const uploadFileToStorage = async (file: File | Blob, fileType: 'resume' | 'video', userEmail: string): Promise<string> => {
    try {
      const timestamp = Date.now();
      const sanitizedEmail = userEmail.replace(/[^a-zA-Z0-9]/g, '-');
      const extension = fileType === 'resume' 
        ? (file as File).name?.split('.').pop() || 'pdf' 
        : 'webm';
      const filename = `${fileType}-${sanitizedEmail}-${timestamp}.${extension}`;
      
      if (fileType === 'resume') {
        setIsUploading(true);
      } else {
        setIsUploadingVideo(true);
      }
      
      const { data, error } = await supabase.storage
        .from('applications')
        .upload(`${job.id}/${filename}`, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) {
        throw error;
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('applications')
        .getPublicUrl(`${job.id}/${filename}`);
      
      return publicUrl;
    } catch (error) {
      console.error(`Error uploading ${fileType}:`, error);
      toast.error(`Failed to upload ${fileType}. Please try again.`);
      throw error;
    } finally {
      if (fileType === 'resume') {
        setIsUploading(false);
      } else {
        setIsUploadingVideo(false);
      }
    }
  };
  
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
      const resumeUrl = await uploadFileToStorage(resume, 'resume', formData.email);
      setResumeStorageUrl(resumeUrl);
      
      const videoUrl = await uploadFileToStorage(recordedBlob, 'video', formData.email);
      setVideoStorageUrl(videoUrl);
      
      let candidateId: string;
      
      const { data: existingCandidate } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', formData.email)
        .single();
      
      if (existingCandidate) {
        candidateId = existingCandidate.id;
        
        await supabase
          .from('profiles')
          .update({
            first_name: formData.firstName,
            last_name: formData.lastName,
            company: formData.currentCompany,
            title: formData.currentPosition,
            updated_at: new Date().toISOString()
          })
          .eq('id', candidateId);
      } else {
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: formData.email,
          email_confirm: true,
          user_metadata: {
            first_name: formData.firstName,
            last_name: formData.lastName
          }
        });
        
        if (authError || !authData.user) {
          throw new Error("Failed to create candidate account");
        }
        
        candidateId = authData.user.id;
        
        await supabase
          .from('profiles')
          .insert({
            id: candidateId,
            first_name: formData.firstName,
            last_name: formData.lastName,
            company: formData.currentCompany,
            title: formData.currentPosition
          });
      }
      
      const { data: application, error: applicationError } = await supabase
        .from('applications')
        .insert({
          job_id: job.id,
          candidate_id: candidateId,
          resume_url: resumeUrl,
          video_url: videoStorageUrl,
          status: 'pending',
          notes: formData.coverLetter
        })
        .select('id')
        .single();
      
      if (applicationError) {
        throw applicationError;
      }
      
      toast.success('Application submitted successfully!');
      
      setTimeout(() => {
        navigate('/careers');
      }, 2000);
    } catch (error) {
      console.error('Error during submission:', error);
      toast.error('Failed to submit application. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
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
          <Link to={`/careers/${job.id}`} className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-[#3054A5]">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Job Details
          </Link>
        </div>
        
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
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
          
          <div>
            <JobSidebar job={{
              id: job.id,
              title: job.title,
              company: job.company,
              location: job.location,
              type: job.type,
              salary: job.salary_range || "Competitive",
              postedDate: new Date(job.posteddate).toLocaleDateString(),
              description: job.description || "",
              responsibilities: job.responsibilities || [],
              requirements: job.requirements || [],
              benefits: job.benefits || [],
              category: job.category || "",
              level: job.level || "",
              logoUrl: job.logourl || "",
              featured: job.featured || false
            }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobApplicationPage;
