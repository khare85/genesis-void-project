
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from 'react-router-dom';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import ResumeUploader from './ResumeUploader';
import VideoRecorder from './VideoRecorder';

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

type FormData = z.infer<typeof formSchema>;

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
  // Resume and video states
  const [resume, setResume] = useState<File | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [consent, setConsent] = useState(false);

  // Initialize React Hook Form
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

  // Handle form submission
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
        {/* Personal Information */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number *</FormLabel>
                  <FormControl>
                    <Input type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="linkedIn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://linkedin.com/in/yourprofile" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="portfolio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Portfolio URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://yourportfolio.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        {/* Professional Information */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Professional Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="currentCompany"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Company</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currentPosition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Position</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="yearsOfExperience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Years of Experience *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select years of experience" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0-1">0-1 years</SelectItem>
                      <SelectItem value="1-3">1-3 years</SelectItem>
                      <SelectItem value="3-5">3-5 years</SelectItem>
                      <SelectItem value="5-7">5-7 years</SelectItem>
                      <SelectItem value="7-10">7-10 years</SelectItem>
                      <SelectItem value="10+">10+ years</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="noticePeriod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notice Period *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select notice period" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="2-weeks">2 weeks</SelectItem>
                      <SelectItem value="30-days">30 days</SelectItem>
                      <SelectItem value="60-days">60 days</SelectItem>
                      <SelectItem value="90-days">90 days</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="salaryExpectation"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Salary Expectation (Annual) *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. $120,000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        {/* Resume Upload */}
        <ResumeUploader 
          onResumeChange={setResume}
          isUploading={isUploading}
          resumeStorageUrl={resumeStorageUrl}
        />
        
        {/* Video Introduction */}
        <VideoRecorder 
          onVideoRecorded={setRecordedBlob}
          isUploadingVideo={isUploadingVideo}
          videoStorageUrl={videoStorageUrl}
        />
        
        {/* Terms and Conditions */}
        <div className="flex items-top space-x-2">
          <Checkbox 
            id="consent" 
            checked={consent}
            onCheckedChange={(checked) => setConsent(checked === true)} 
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="consent"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I agree to the terms and conditions
            </label>
            <p className="text-xs text-muted-foreground">
              By submitting this application, you agree to our{" "}
              <Link to="/terms" className="text-[#3054A5] underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-[#3054A5] underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
        
        {/* Submit Button */}
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
