import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import ProfileTabs from '@/components/profile/ProfileTabs';
import CareerInsights from '@/components/profile/CareerInsights';
import { useForm, FormProvider } from 'react-hook-form';
import ProfileCompletionDialog from '@/components/profile/ProfileCompletionDialog';

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
  
  // Set active tab from localStorage if it exists
  useEffect(() => {
    const savedTab = localStorage.getItem('selectedProfileTab');
    if (savedTab) {
      setActiveTab(savedTab);
      localStorage.removeItem('selectedProfileTab'); // Clear after using
    }
  }, []);
  
  const methods = useForm({
    defaultValues: {
      ...profileData,
    },
  });

  // Check which profile sections are completed
  const getCompletionItems = () => {
    return [
      {
        name: "Personal Information",
        completed: !!profileData.personal.bio && !!profileData.personal.email,
        path: "/candidate/profile",
        tabId: "overview"
      },
      {
        name: "Work Experience", 
        completed: profileData.experience.length > 0,
        path: "/candidate/profile",
        tabId: "experience"
      },
      {
        name: "Education",
        completed: profileData.education.length > 0,
        path: "/candidate/profile", 
        tabId: "education"
      },
      {
        name: "Skills & Languages",
        completed: profileData.skills.length > 0 && profileData.languages.length > 0,
        path: "/candidate/profile",
        tabId: "overview"
      },
      {
        name: "Video Introduction",
        completed: !!profileData.videoInterview,
        path: "/candidate/profile",
        tabId: "video"
      }
    ];
  };

  const completedItems = getCompletionItems();
  const completionPercentage = Math.round(
    (completedItems.filter(item => item.completed).length / completedItems.length) * 100
  );

  const handleSaveChanges = () => {
    const formData = methods.getValues();
    setProfileData(prevData => ({
      ...prevData,
      ...formData,
    }));
    // Here you would typically send the updated data to your backend
    console.log("Saving profile data:", formData);
  };
  
  return (
    <FormProvider {...methods}>
      <div className="space-y-6">
        <ProfileHeader 
          isEditing={isEditing} 
          setIsEditing={setIsEditing} 
          onSave={handleSaveChanges}
        />
        
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Sidebar with profile summary */}
          <div className="space-y-6">
            <ProfileSidebar 
              profileData={profileData} 
              isEditing={isEditing} 
              form={methods.control ? methods : undefined}
            />
            
            {/* Profile Completion Card */}
            {completionPercentage < 100 && (
              <div className="p-4 border rounded-lg shadow-sm bg-white">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-sm">Profile Completion</h3>
                  <span className="text-sm font-medium">{completionPercentage}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden mb-4">
                  <div 
                    className="h-full bg-primary rounded-full" 
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
                <ProfileCompletionDialog 
                  completedItems={completedItems}
                  triggerButton={
                    <Button className="w-full" variant="outline">
                      Complete Profile
                    </Button>
                  }
                />
              </div>
            )}
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
