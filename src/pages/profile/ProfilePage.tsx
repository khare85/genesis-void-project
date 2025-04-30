
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import ProfileTabs from '@/components/profile/ProfileTabs';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const sampleProfileData = {
  personal: {
    name: 'John Smith',
    title: 'Senior Software Engineer',
    email: 'john.smith@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    avatarUrl: 'https://i.pravatar.cc/300',
    links: {
      linkedin: 'https://linkedin.com/in/johnsmith',
      github: 'https://github.com/johnsmith',
      portfolio: 'https://johnsmith.dev',
    }
  },
  bio: 'Passionate software engineer with over 8 years of experience developing scalable applications. Specialized in React, Node.js and cloud technologies. Committed to writing clean, maintainable code and solving complex problems.',
  experience: [
    {
      id: '1',
      company: 'Tech Solutions Inc.',
      title: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      startDate: new Date('2020-06-01'),
      endDate: null,
      current: true,
      description: 'Leading development of cloud-based applications, mentoring junior developers, and implementing CI/CD pipelines.'
    },
    {
      id: '2',
      company: 'Innovate Labs',
      title: 'Software Engineer',
      location: 'Austin, TX',
      startDate: new Date('2018-03-15'),
      endDate: new Date('2020-05-30'),
      current: false,
      description: 'Developed and maintained RESTful APIs for mobile applications. Improved application performance by 40%.'
    }
  ],
  education: [
    {
      id: '1',
      institution: 'University of California, Berkeley',
      degree: 'B.S. Computer Science',
      startDate: new Date('2014-09-01'),
      endDate: new Date('2018-05-15')
    }
  ],
  skills: [
    { name: 'React.js', level: 5 },
    { name: 'Node.js', level: 4 },
    { name: 'TypeScript', level: 4 },
    { name: 'AWS', level: 3 },
    { name: 'Docker', level: 3 }
  ],
  languages: [
    { name: 'English', proficiency: 'Native' },
    { name: 'Spanish', proficiency: 'Intermediate' },
    { name: 'French', proficiency: 'Basic' }
  ],
  projects: [
    {
      id: '1',
      title: 'E-commerce Platform',
      description: 'A full-stack e-commerce solution with payment integration and inventory management.',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe']
    },
    {
      id: '2',
      title: 'Task Management App',
      description: 'A collaborative task management application with real-time updates.',
      technologies: ['React', 'Firebase', 'Material UI']
    }
  ],
  certificates: [
    {
      id: '1',
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      issueDate: '2022-01-15',
      expiryDate: '2025-01-15',
      credentialId: 'AWS-123456'
    },
    {
      id: '2',
      name: 'Certified Scrum Master',
      issuer: 'Scrum Alliance',
      issueDate: '2021-06-10',
      expiryDate: null
    }
  ],
  videoInterview: {
    url: 'https://example.com/interview-video.mp4',
    thumbnailUrl: 'https://example.com/thumbnail.jpg'
  }
};

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [profileData, setProfileData] = useState(sampleProfileData);

  // Setup form for profile editing
  const form = useForm({
    defaultValues: {
      ...profileData
    }
  });

  const handleSave = () => {
    // In a real app, you would save to database here
    const values = form.getValues();
    setProfileData(prevData => ({
      ...prevData,
      ...values
    }));
    setIsEditing(false);
    toast.success("Profile updated successfully");
  };

  const handleAIGenerate = (generatedData: any) => {
    // Update the form and profile data with AI generated content
    if (!generatedData) return;

    // Create a new profile data object with the AI generated content
    const updatedProfileData = { ...profileData };

    // Update bio if available
    if (generatedData.bio) {
      updatedProfileData.bio = generatedData.bio;
    }

    // Update skills if available
    if (generatedData.skills && Array.isArray(generatedData.skills)) {
      updatedProfileData.skills = generatedData.skills;
    }

    // Update location if available
    if (generatedData.location) {
      updatedProfileData.personal = {
        ...updatedProfileData.personal,
        location: generatedData.location
      };
    }

    // Update title if available
    if (generatedData.current_position) {
      updatedProfileData.personal = {
        ...updatedProfileData.personal,
        title: generatedData.current_position
      };
    }

    // Update company if available
    if (generatedData.company) {
      updatedProfileData.personal = {
        ...updatedProfileData.personal,
        company: generatedData.company
      };
    }

    // Update languages if available
    if (generatedData.languages && Array.isArray(generatedData.languages)) {
      updatedProfileData.languages = generatedData.languages;
    }

    // Update the profile data state
    setProfileData(updatedProfileData);
    
    // Update the form values
    form.reset(updatedProfileData);
  };

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="space-y-6">
          <ProfileHeader 
            isEditing={isEditing} 
            setIsEditing={setIsEditing} 
            onSave={handleSave}
            onAIGenerate={handleAIGenerate}
          />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
            <ProfileTabs
              profileData={profileData}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isEditing={isEditing}
              form={form}
            />
            <ProfileSidebar
              profileData={profileData}
              isEditing={isEditing}
              form={form}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
