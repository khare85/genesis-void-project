
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import ResumeUploader from './ResumeUploader';
import VideoRecorder from './VideoRecorder';
import { PersonalInformation } from './form-sections/PersonalInformation';
import { ProfessionalInformation } from './form-sections/ProfessionalInformation';
import { ConsentSection } from './form-sections/ConsentSection';

// Define form validation schema with Zod
const formSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().min(1, { message: 'Phone number is required' }),
  linkedIn: z.string().optional(),
  portfolio: z.string().optional(),
  currentCompany: z.string().optional(),
  currentPosition: z.string().optional(),
  yearsOfExperience: z.string().min(1, { message: 'Years of experience is required' }),
  noticePeriod: z.string().min(1, { message: 'Notice period is required' }),
  salaryExpectation: z.string().min(1, { message: 'Salary expectation is required' }),
  coverLetter: z.string().optional(),
  heardFrom: z.string().optional(),
});

export type FormData = z.infer<typeof formSchema>;

interface ApplicationFormProps {
  onSubmit: (formData: FormData, resume: File | null, video: Blob | null) => Promise<void>;
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

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
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

  const handleSubmit = async (formData: FormData) => {
    if (!resume) {
      alert('Please upload your resume');
      return;
    }
    
    if (!recordedBlob) {
      alert('Please record your introduction video');
      return;
    }
    
    if (!consent) {
      alert('Please agree to the terms and privacy policy');
      return;
    }
    
    try {
      await onSubmit(formData, resume, recordedBlob);
    } catch (error) {
      console.error('Error during submission:', error);
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
        
        <ConsentSection 
          consent={consent}
          onConsentChange={setConsent}
        />
        
        <Button 
          type="submit" 
          size="lg"
          className="bg-[#3054A5] hover:bg-[#264785] w-full"
        >
          Submit Application
        </Button>
      </form>
    </Form>
  );
};

export default ApplicationForm;
