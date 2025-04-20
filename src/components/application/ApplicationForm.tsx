
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { toast } from 'sonner';
import PersonalInformation from './sections/PersonalInformation';
import ProfessionalInformation from './sections/ProfessionalInformation';
import ResumeUploader from './ResumeUploader';
import VideoRecorder from './VideoRecorder';
import TermsAndConditions from './sections/TermsAndConditions';
import { applicationFormSchema, type ApplicationFormData } from './schemas/applicationFormSchema';

interface ApplicationFormProps {
  onSubmit: (formData: ApplicationFormData, resume: File | null, video: Blob | null) => Promise<void>;
  isUploading: boolean;
  isUploadingVideo: boolean;
  resumeStorageUrl: string;
  videoStorageUrl: string;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({
  onSubmit,
  isUploading,
  isUploadingVideo,
  resumeStorageUrl,
  videoStorageUrl
}) => {
  const [resume, setResume] = useState<File | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      linkedIn: '',
      portfolio: '',
      currentCompany: '',
      currentPosition: '',
      yearsOfExperience: '',
      noticePeriod: '',
      salaryExpectation: '',
      coverLetter: '',
      heardFrom: '',
    },
  });

  const handleSubmit = async (formData: ApplicationFormData) => {
    if (!resume) {
      toast.error('Please upload your resume');
      return;
    }
    
    if (!recordedBlob) {
      toast.error('Please record your introduction video');
      return;
    }
    
    if (!consent) {
      toast.error('Please agree to the terms and privacy policy');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await onSubmit(formData, resume, recordedBlob);
      // Success toast handled in submit handler if needed,
      // but ensure it's always here as fallback:
      toast.success('Application submitted successfully!');
    } catch (error) {
      console.error('Error during submission:', error);
      toast.error('Form submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <PersonalInformation form={form} />
        <ProfessionalInformation form={form} />
        <ResumeUploader 
          onResumeChange={setResume}
          isUploading={isUploading}
          resumeStorageUrl={resumeStorageUrl}
        />
        <VideoRecorder 
          onVideoRecorded={setRecordedBlob}
          isUploadingVideo={isUploadingVideo}
          videoStorageUrl={videoStorageUrl}
        />
        <TermsAndConditions 
          consent={consent}
          onConsentChange={setConsent}
        />
        <Button 
          type="submit" 
          size="lg"
          className="bg-[#3054A5] hover:bg-[#264785] w-full"
          disabled={isSubmitting || isUploading || isUploadingVideo}
        >
          {isSubmitting || isUploading || isUploadingVideo ? 'Submitting...' : 'Submit Application'}
        </Button>
      </form>
    </Form>
  );
};

export default ApplicationForm;

