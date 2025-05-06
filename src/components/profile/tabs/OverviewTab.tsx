
import React from 'react';
import { useToast } from "@/hooks/use-toast";
import BioSection from './overview/BioSection';
import ExperienceSection from './overview/ExperienceSection';
import EducationSection from './overview/EducationSection';
import CertificationsSection from './overview/CertificationsSection';

// Helper function to format dates
export const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "Present";
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short'
  }).format(date);
};

interface OverviewTabProps {
  profileData: any;
  isEditing: boolean;
  form?: any;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  profileData,
  isEditing,
  form
}) => {
  const { toast } = useToast();

  // Handler functions for deleting entries
  const handleDeleteExperience = (id: number) => {
    if (!form) return;
    const currentExperiences = [...form.getValues().experience];
    const filtered = currentExperiences.filter(exp => exp.id !== id);
    form.setValue('experience', filtered);
    toast({
      title: "Experience removed",
      description: "The experience has been removed from your profile."
    });
  };
  
  const handleDeleteEducation = (id: number) => {
    if (!form) return;
    const currentEducation = [...form.getValues().education];
    const filtered = currentEducation.filter(edu => edu.id !== id);
    form.setValue('education', filtered);
    toast({
      title: "Education removed",
      description: "The education entry has been removed from your profile."
    });
  };
  
  const handleDeleteCertificate = (id: number) => {
    if (!form) return;
    const currentCertificates = [...form.getValues().certificates];
    const filtered = currentCertificates.filter(cert => cert.id !== id);
    form.setValue('certificates', filtered);
    toast({
      title: "Certificate removed",
      description: "The certificate has been removed from your profile."
    });
  };
  
  return (
    <div className="space-y-8 bg-white">
      <BioSection 
        profileData={profileData}
        isEditing={isEditing}
        form={form}
      />
      
      <ExperienceSection 
        profileData={profileData}
        isEditing={isEditing}
        form={form}
        onDeleteExperience={handleDeleteExperience}
      />
      
      <EducationSection 
        profileData={profileData}
        isEditing={isEditing}
        form={form}
        onDeleteEducation={handleDeleteEducation}
      />
      
      <CertificationsSection 
        profileData={profileData}
        isEditing={isEditing}
        form={form}
        onDeleteCertificate={handleDeleteCertificate}
      />
    </div>
  );
};

export default OverviewTab;
