
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import ProfileTabs from '@/components/profile/ProfileTabs';
import CareerInsights from '@/components/profile/CareerInsights';
import ProfileCompletionGuide from '@/components/profile/ProfileCompletionGuide';
import { useForm, FormProvider } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Mock data for the profile
const defaultProfileData = {
  personal: {
    name: "Alex Johnson",
    title: "Senior Frontend Developer",
    email: "alex.johnson@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    bio: "Passionate frontend developer with 7+ years of experience building responsive and accessible web applications. Specialized in React, TypeScript, and modern frontend architectures. Open to remote opportunities and excited about working with cutting-edge technologies.",
    links: {
      portfolio: "https://alexjohnson.dev",
      github: "https://github.com/alexjohnson",
      linkedin: "https://linkedin.com/in/alexjohnson",
      twitter: "https://twitter.com/alexjohnson"
    }
  },
  experience: [
    {
      id: 1,
      company: "TechCorp Inc.",
      title: "Senior Frontend Developer",
      location: "San Francisco, CA",
      startDate: "2021-06",
      endDate: null,
      current: true,
      description: "Led a team of 5 developers in building a complex SaaS platform with React, TypeScript, and GraphQL. Improved performance by 40% through code optimization and implemented CI/CD pipelines for seamless deployments.",
      skills: ["React", "TypeScript", "GraphQL", "Redux", "Jest"]
    },
    {
      id: 2,
      company: "StartUp Labs",
      title: "Frontend Developer",
      location: "Austin, TX",
      startDate: "2018-03",
      endDate: "2021-05",
      current: false,
      description: "Developed responsive web applications for various clients using Vue.js and Nuxt. Collaborated with UX designers to implement pixel-perfect interfaces and improve user experience.",
      skills: ["Vue.js", "JavaScript", "SCSS", "Nuxt.js"]
    },
    {
      id: 3,
      company: "Digital Agency Co.",
      title: "Web Developer",
      location: "Portland, OR",
      startDate: "2016-01",
      endDate: "2018-02",
      current: false,
      description: "Created interactive websites for clients across various industries. Worked with WordPress, jQuery, and PHP to build custom solutions.",
      skills: ["WordPress", "jQuery", "PHP", "CSS"]
    }
  ],
  education: [
    {
      id: 1,
      institution: "University of California, Berkeley",
      degree: "BS Computer Science",
      startDate: "2012-09",
      endDate: "2016-05",
      description: "Graduated with honors. Focused on web development and software engineering principles."
    },
    {
      id: 2,
      institution: "Frontend Masters",
      degree: "Advanced React Patterns",
      startDate: "2020-03",
      endDate: "2020-04",
      description: "Intensive course on advanced React patterns and performance optimization."
    }
  ],
  skills: [
    { name: "React", level: 95 },
    { name: "JavaScript", level: 90 },
    { name: "TypeScript", level: 85 },
    { name: "HTML/CSS", level: 95 },
    { name: "GraphQL", level: 80 },
    { name: "Redux", level: 85 },
    { name: "Node.js", level: 75 },
    { name: "Jest/Testing", level: 80 },
    { name: "Webpack", level: 70 },
    { name: "CI/CD", level: 75 }
  ],
  languages: [
    { name: "English", proficiency: "Native" },
    { name: "Spanish", proficiency: "Intermediate" },
    { name: "French", proficiency: "Basic" }
  ],
  certificates: [
    {
      id: 1,
      name: "AWS Certified Developer",
      issuer: "Amazon Web Services",
      issueDate: "2022-01",
      expiryDate: "2025-01",
      credentialId: "AWS-DEV-12345"
    },
    {
      id: 2,
      name: "React Certification",
      issuer: "Meta",
      issueDate: "2021-06",
      expiryDate: null,
      credentialId: "REACT-ADV-7890"
    }
  ],
  projects: [
    {
      id: 1,
      title: "E-commerce Platform",
      description: "Built a complete e-commerce platform with React, Node.js, and MongoDB. Implemented features like product search, filtering, cart functionality, and secure checkout.",
      link: "https://github.com/alexjohnson/ecommerce-platform",
      technologies: ["React", "Node.js", "MongoDB", "Stripe API"]
    },
    {
      id: 2,
      title: "Real-time Dashboard",
      description: "Developed a real-time analytics dashboard using WebSockets and D3.js for data visualization. The dashboard provides immediate insights into user behavior and system performance.",
      link: "https://github.com/alexjohnson/real-time-dashboard",
      technologies: ["React", "D3.js", "WebSockets", "Express"]
    }
  ],
  resumeUrl: "/resume/alex-johnson.pdf",
  videoInterview: null // Initially no video interview
};

const CandidateProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [profileData, setProfileData] = useState(defaultProfileData);
  const [showCompletionGuide, setShowCompletionGuide] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  
  const methods = useForm({
    defaultValues: {
      ...profileData,
    },
  });

  const fetchProfileData = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    
    try {
      // Get basic profile info
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (profileError) throw profileError;

      // Get skills
      const { data: skills, error: skillsError } = await supabase
        .from('candidate_skills')
        .select('*')
        .eq('candidate_id', user.id);
        
      if (skillsError) throw skillsError;

      // Get languages
      const { data: languages, error: languagesError } = await supabase
        .from('candidate_languages')
        .select('*')
        .eq('candidate_id', user.id);
        
      if (languagesError) throw languagesError;

      // Get experience
      const { data: experience, error: experienceError } = await supabase
        .from('candidate_experience')
        .select('*')
        .eq('candidate_id', user.id)
        .order('start_date', { ascending: false });
        
      if (experienceError) throw experienceError;

      // Get education
      const { data: education, error: educationError } = await supabase
        .from('candidate_education')
        .select('*')
        .eq('candidate_id', user.id);
        
      if (educationError) throw educationError;

      // Get certificates
      const { data: certificates, error: certificatesError } = await supabase
        .from('candidate_certificates')
        .select('*')
        .eq('candidate_id', user.id);
        
      if (certificatesError) throw certificatesError;

      // Get projects
      const { data: projects, error: projectsError } = await supabase
        .from('candidate_projects')
        .select('*')
        .eq('candidate_id', user.id);
        
      if (projectsError) throw projectsError;

      // Format data for the profile
      const formattedData = {
        personal: {
          name: `${profileData?.first_name || ''} ${profileData?.last_name || ''}`.trim() || user.name || 'Anonymous User',
          title: profileData?.title || '',
          email: profileData?.email || user.email || '',
          phone: profileData?.phone || '',
          location: profileData?.location || '',
          avatarUrl: profileData?.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          bio: profileData?.bio || '',
          links: {
            portfolio: profileData?.portfolio_url || '',
            github: profileData?.github_url || '',
            linkedin: profileData?.linkedin_url || '',
            twitter: profileData?.twitter_url || '',
          }
        },
        skills: skills?.map(skill => ({
          name: skill.skill_name,
          level: skill.skill_level
        })) || [],
        languages: languages?.map(lang => ({
          name: lang.language_name,
          proficiency: lang.proficiency
        })) || [],
        experience: experience?.map((exp, index) => ({
          id: exp.id,
          company: exp.company,
          title: exp.title,
          location: exp.location,
          startDate: exp.start_date ? exp.start_date.substring(0, 7) : '',
          endDate: exp.end_date ? exp.end_date.substring(0, 7) : null,
          current: exp.current,
          description: exp.description,
          skills: []
        })) || [],
        education: education?.map(edu => ({
          id: edu.id,
          institution: edu.institution,
          degree: edu.degree,
          startDate: edu.start_date ? edu.start_date.substring(0, 7) : '',
          endDate: edu.end_date ? edu.end_date.substring(0, 7) : '',
          description: edu.description
        })) || [],
        certificates: certificates?.map(cert => ({
          id: cert.id,
          name: cert.name,
          issuer: cert.issuer,
          issueDate: cert.issue_date ? cert.issue_date.substring(0, 7) : '',
          expiryDate: cert.expiry_date ? cert.expiry_date.substring(0, 7) : null,
          credentialId: cert.credential_id
        })) || [],
        projects: projects?.map(project => ({
          id: project.id,
          title: project.title,
          description: project.description,
          link: project.link,
          technologies: project.technologies || []
        })) || [],
      };

      // Use default values if data is missing
      const combinedData = {
        personal: { ...defaultProfileData.personal, ...formattedData.personal },
        skills: formattedData.skills.length > 0 ? formattedData.skills : defaultProfileData.skills,
        languages: formattedData.languages.length > 0 ? formattedData.languages : defaultProfileData.languages,
        experience: formattedData.experience.length > 0 ? formattedData.experience : defaultProfileData.experience,
        education: formattedData.education.length > 0 ? formattedData.education : defaultProfileData.education,
        certificates: formattedData.certificates.length > 0 ? formattedData.certificates : defaultProfileData.certificates,
        projects: formattedData.projects.length > 0 ? formattedData.projects : defaultProfileData.projects,
        resumeUrl: defaultProfileData.resumeUrl,
        videoInterview: defaultProfileData.videoInterview
      };

      setProfileData(combinedData);
      methods.reset(combinedData);

      // Calculate profile completion
      const isProfileIncomplete = 
        !profileData?.bio || 
        formattedData.skills.length === 0 || 
        formattedData.experience.length === 0 || 
        formattedData.education.length === 0;
        
      setShowCompletionGuide(isProfileIncomplete);
      
    } catch (error) {
      console.error("Error fetching profile data:", error);
      toast.error("Failed to load your profile data");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Check if we should show the completion guide
  useEffect(() => {
    if (user?.id) {
      fetchProfileData();
    }
    
    // Check for query param to force showing the guide
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('complete') === 'true') {
      setShowCompletionGuide(true);
    }
  }, [user, location.search]);

  const handleSaveChanges = async () => {
    const formData = methods.getValues();
    setProfileData(prevData => ({
      ...prevData,
      ...formData,
    }));
    
    // Here you would typically send the updated data to your backend
    console.log("Saving profile data:", formData);
    
    try {
      // Update the basic profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          bio: formData.personal.bio,
          location: formData.personal.location,
          title: formData.personal.title,
          portfolio_url: formData.personal.links.portfolio,
          github_url: formData.personal.links.github,
          linkedin_url: formData.personal.links.linkedin, 
          twitter_url: formData.personal.links.twitter,
          phone: formData.personal.phone,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
        
      if (profileError) throw profileError;
      
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile data:", error);
      toast.error("Failed to update your profile");
    }
  };
  
  return (
    <FormProvider {...methods}>
      <div className="space-y-6">
        <ProfileHeader 
          isEditing={isEditing} 
          setIsEditing={setIsEditing} 
          onSave={handleSaveChanges}
          refreshProfileData={fetchProfileData}
        />
        
        {showCompletionGuide ? (
          <ProfileCompletionGuide 
            profileData={profileData}
            setActiveTab={setActiveTab}
            setIsEditing={setIsEditing}
          />
        ) : null}
        
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Sidebar with profile summary */}
          <div className="space-y-6">
            <ProfileSidebar 
              profileData={profileData} 
              isEditing={isEditing} 
              form={methods.control ? methods : undefined}
            />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            <ProfileTabs 
              profileData={profileData} 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              isEditing={isEditing}
              form={methods.control ? methods : undefined}
            />

            {/* Career Insights Card */}
            <CareerInsights />
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default CandidateProfilePage;
