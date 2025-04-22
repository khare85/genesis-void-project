
import React from 'react';
import { Button } from '@/components/ui/button';
import { Wand } from 'lucide-react';
import { checkRequiredFields } from '../utils/formValidation';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface GenerateDetailsButtonProps {
  isGenerating: boolean;
  setIsGenerating: (value: boolean) => void;
  setMissingFields: (fields: string[]) => void;
  setShowMissingFieldsAlert: (show: boolean) => void;
  setGeneratedData: (data: any) => void;
}

export const GenerateDetailsButton: React.FC<GenerateDetailsButtonProps> = ({
  isGenerating,
  setIsGenerating,
  setMissingFields,
  setShowMissingFieldsAlert,
  setGeneratedData,
}) => {
  const handleGenerateDetails = () => {
    const jobForm = document.getElementById('job-form') as HTMLFormElement;
    const { isValid, missingFields } = checkRequiredFields(jobForm);
    
    if (!isValid) {
      setMissingFields(missingFields);
      setShowMissingFieldsAlert(true);
      
      toast({
        title: "Missing Information",
        description: `Please fill in these basic details first: ${missingFields.join(', ')}`,
        variant: "destructive",
      });
      
      setTimeout(() => {
        setShowMissingFieldsAlert(false);
      }, 5000);
      
      return;
    }
    
    generateJobDetails(jobForm);
  };

  const generateJobDetails = async (jobForm: HTMLFormElement) => {
    setIsGenerating(true);
    try {
      const formData = new FormData(jobForm);
      // Only include title and company as required fields
      const requestData = {
        title: formData.get('title') as string,
        company: formData.get('company') as string,
        department: formData.get('department') as string || null,
        type: formData.get('type') as string || null,
        level: formData.get('level') as string || null,
      };
      
      console.log('Sending fields to generate job details:', requestData);
      
      const { data, error } = await supabase.functions.invoke('generate-job-details', {
        body: requestData,
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }
      
      console.log('Generated job details:', data);
      setGeneratedData(data);
      
      toast({
        title: "Success",
        description: "Job details generated successfully!",
      });
    } catch (error) {
      console.error('Error generating job details:', error);
      toast({
        title: "Error",
        description: "Failed to generate job details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleGenerateDetails}
      disabled={isGenerating}
      className="gap-2"
    >
      <Wand className="h-4 w-4" />
      {isGenerating ? "Generating..." : "Generate Job Details"}
    </Button>
  );
};
